angular.module("mercatorApp",['plotly','ui.select','ngSanitize','olsAutocompleteMod'])

    .factory('csvParse', () => {
	return {
	    CSVtoArray: (text) => {
		var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
		var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
		// return NULL if input string is not well formed CSV string.
		if (!re_valid.test(text)) {return null;}
		var a = [];                     // Initialize array to receive values.

		text.replace(re_value, // "Walk" the string using replace with callback.
			     function(m0, m1, m2, m3) {
				 // Remove backslash from \' in single quoted values.
				 if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
				 // Remove backslash from \" in double quoted values.
				 else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
				 else if (m3 !== undefined) a.push(m3);
				 return ''; // Return empty string.
			     });
		// Handle special case of empty last value.
		if (/,\s*$/.test(text)) a.push('');
		return a;
	    }
	};
    })

    .factory('plotData',['csvParse','$http', '$q', '$log', (csv,$http,$q,$log) => {
	var factory = {
	    // return column key from data matrix rows 

	    unpack: (rows,key) => {
		// return Object.keys(rows).map((row) => { return rows[row][key]; });
		return rows.filter((row) => {return typeof(row) != 'undefined';})
		    .map((row) => { return row[key]; });
	    },
	    // return promise of tsne data

	    getData: () => {
		return $http.get('/data/recount_noAmnio_tsne.csv');
	    },
	    // parse csv data file for tsne
	    // input:
	    //      text: text of csv file
	    // return:
	    //      promise of resolve lines array

	    // getMetadata: () => {
	    // 	return $http.get('data/recount_metadata.json');
	    // },

	    processData: (text) => {
		var textLines = text['data'].split(/\r\n|\n/);
		var headers = csv.CSVtoArray(textLines[0]);
		var deferred = $q.defer();

		var lines = {};
		// populate array lines with hashes for rows of csv file
		// length-1 because splitting on new line adds an empty line to the end of the file
		for(var i=1; i < (textLines.length-1); i++){
		    var line = {};
		    var splitLine = csv.CSVtoArray(textLines[i]);
		    if(splitLine.length != headers.length){
			$log.error('Header length',headers.length);
			$log.error('Line Length',splitLine.length);
			$log.error('Line number:',i);
			deferred.reject('header and line different lengths');
		    }
		    // populate line with attributes from header and values from splitLine
		    for(var j=0; j < headers.length; j++){
			line[headers[j]]=splitLine[j];
		    }
		    // lines.push(line);
		    lines[line.id] = line;
		    // resolve on last loop iteration
		    if(i === (textLines.length-2) && j === (headers.length)){
			deferred.resolve(lines);
		    }
		}
		return deferred.promise;
	    },

	    // Build trace array from data array and tracefields
	    // input:
	    //   data: array of data hashes corresponding to rows of input csv
	    //   traceFields: array of strings corresponding to fields in csv header
	    // return:
	    //   promise with resolve trace array
	    buildTraces: function(data, traceFields) {
		var deferred = $q.defer();
		// if no trace fields, return single trace
		if(!traceFields || traceFields.length === 0){
		    deferred.resolve([{
			mode: 'markers',
			name: 'test',
			x: factory.unpack(Object.keys(data).map(key => data[key]),'y1'),
			y: factory.unpack(Object.keys(data).map(key => data[key]),'y2'),
			type: 'scattergl',
			opacity: 1.0
		    }]);
		}

		else{
		    traces = [];
		    // return single string traceName that defines name of trace for a given entry line and fields traceFields
		    function createTraceName(line,traceFields) {
			var fields=traceFields.map(function(entry) {return line[entry];});
			var traceName = "";
			fields.forEach((entry) => {traceName=traceName.concat(entry," ");});
			return traceName;
		    }
		    var traceNames=new Set();
		    // create array of promises of traceNames (might be overkill?)
		    let nameProcessing = data.map(line => {
		    	return $q((resolve,reject) => {
		    	    traceName = createTraceName(line,traceFields);
		    	    line.traceName = traceName;
		    	    traceNames.add(traceName);
		    	    resolve();
		    	});
		    });

		    $q.all(nameProcessing)
			.then(() => {
			    let traceProcessing = [];
			    // return array of promises of resolve trace
			    traceNames.forEach((traceName) => {
				traceProcessing.push($q((resolve,reject) => {
				    trace = {
					mode: 'markers',
					name: traceName,
					type: 'scattergl',
					x: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}),'y1'),
					y: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}),'y2'),
					// x: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}).map((key) => {data[key];}),'y1'),
					// y: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}).map((key) => {data[key];}),'y2'),
					// y: factory.unpack(data.filter((line) => {return line.traceName === traceName;}),'y2'),
					opacity: 1.0
				    };
				    resolve(trace);
				}));
			    });
			    return $q.all(traceProcessing);
			})
			.then((traces) => deferred.resolve(traces));

		}
		return deferred.promise;
	    }
	};
	return factory; 
    }])
    // Controller for plotly plot

    .controller('plotController',['$http', '$scope', '$log', '$q', 'plotData', '$window', function($http, $scope, $log, $q, plotData, $window){
	var vm = this;

	// vm.colorize = function() {
	//     if(this.trace_fields){
	// 	traceFields = this.trace_fields.map((entry) => {
	// 	    return(entry.id);
	// 	});
	//     }
	//     else{
	// 	traceFields = [];
	//     };
						
	//     plotData.buildTraces($scope.filteredData, traceFields)
	// 	    .then((result) => {
	// 		$scope.traces=result;
	// 	    });
    	//     };

	$scope.filter_select = {"field": undefined,
				"action": undefined,
				"value": undefined};

	$scope.trace_select = {"fields": undefined};

	$scope.valueOptions = [];

	$scope.valueSelectDisabled=true;

	$scope.buildOntologyTraces = function(data,ontology){

	    var deferred = $q.defer();

	    if($scope.ontologyInfo[ontology].length == 0){
		deferred.resolve([{
		    mode: 'markers',
		    name: 'test',
		    x: factory.unpack(data,'y1'),
		    y: factory.unpack(data,'y2'),
		    type: 'scattergl',
		    opacity: 0.5,
		    marker: {color: 'rgb(128,128,128)'}
		}]);
	    }

	    else{
		traces = [];
		runsInTraces = new Set([]);
		ontologyData = $scope.ontologyInfo[ontology];
		samples = Object.keys(data);
		let traceMaking = Object.keys(ontologyData).map(entry => {
		    return $q((resolve,reject) => {
			// runsInTraces = runsInTraces.concat(ontologyData[entry]);
			traceLabel = entry.replace(/\+/g,'<br>');
			runsInTraces = new Set([...runsInTraces,...ontologyData[entry]]); //runsInTraces.concat(ontologyData[entry]);
			traces.push({
			    mode: 'markers',
			    type: 'scattergl',
			    name: traceLabel,
			    // x: plotData.unpack(data.filter((line) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y1'),
			    // x: plotData.unpack(Object.keys(data).filter((key) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y1'),
			    x: plotData.unpack(ontologyData[entry].map((sample) => {return data[sample];}),'y1'),
			    y: plotData.unpack(ontologyData[entry].map((sample) => {return data[sample];}),'y2'),
			    // y: plotData.unpack(data.filter((line) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y2'),
			    opacity: 1.0
			});
			resolve();
		    });
		});
		
		$q.all(traceMaking)
		    .then(() => {
			unLabSamples = samples.filter(x => !runsInTraces.has(x));
			traces.push({
			    mode: 'markers',
			    type: 'scattergl',
			    name: 'unlabeled',
			    x: plotData.unpack(unLabSamples.map((sample) => {return data[sample]; }),'y1'),
			    y: plotData.unpack(unLabSamples.map((sample) => {return data[sample]; }),'y2'),
			    // x: plotData.unpack(data.filter((line) => {return runsInTraces.indexOf(line.id) == -1;}),'y1'),
			    // y: plotData.unpack(data.filter((line) => {return runsInTraces.indexOf(line.id) == -1;}),'y2'),
			    opacity: 0.2
			});
			deferred.resolve(traces);
		    });

	    }
	    return deferred.promise;
	};

	$scope.colorOntology = function(){
	    $scope.traces = $scope.uberonTraces;
	};

	$scope.$watch(
	    function($scope) {
		return $scope.uberon_selection;
	    },
	    function(newValue, oldValue){

		if(newValue && newValue != oldValue){

		    var id = newValue.a_attr.iri.split('/').slice(-1)[0];

		    $http.get('http://localhost:3000/ontology_info/' + id)
			.then((response) => {
			    $scope.ontologyInfo.uberon = response.data;

			    $scope.buildOntologyTraces($scope.filteredData,'uberon')
				.then((ontologyTraces) => {
				    $scope.uberonTraces = ontologyTraces;
				});
			});
		}
	    });

	$scope.$watch(
	    function($scope) {
		return $scope.filter_select.field;
	    },
	    function(newValue,oldValue){
		
		if(newValue && (newValue.id == 'project' || newValue.id == 'seq_platform' || newValue.id == 'extraction_kit')){
		    $http.get('/data/metadata.json').then((response) => {
			
			var result = response.data;

			$scope.valueOptions = result[newValue.id];
			$scope.valueSelectDisabled=false;

		    });
		} else {

		    // if(newValue && (newValue.id == 'tissue_general' || newValue.id == 'tissue_detail')){
			
		    // }
		    
		    $scope.filter_select.value = undefined;
		    $scope.valueSelectDisabled=true;
		    $scope.valueOptions = [];

		}
	    });

	// $scope.$watch(
	//     ($scope) => {
	// 	return $scope.uberon_selection;
	//     },
	//     (newVal, oldVal) => {
	// 	if(newVal && ($scope.filter_select.field.id == 'tissue_general' || $scope.filter_select.field.id == 'tissue_detail')){
	// 	    $scope.filter_select.value={'name': newVal.text, 'id': newVal.id};
	// 	}
	//     });
	//     function(old, new) {
	// 	if (new < 5) 
	// // 	    $http.get('/data/metadata.json').then((response) => {
	// // 		var result = response.data;
	// // 		$scope.valueOptions = result[new];
	// 	}
	//     };
	// );

	// Initialization function

	function init() {

	    $scope.ontologyInfo = {};

	    $scope.groupList = [];
	    $scope.selectedGroup = null;
	    $scope.removeGroup = (id) => {
		$scope.groupList = $scope.groupList.filter((entry) => { return entry.id !== id;});
	    };
	    $scope.addGroup = () => {

		var entry = {
		    marked: false,
		    id: Math.floor(Math.random()*11000),
		    groupName: $scope.inputGroupName,
		    cardinality: $scope.selectedGroup.points.length,
		    groupLabel: $scope.inputGroupName + ': ' + $scope.selectedGroup.points.length
		};

		$scope.groupList.push(entry);

		document.getElementById('addSelectionInput').disabled = true;
		document.getElementById('groupForm').reset();

	    };

	    $scope.attributeOptions = [
		{id: 'project', title: 'Data source'},
		{id: 'tissue_general', title: 'General tissue'},
		{id: 'tissue_detail', title: 'Detailed tissue'},
		{id: 'extraction_kit', title: 'Extraction kit'},
		{id: 'seq_platform', title: 'Sequencing platform'}
	    ];

	    $scope.filterOptions = [
		{id: 'exclude', title: 'Remove'},
		{id: 'include', title: 'Only'}
	    ];

	    plotData.getData()
		.then(plotData.processData)
		.then((data) => {
		    $scope.data = data;
		    $scope.filteredData = data;
		    return plotData.buildTraces(data,[]);
		})
		.then((traces) => {
		    $scope.layout = {
			height: $window.innerHeight,
			width: $window.innerWidth,
			title: 'Tsne test!'
			
		    };
		    $scope.traces = traces;
		    $scope.buildTraces=plotData.buildTraces;
		    $scope.options = {showLink:false};
		    // function for defining listeners for events emitted by plotly.js
		    $scope.plotlyEvents = (graph) => {
			graph.on('plotly_selected', (event) => {
			    if(event) {
				$scope.selectedGroup = event;
				document.getElementById('addSelectionInput').disabled = false;
				$scope.$apply();
			    }
			});
		    };
		})

		.catch(function(error) {
		    $log.error('Failed',error);
		});
	};
	init();
    }])

    .directive('filterInput',['$http', function($http) {
    	return{
	    restrict: 'A',
	    controller: ['$scope', 'plotData', ($scope, plotData) => {
		
		$scope.filterData = () => {

		    function reduceFilters(){

			filterSet = new Set();
			
			$scope.filterList.forEach((entry) => {
			    filterSet.add(entry.field+'+'+entry.action);
			});
			
			var reducedFilters = [];

			filterSet.forEach((entry) => {
			    var ids = entry.split('+');
			    reducedFilters.push({
				value: $scope.filterList.filter((filterEntry) => {return filterEntry.marked && filterEntry.field===ids[0] && filterEntry.action===ids[1];})
				    .reduce((x,y) => x.concat(y.value),[]),
				field: ids[0],
				action: ids[1]
			    });
			});
			
			return reducedFilters;
		    }
		    

		    reducedFilters = reduceFilters();

		    var cnt = 0;

		    $scope.filteredData = reducedFilters.reduce((currData,filterEntry) => {
			cnt++;
			if(filterEntry.action === "exclude"){
			    // return currData.filter((dataEntry) => {return !filterEntry.value.includes(dataEntry[filterEntry.field]); });
			    return Object.keys(currData).filter((dataEntry) => {return !filterEntry.value.includes(currData[dataEntry][filterEntry.field]); }).map((key) => {return currData[key]; });
			}
			else if(filterEntry.action === "include"){
			    return Object.keys(currData).filter((dataEntry) => {return filterEntry.value.includes(currData[dataEntry][filterEntry.field]); }).map((key) => {return currData[key]; });			    
			    // return currData.filter((dataEntry) => {return filterEntry.value.includes(dataEntry[filterEntry.field]); });
			}
			else{
			    return currData;
			}
		    },$scope.data);

		    if(cnt===reducedFilters.length){
			$scope.buildTraces($scope.filteredData,$scope.trace_fields)
			    .then((result) => $scope.traces = result);
		    }

		};

		$scope.removeFilter = (id) => {
		    $scope.filterList = $scope.filterList.filter((entry) => {return entry.id !== id;});
		};

		$scope.addFilter = () => {

		    if($scope.filter_select.field && ($scope.filter_select.field.id == 'tissue_general' || $scope.filter_select.field.id == 'tissue_detail')){
			

			var entry = {
			    marked: true,
			    id: Math.floor(Math.random()*11000),
			    field: $scope.filter_select.field.id,
			    value: $scope.uberon_selection.id,
			    action: $scope.filter_select.action.id,
			    filterLabel: $scope.filter_select.action.title + ' ' + $scope.uberon_selection.text + ' in ' + $scope.filter_select.field.title
			};

			$scope.filterList.push(entry);
			
		    } else {

			
			var entry = {
			    marked: true,
			    id: Math.floor(Math.random()*11000),
			    field: $scope.filter_select.field.id,
			    value: $scope.filter_select.value[0].name,
			    action: $scope.filter_select.action.id,
			    filterLabel: $scope.filter_select.action.title + ' ' + $scope.filter_select.value[0].name + ' in ' + $scope.filter_select.field.title
			};

			$scope.filterList.push(entry);

		    }

		    // $scope.filterList.push(entry);

		};
	    }],
	    link: (scope, element, attrs) => {

		scope.filterList = [];
		
    		// var $select_field = $('#filter-select-field').selectize({
		//     maxItems: 1,
		//     valueField: 'id',
		//     labelField: 'title',
		//     searchField: 'title',
		//     options: [
		// 	{id: 'project', title: 'Data source'},
		// 	{id: 'tissue_general', title: 'General tissue'},
		// 	{id: 'tissue_detail', title: 'Detailed tissue'},
		// 	{id: 'extraction_kit', title: 'Extraction kit'},
		// 	{id: 'seq_platform', title: 'Sequencing platform'}
		//     ],
    		//     onChange: (value) => {
    		// 	if(!value.length) return;
    		// 	select_value.disable();
    		// 	select_value.clearOptions();
		// 	select_value.load((callback) => {
		// 	    $.getJSON("data/metadata.json", (data) => {
		// 		var results = data[value];
		// 		select_value.enable();
		// 		callback(results);
		// 	    });
		// 	});
		//     }
		// });

		// var $select_value = $('#filter-select-value').selectize({
		//     maxItems: null,
		//     valueField: 'name',
		//     labelField: 'name',
		//     searchField: 'name',
		//     create: false
		// });

		// var $select_action = $('#filter-select-action').selectize({
		//     maxItems: 1,
		//     valueField: 'id',
		//     labelField: 'title',
		//     searchField: 'title',
		//     create: false,
		//     options: [
		// 	{id: 'exclude', title: 'Remove'},
		// 	{id: 'include', title: 'Only'}
		// 	]
		// });

		// select_field = $select_field[0].selectize;
		// select_value = $select_value[0].selectize;

		// select_value.disable();
		
	    }
    	};
    }])
    // .directive('ontologySearch',[() => {
    // 	return {
    // 	    restrict: 'E',
    // 	    replace: true,
    // 	    template: '<input style="font-weight: normal" size="35" type="text" name="q" data-olswidget="select" data-olsontology="" data-selectpath="https://www.ebi.ac.uk/ols/" olstype="" id="local-searchbox" placeholder="Enter the term you are looking for" class="ac_input"></input>',
    // 	    link: (scope, element, attrs) => {
    // 		$(document).ready( () => {
    // 		    // var instance = new app();
    // 		    olsAutocompleteMod.olsAutocomplete.start();
    // 		});
    // 	    }
    // 	};
    // }])

    .directive('ontologyExplorer',[() => {
	return{
	    restrict: 'E',
	    replace: true,
	    template: '<div></div>',
	    scope: {
		ont: '@',
		ontNode: '=',
		divid: '@'
	    },
	    controller: ($scope, $http) => {
		$('#'+$scope.divid).on('select_node.jstree', (e, data) => {
		    $scope.ontNode = data.node;
		    
		    $scope.$apply();

		    // // var id = data.node.iri.a_attr.replace("UBERON_(\d{1,})","UBERON:\1");
		    // var id = data.node.a_attr.iri.split('/').slice(-1)[0];
		    
		    // $http.get('http://localhost:3000/ontology_info/' + id)
		    // 	.then((response) => {
		    // 	    $scope.ontologyInfo = response.data;

		    // 	    $scope.$apply();
		    // 	});
			// $scope.filter_select.value = {'id': data.node.id,
		    // 			     'title': data.node.text};

		});

		

		
	    },
	    link: (scope, element, attrs) => {
		// scope.ontN = null;

		var createCORSRequest = function(method, url) {

		    var xhr = new XMLHttpRequest();
		    if ("withCredentials" in xhr) {
			xhr.open(method,url,true);
		    } else if (typeof XDomainRequest != "undefined"){
			xhr = new XDomainRequest();
			xhr.open(method,url);
		    }
		    else {
			xhr = null;
		    }
		    return xhr;
		};


		var tree = $('#'+scope.divid).jstree({
		    'plugins': [],
		    'core': {
			'data': (node,cb) => {
			    url = node.id === '#' ?
				'data/ontologies/roots/' + scope.ont + '_jstree_roots.json':
				'https://www.ebi.ac.uk/ols/api/ontologies/' + scope.ont + '/terms/' + encodeURIComponent(encodeURIComponent(node.original.iri)) + '/jstree/children/' + node.id;
			    var xhr = createCORSRequest('GET', url);

			    if(!xhr){
				alert('Your browser does not support this application! We suggest Chrome or Firefox');
			    }

			    xhr.onload = () => {
				var response = JSON.parse(xhr.response);
				cb.call(this,response);
			    };
			    
			    xhr.onerror = () => {
				alert('Error');
			    };

			    xhr.send();
			}
		    }
		});
			   

	    }
	};
    }])

    // Selectize menu for coloring plot
    // .directive('colorSelect', function() {
    // 	return{
    // 	    restrict: 'E',
    // 	    template: '<select></select>',
    // 	    replace: true,
    // 	    controller: ['$scope', ($scope) => {
    // 		var $select = $('#select-groups').selectize({
    // 		    maxItems: null,
    // 		    valueField: 'id',
    // 		    labelField: 'title',
    // 		    searchField: 'title',
    // 		    options: [
    // 			{id: 'project', title: 'Data source'},
    // 			{id: 'tissue_general', title: 'General tissue'},
    // 			{id: 'tissue_detail', title: 'Detailed tissue'},
    // 			{id: 'extraction_kit', title: 'Extraction kit'},
    // 			{id: 'seq_platform', title: 'Sequencing platform'}
    // 		    ],
    // 		    create: false
    // 		});
    // 	    }]
    // 	};
    // })

    // Button that allows coloring
    .directive('colorButton', ['plotData', function(plotData) {
    	return{
    	    restrict: 'E',
    	    template: '<input></input>',
    	    replace: true,
    	    controller: ['$scope', ($scope) => {
		$scope.colorize = function() {
		    if($scope.trace_select.fields){
			traceFields = $scope.trace_select.fields.map((entry) => {
			    return(entry.id);
			});
		    }
		    else{
			traceFields = [];
		    };
		    
		    plotData.buildTraces($scope.filteredData, traceFields)
			.then((result) => {
			    $scope.traces=result;
			});
    		};
    	    }]
    	};
    }])

    // factory for handling http requests
    .factory('httpRequests', ['$http', '$log', function($http, $log) {
	return {

	    /**  
	     httpRequests.post
	     url: type string
	     data: type json
	     type: type string
	     successCallback: type function handle
	     errorCallback: type function handle

	     return: void
	     */

	    post: (url, data, type) => {
		return $http({
		    url: url,
		    method: 'POST',
		    data: data,
		    headers: {
		    	'Content-Type': type
		    }
		});

	    }
	};
    }])

