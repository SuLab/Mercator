angular.module("mercatorApp",['plotly'])
    .factory('plotData',['$http', '$q', '$log', function($http,$q,$log) {
	// csv parser
	function CSVtoArray(text) {
	    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	    // return NULL if input string is not well formed CSV string.
	    if (!re_valid.test(text)) return null;
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
	};


	var factory = {
	    // return column key from data matrix rows 
	    unpack: function(rows,key) {
		return rows.map(function(row) { return row[key]; });
	    },
	    // return promise of tsne data
	    getData: function() {
		return $http.get('/data/tsne_dat.csv');
	    },
	    // parse csv data file for tsne
	    // input:
	    //      text: text of csv file
	    // return:
	    //      promise of resolve lines array
	    processData: function(text) {
		var textLines = text['data'].split(/\r\n|\n/);
		var headers = CSVtoArray(textLines[0]);
		var deferred = $q.defer();

		var lines = [];
		// populate array lines with hashes for rows of csv file
		// length-1 because splitting on new line adds an empty line to the end of the file
		for(var i=1; i < (textLines.length-1); i++){
		    var line = {};
		    var splitLine = CSVtoArray(textLines[i]);
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
		    lines.push(line);
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
	    buildTraces: function(data, traceFields, colorArray = []) {
		var deferred = $q.defer();
		// if no trace fields, return single trace
		if(traceFields.length === 0){
		    deferred.resolve([{
			mode: 'markers',
			name: 'test',
			x: factory.unpack(data,'y1').map(function(x) { return Number(x); }),
			y: factory.unpack(data,'y2').map(function(x) { return Number(x); }),
			type: 'scattergl'
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
					x: factory.unpack(data.filter((line) => {return line.traceName === traceName;}),'y1').map(function(x) { return Number(x); }),
					y: factory.unpack(data.filter((line) => {return line.traceName === traceName;}),'y2').map(function(x) { return Number(x); })
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
    .controller('plotController',['$scope', '$log', 'plotData', function($scope, $log, plotData){
	// Initialization function
	function init() {
	    plotData.getData()
		.then(plotData.processData)
		.then((data) => {
		    $scope.data = data;
		    return plotData.buildTraces(data,[]);
		})
		.then((traces) => {
		    $scope.layout = {
			height: '100%',
			width: '100%',
			title: 'Tsne test!'
		    };
		    $scope.traces = traces;
		    $scope.buildTraces=plotData.buildTraces;
		    $scope.options = {showLink:false};
		    $scope.numberOfSelectedPoints = 0;
		    // function for defining listeners for events emitted by plotly.js
		    $scope.plotlyEvents = (graph) => {
			graph.on('plotly_selected', (event) => {
			    if(event) {
				// $timeout(function() {
				//     $scope.numberOfSelectedPoints = event.points.length;
				// });
				$scope.numberOfSelectedPoints = event.points.length;
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
    // Selectize menu for coloring plot
    .directive('colorSelect', function() {
	return{
	    restrict: 'E',
	    template: '<select></select>',
	    replace: true,
	    controller: ['$scope', ($scope) => {
		var $select = $('#select-groups').selectize({
		    maxItems: null,
		    valueField: 'id',
		    labelField: 'title',
		    searchField: 'title',
		    options: [
			{id: 'project', title: 'Data source'},
			{id: 'tissue_general', title: 'General tissue'},
			{id: 'tissue_detail', title: 'Detailed tissue'},
			{id: 'extraction_kit', title: 'Extraction kit'},
			{id: 'seq_platform', title: 'Sequencing platform'}
		    ],
		    create: false
		});
	    }]
	};
    })
    // Button that allows coloring
    .directive('colorButton', ['plotData', function(plotData) {
    	return{
    	    restrict: 'E',
    	    template: '<input></input>',
    	    replace: true,
    	    controller: ['$scope', ($scope) => {
		$scope.colorize = function() {
		    plotData.buildTraces($scope.data, $scope.trace_fields)
			.then((result) => {
			    $scope.traces=result;
			});
    		};
    	    }]
    	};
    }])
    .factory('httpRequests', ['$http', '$log', function($http, $log) {
	return {
	    post: (url, data, type, successCallback, errorCallback = $log.error()) => {
		$http({
		    url: url,
		    method: 'POST',
		    data: data,
		    headers: {
			'Content-Type': type
		    }
		}).then(successCallback, errorCallback);

	    }
	};
    }])
    .directive('fileInput', ['httpRequests', '$log', function(httpRequests,$log) {
	return{
	    restrict: 'E',
	    template: '<input type="file"></input>',
	    scope: true,
	    replace: true,
	    link: (scope, element, attrs) => {
		scope.url = attrs.url;
		element.on('change', () => {
		    var formData = new FormData();
		    formData.append('file', element[0].files[0]);
		    httpRequests.post(scope.url, formData, $log.log());
		});
	    }
	};
    }]);
