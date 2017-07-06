angular.module("mercatorApp",['plotly'])
    .factory('plotData',function($http,$q,$log) {

	function unpack(rows,key) {
	    return rows.map(function(row) { return row[key]; });
	}

	// function processData(text) {

	//     var textLines = text['data'].split(/\r\n|\n/);
	//     var headers = textLines[0].split(',');
	//     var deffered = $q.defer();

	//     lines = [];

	//     for(var i=1; i < textLines.length; i++){
	// 	var line = {}
	// 	var splitLine = textLines[i].split(',');
	// 	for(var j=0; j < headers.length; j++){
	// 	    line[headers[j]]=splitLine[j];
	// 	}
	// 	lines.push(line);
	//     }
	    
	//     return deffered.promise;
	// }

	function CSVtoArray(text) {
	    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	    // Return NULL if input string is not well formed CSV string.
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
	    unpack: function(rows,key) {
		return rows.map(function(row) { return row[key]; });
	    },
	    getData: function() {
		return $http.get('/data/tsne_dat.csv');
	    },
	    processData: function(text) {

		var textLines = text['data'].split(/\r\n|\n/);
		// var headers = textLines[0].split(',');
		var headers = CSVtoArray(textLines[0]);
		var deferred = $q.defer();

		var lines = [];

		for(var i=1; i < (textLines.length-1); i++){
		    var line = {};
		    var splitLine = CSVtoArray(textLines[i]);
		    // var splitLine = textLines[i].split(',');
		    if(splitLine.length != headers.length){
			$log.error('Header length',headers.length);
			$log.error('Line Length',splitLine.length);
			$log.error('Line number:',i);
			deferred.reject('header and line different lengths');
		    }
		    for(var j=0; j < headers.length; j++){
			line[headers[j]]=splitLine[j];
		    }
		    lines.push(line);
		    if(i === (textLines.length-2) && j === (headers.length)){
			deferred.resolve(lines);
		    }
		}
		return deferred.promise;
	    },
	    buildTraces: function(data,traceFields) {
		var deferred = $q.defer();
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
		    // Can create list of all combinations by looping, then make set OR
		    // Can loop through and all entries as need be, creating
		    traces = [];
		    function createTraceName(line,traceFields) {
			var fields=traceFields.map(function(entry) {return line[entry];});
			var traceName = "";
			fields.forEach((entry) => {traceName=traceName.concat(entry," ");});
			return traceName;
		    }
		    var traceNames=new Set();
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
			    traceNames.forEach(traceName => {
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
    })
    .controller('plotController', function($scope, $timeout, $log, plotData){

	// $scope.traces = plotData.traces;
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
		    $scope.plotlyEvents = function (graph){
			graph.on('plotly_selected',function(event){
			    if(event) {
				// $timeout(function() {
				//     $scope.numberOfSelectedPoints = event.points.length;
				// });
				$scope.numberOfSelectedPoints = event.points.length;
				$scope.$digest();
			    }
			});
		    };
		})
		.catch(function(error) {
		    $log.error('Failed',error);
		});
	};
	init();
    })
    .directive('colorSelect', function() {
	return{
	    restrict: 'E',
	    template: '<select></select>',
	    replace: true,
	    controller: ['$scope',($scope) => {
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
    .directive('colorButton', ['plotData' , function(plotData) {
    	return{
    	    restrict: 'E',
    	    template: '<input></input>',
    	    replace: true,
    	    controller: ['$scope',($scope) => {
		$scope.colorize = function() {
		    plotData.buildTraces($scope.data,$scope.trace_fields)
			.then((result) => {
			    $scope.traces=result;
			});
    		};
    	    }]
    	};
    }]);
	    


    // function readDat() {
    // 	Plotly.d3.csv('data/tsne_dat.csv',function(err,rows){
	    
    // 	    for (i=0; i < rows.length; i++){
    // 		rows[i]['y1'] = Number(rows[i]['y1']);
    // 		rows[i]['y2'] = Number(rows[i]['y2']);
    // 	    }

    // 	    $scope.data = rows;
    // 	});
    // }

    // function buildTraces(trace_fields) {

    // 	$scope.traces = {
    // 	    mode: 'markers',
    // 	    name: 'test',
    // 	    x: unpack($scope.data,'y1').map(function(x) { return Number(x); }),
    // 	    y: unpack($scope.data,'y2').map(function(x) { return Number(x); }),
    // 	    type: 'scattergl'
    // 	};

    // };

    // function unpack(rows,key) {
    // 	return rows.map(function(row) { return row[key]; });
    // };

    // var init = function() {

    // 	readDat();

    // 	buildTraces([]);

    // }

    // $scope.data = readDat();

    // $scope.buildTraces = function(trace_fields) {

    // 	// TODO write code here to build more complex traces, for now will just handle a traces.length === 0 case
	
    // 	return {
    // 	    mode: 'markers',
    // 	    name: 'test',
    // 	    x: unpack(rows,'y1').map(function(x) { return Number(x); }),
    // 	    y: unpack(rows,'y2').map(function(x) { return Number(x); }),
    // 	    type: 'scattergl'
    // 	};

    // };

    // $scope.buildTraces = buildTraces();


// module.factory('tsnePlot',['$rootscope', function($rootscope){
    
//     function readDat() {
	
// 	Plotly.d3.csv('data/tsne_dat.csv',function(err,rows){

// 	    for (i=0 i < rows.length; i++){
// 		rows[i]['y1'] = Number(rows[i]['y1']);
// 		rows[i]['y2'] = Number(rows[i]['y2']);
// 	    }

// 	    return rows;
// 	});
//     };

//     function buildTraces(fields){
// 	// put code for building traces from a set of fields here
//     }
		     
//     data = readDat();

//     var factory = {
	
// 	tsneArray: data,
	
// 	getTraces: function (rows) {


// 	}

//     }

//     return factory;
		    // for(i = 0, i < data.length; i++){
		    // 	line = data[i];
		    // 	traceName = createTraceName(line,trace_fields);
		    // 	line['traceName'] = traceName;
		    // 	traceNames.add(traceName);
		    // }

		    
		    // traceNames.forEach(function(traceName) {
		    // 	trace = {
		    // 	    mode: 'markers',
		    // 	    name: traceName,
		    // 	    type: 'scattergl'
		    // 	    x: factory.unpack(data.filter(function(line) line['traceName'] === traceName),'y1').map(function(x) { return Number(x); }),
		    // 	    y: factory.unpack(data.filter(function(line) line['traceName'] === traceName),'y2').map(function(x) { return Number(x); })
		    // 	};
		    // 	traces.push(trace);
		    // })