/**
 file input directive
 */

    .directive('fileInput', ['csvParse', 'httpRequests', '$log', function(csv, httpRequests, $log) {
	return{
	    restrict: 'E',
	    replace: true,
	    template: `<input type="file"></input>`,
	    scope: {
		url: '@',
		storage: '=',
		status: '='
		}, // isolated scope
	    link: (scope, element, attrs) => {

		element.on('change', () => {
		    document.getElementById('pcaButton').disabled = true;
		    scope.status="Processing...";
		    var output = "";
		    reader = new FileReader();
		    if(element[0].files && element[0].files[0]){
			reader.onload = (event) => {
			    output = event.target.result;
			    httpRequests.post(scope.url, output, 'text/plain')

				.then((response) =>{
				    document.getElementById('pcaButton').disabled=false;
				    scope.status="Color by Distance";
				    var textLines = response.data.split(/\r\n|\n/);
				    scope.storage = {};
				    textLines.forEach((entry) => {
					entryParsed = csv.CSVtoArray(entry);
					scope.storage[entryParsed[0]] = entryParsed[1];
				    });
				},(response) => {
				    $log.error(response);
				});
			};
			reader.readAsText(element[0].files[0]);
		    }
		});
	    }
	};
    }])

    .directive('distButton', [() => {
	return{
	    restrict: 'E',
	    replace: true,
	    template: `<input type="button"></input>`,
	    controller: ['plotData', '$q', '$scope', (plotData, $q, $scope) => {

		$scope.euclid_pca_status="Waiting for file";

		$scope.colorTrace = function(colorHash)	{
		    var deferred = $q.defer();
		    var colorVec = [];
		    for(i=0; i<$scope.filteredData.length; i++){
			colorVec.push(colorHash[$scope.filteredData[i]['data_id']]);
		    }

		    if(i===$scope.filteredData.length){
			deferred.resolve([{
			    mode: 'markers',
			    name: 'test',
			    x: plotData.unpack($scope.filteredData,'y1'),
			    y: plotData.unpack($scope.filteredData,'y2'),
			    text: colorVec,
			    type: 'scattergl',
			    hoverinfo: 'text',
			    marker: {
				color: colorVec,
				showscale: true
			    }
			}]);
		    }
		    return deferred.promise;
		};

		$scope.colorClick = function(colorHash) {
		    $scope.colorTrace(colorHash)
			.then((response) => {
			    $scope.traces = response;
			});
		};
	    }]
	};
    }]);

