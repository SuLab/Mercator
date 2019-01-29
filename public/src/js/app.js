angular.module("mercatorApp",['plotly','ui.select','ngSanitize','olsAutocompleteMod','ui.bootstrap','ngTable'])

    // .factory('mannWhitney', () => {

    // 	rank = {
    // 		/*
    // 		 * Standart ranking
    // 		 *
    // 		 * The MIT License, Copyright (c) 2014 Ben Magyar
    // 		 */
    // 		standard: function(array, key) {
    // 		    // sort the array
    // 		    array = array.sort(function(a, b) {
    // 			var x = a[key];
    // 			var y = b[key];
    // 			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    // 		    });
    // 		    // assign a naive ranking
    // 		    for (var i = 1; i < array.length + 1; i++) {
    // 			array[i - 1]['rank'] = i;
    // 		    }
    // 		    return array;
    // 		},
    // 		/*
    // 		 * Fractional ranking
    // 		 *
    // 		 * The MIT License, Copyright (c) 2014 Ben Magyar
    // 		 */
    // 		fractional: function(array, key) {
    // 		    array = this.standard(array, key);
    // 		    // now apply fractional
    // 		    var pos = 0;
    // 		    while (pos < array.length) {
    // 			var sum = 0;
    // 			var i = 0;
    // 			for (i = 0; array[pos + i + 1] && (array[pos + i][key] === array[pos + i + 1][key]); i++) {
    // 			    sum += array[pos + i]['rank'];
    // 			}
    // 			sum += array[pos + i]['rank'];
    // 			var endPos = pos + i + 1;
    // 			for (pos; pos < endPos; pos++) {
    // 			    array[pos]['rank'] = sum / (i + 1);
    // 			}
    // 			pos = endPos;
    // 		    }
    // 		    return array;
    // 		},
    // 		rank: function(x, y) {
    // 		    var nx = x.length,
    // 			ny = y.length,
    // 			combined = [],
    // 			ranked;
    // 		    while (nx--) {
    // 			combined.push({
    // 			    set: 'x',
    // 			    val: x[nx]
    // 			});
    // 		    }
    // 		    while (ny--) {
    // 			combined.push({
    // 			    set: 'y',
    // 			    val: y[ny]
    // 			});
    // 		    }
    // 		    ranked = this.fractional(combined, 'val');
    // 		    return ranked;
    // 		}
    // 	};


    // 	erf = (x) =>  {
    // 	    var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2, -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
    // 		       4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
    // 		       1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
    // 		       6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11, 2.394038e-12, -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13, 3.81e-16, 7.106e-15, -1.523e-15, -9.4e-17, 1.21e-16, -2.8e-17
    // 		      ];
    // 	    var j = cof.length - 1;
    // 	    var isneg = false;
    // 	    var d = 0;
    // 	    var dd = 0;
    // 	    var t, ty, tmp, res;

    // 	    if (x < 0) {
    // 		x = -x;
    // 		isneg = true;
    // 	    }

    // 	    t = 2 / (2 + x);
    // 	    ty = 4 * t - 2;

    // 	    for (; j > 0; j--) {
    // 		tmp = d;
    // 		d = ty * d - dd + cof[j];
    // 		dd = tmp;
    // 	    }

    // 	    res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
    // 	    return isneg ? res - 1 : 1 - res;
    // 	};

    // 	dnorm =  function(x, mean, std) {
    // 	    return 0.5 * (1 + erf((x - mean) / Math.sqrt(2 * std * std)));
    // 	};


    // 	statistic = function(x, y) {
    // 	    var ranked = rank.rank(x, y),
    // 		nr = ranked.length,
    // 		nx = x.length,
    // 		ny = y.length,
    // 		ranksums = {
    // 		    x: 0,
    // 		    y: 0
    // 		},
    // 		i = 0, t = 0, nt = 1, tcf, ux, uy;

    // 	    while (i < nr) {
    // 		if (i > 0) {
    // 		    if (ranked[i].val == ranked[i-1].val) {
    // 			nt++;
    // 		    } else {
    // 			if (nt > 1) {
    // 			    t += Math.pow(nt, 3) - nt;
    // 			    nt = 1;
    // 			}
    // 		    }
    // 		}
    // 		ranksums[ranked[i].set] += ranked[i].rank;
    // 		i++;
    // 	    }
    // 	    tcf = 1 - (t / (Math.pow(nr, 3) - nr));
    // 	    ux = nx*ny + (nx*(nx+1)/2) - ranksums.x;
    // 	    uy = nx*ny - ux;

    // 	    return {
    // 		tcf: tcf,
    // 		ux: ux,
    // 		uy: uy,
    // 		big: Math.max(ux, uy),
    // 		small: Math.min(ux, uy)
    // 	    };
    // 	};

	
    // 	return {
    // 	    test: function(x, y, alt, corr) {
    // 		// set default value for alternative
    // 		alt = typeof alt !== 'undefined' ? alt : 'two-sided';
    // 		// set default value for continuity
    // 		corr = typeof corr !== 'undefined' ? corr : true;
    // 		var nx = x.length, // x's size
    // 		    ny = y.length, // y's size
    // 		    f = 1,
    // 		    u, mu, std, z, p;

    // 		// test statistic
    // 		u = statistic(x, y);

    // 		// mean compute and correct if given
    // 		if (corr) {
    // 		    mu = (nx * ny / 2) + 0.5;
    // 		} else {
    // 		    mu = nx * ny / 2;
    // 		}

    // 		// compute standard deviation using tie correction factor
    // 		std = Math.sqrt(u.tcf * nx * ny * (nx + ny + 1) / 12);

    // 		// compute z according to given alternative
    // 		if (alt == 'less') {
    // 		    z = (u.ux - mu) / std;
    // 		} else if (alt == 'greater') {
    // 		    z = (u.uy - mu) / std;
    // 		} else if (alt == 'two-sided') {
    // 		    z = Math.abs((u.big - mu) / std);
    // 		} else {
    // 		    console.log('Unknown alternative argument');
    // 		}

    // 		// factor to correct two sided p-value
    // 		if (alt == 'two-sided') {
    // 		    f = 2;
    // 		}

    // 		// compute p-value using CDF of standard normal
    // 		p = dnorm(-z, 0, 1) * f;

    // 		return {U: u.small, p: p};
    // 	    }

    // 	};

    // })

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

	    getData: () => {
		return $http.get('/data/recount_noAmnio_tsne.csv');
	    },
	    // parse csv data file for tsne
	    // input:
	    //      text: text of csv file
	    // return:
	    //      promise of resolve lines array
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

    .controller('plotController',['$http', '$scope', '$log', 'plotData', '$q', '$window','NgTableParams', function($http, $scope, $log, plotData, $q, $window,NgTableParams){
	var vm = this;

	// $scope.significantDistances = () => {

	//     $scope.euclidSigClusters = [];
	    
	//     for(var j=0; j < $scope.markerSets.length; j++){
		
	// 	i = $scope.markerSets[j];

	// 	valsInCluster = $scope.data.filter((x) => {return x.louvain_k30 == i;}).map((x) => x.rnaseq_profile_id).map((x) => $scope.euclid_pca_trace[x]);
	// 	valsOutCluster = $scope.data.filter((x) => {return x.louvain_k30 != i;}).map((x) => x.rnaseq_profile_id).map((x) => $scope.euclid_pca_trace[x]);

	// 	// test = mannWhitney.test(valsInCluster,valsOutCluster,'less');
	// 	if(test.p < 0.01/$scope.markerSets.length){
	// 	    $scope.euclidSigClusters.push(i);
	// 	}

	//     };

	// };

	$scope.ontologyInfo = {};

	$scope.markerSets = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"];

	// $http.get('data/ontologies/mesh_keys_used.json').
	//     then((response) => {
	// 	$scope.used_mesh = response.data;
	//     });

	$scope.markerTableParams = new NgTableParams({
	    count: 10
	},
	{
	    counts: []
	});
	$scope.markerID = '1';
	$scope.sampleGeneViolin=false;
	// $scope.changeMarkerSet = function(){
	//     $http.get('http://localhost:3000/marker_info/'+$scope.markerID)
	// 	.then((response) => {
	// 	    $scope.markerTableParams.settings({
	// 		dataset: response.data
	// 	    });
	// 	});
	// };
		
	// $scope.sampleGeneDisabled=true;


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

	$scope.getUberonTerms = (val) => {

	    var deferred = $q.defer();

	    $http.get('http://localhost:3000/uberon_search/' + val)
		.then((response) => {
		    deferred.resolve(response.data.map((item) => {
			return {'id': item.id,'name': item.name};
		    }));
		});

	    return deferred.promise;
	};

	$scope.getDoidTerms = (val) => {

	    var deferred = $q.defer();

	    $http.get('http://localhost:3000/doid_search/' + val)
		.then((response) => {
		    deferred.resolve(response.data.map((item) => {
			return {'id': item.id,'name': item.name};
		    }));
		});

	    return deferred.promise;
	};

		

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

	$scope.colorOntology = function(){
	    $scope.traces = $scope.uberonTraces;
	};


	
	$scope.filter_select = {"field": undefined,
				"action": undefined,
				"value": undefined};

	$scope.trace_select = {"fields": undefined};

	$scope.valueOptions = [];

	$scope.violinXgroup = 'Cluster';
	$scope.violinYgroup = 'Gene';
	$scope.violinDisabled=true;
	$scope.gene_color_status="Waiting for gene selection";
	$scope.violin_status = $scope.gene_color_status;

	$scope.tsneDisabled = false;
	$scope.tsne_status = "Color by Metadata";
	$scope.tsneColor = "metadata";

	$scope.tsneData = 'all';
	$scope.violinData='all';

	$scope.euclid_pca_status="Waiting for file";

	$scope.valueSelectDisabled=true;

	$scope.violinOptions = {staticPlot: true};

	$scope.geneSelected = {'symbol': 'Zglp1', id: '100009600'};

	$scope.selectUberonTerm = function(item,model,label){
	    $scope.uberon_selection = item;
	};

	$scope.selectDoidTerm = function(item,model,label){
	    $scope.doid_selection = item;
	};


	$scope.selectGene = function(item,model,label){
	    $scope.idGeneSelected = item.id;
	    $scope.geneSelected = {id: item.id, symbol: item.symbol};
	    $scope.gene_color_status="waiting...";
	    delete $scope.geneValues;
	    // if($scope.violinYgroup == 'Gene'){
	    // 	$scope.violin_status = $scope.gene_color_status;
	    // 	$scope.violinDisabled=true;
	    // }

	    $http.get('http://localhost:3000/gene_val/'+item.id)
		.then((response) => {
		    $scope.gene_color_status = "Color by " + item.symbol;
		    // document.getElementById('geneButton').disabled=false;
		    $scope.geneValues = response.data;
		    // if($scope.violinYgroup == 'Gene'){
		    // 	$scope.violin_status = $scope.gene_color_status;
		    // 	$scope.violinDisabled=false;
		    // }
		});
	};

	$scope.markerTrace = function(data,colorHash){
	    var deferred = $q.defer();
	    var colorVec = [];
	    for(i=0; i<data.length; i++){
		colorVec.push(parseFloat(colorHash[data[i]['rnaseq_profile_id']]));
	    }

	    if(i===data.length){

		deferred.resolve([{
		    mode: 'markers',
		    name: 'test',
		    x: plotData.unpack(data,'y1'),
		    y: plotData.unpack(data,'y2'),
		    text: colorVec,
		    type: 'scattergl',
		    hoverinfo: 'text',
		    hoverlabel: {
			namelength: 5
		    },
		    marker: {
			color: colorVec,
			showscale: true
		    }
		}]);
	    }
	    return deferred.promise;
	};

	
	$scope.makeViolinTrace = function(data,colorHash,traceObjs,yLabel) {
	    colorVec = [];
	    clustVec = [];
	    var deferred = $q.defer();

	    louvain = false;

	    // if(!traceObjs || traceObjs.length == 0){
	    // 	traceObjs = [{id: 'louvain_k30', title: 'Louvain k=30'}];
	    // }

	    // if(!gene || gene == 'None'){
	    // 	gene = {'symbol': 'Zglp1', id: '100009600'};
	    // }
	    
	    traceFields = traceObjs.map((entry) => {return (entry.id);});

	    function createTraceName(line, traceFields){
		var fields = traceFields.map((entry) => {return line[entry];});
		var traceName = "";
		fields.forEach((entry) => {traceName = traceName.concat(entry," ");});
		return traceName.substr(0,traceName.length-1);
	    }
	    var traceNames = {};

	    if(traceObjs.length == 1 && traceObjs[0].id == 'louvain_k30'){
		louvain = true;
		    // 	$scope.violinLayout.categoryorder = ['array'];
		// 	$scope.violinLayout.categoryarray = Array.apply(null,Array(traceNames.size)).map(function(_,i) {return (i+1).toString();});
		
	    };


	    // let nameProcessing = data.map(line => {
	    // 	return $q((resolve, reject) => {
	    // 	    traceName = createTraceName(line,traceFields);
	    // 	    colorVec.push(colorHash[line.rnaseq_profile_id]);
	    // 	    clustVec.push(traceName);
	    // 	    // line.traceName = traceName;
	    // 	    // line.color = colorHash[line.rnaseq_profile_id];		    

	    // 	    traceNames.add(traceName);
	    // 	    resolve();
	    // 	});
	    // });

	    data.map(line => {
	    	traceName = createTraceName(line,traceFields);
	    	// colorVec.push(colorHash[line.rnaseq_profile_id]);
	    	// clustVec.push(traceName);
	    	line.traceName = traceName;
	    	line.color = colorHash[line.rnaseq_profile_id];		    
		if(traceNames[traceName]){traceNames[traceName].push(colorHash[line.rnaseq_profile_id]);}else{traceNames[traceName]=[colorHash[line.rnaseq_profile_id]];}
	    	// traceNames.add(traceName);
	    });

	    // goodTraces = Object.keys(traceNames).filter((x) => traceNames[x].length > 1).filter((x) => math.var(traceNames[x]) > 1).filter((x) => traceNames[x].filter((y) => y==0).length/traceNames[x].length < 0.75);
	    goodTraces = Object.keys(traceNames).filter((x) => math.var(traceNames[x]) > 0.01).filter((x) => traceNames[x].filter((y) => y==0).length/traceNames[x].length < 0.75);
	    // $q.all(nameProcessing)
	    // 	.then(() => {

	    title = yLabel;
	    if(traceObjs.length > 0){ title = title + " grouped by: ";}
	    traceObjs.forEach((entry) => {title = title.concat(entry.title," & ");});
	    if(traceObjs.length > 0){ title = title.substr(0,title.length-2);}
	    
	    xLab = "";
	    traceObjs.forEach((entry) => {xLab = xLab.concat(entry.title," ");});
	    xLab = xLab.substr(0,xLab.length-1);
	    

	    if(yLabel == "Sample Dissimilarity"){
		yLab = "Euclidian PCA Distance";
	    }
	    else{
		yLab = "log(TPM)";
	    }

		    // if(traceObjs.length == 1 && traceObjs[0].id == 'louvain_k30'){
		    // 	$scope.violinLayout.categoryorder = ['array'];
		    // 	$scope.violinLayout.categoryarray = Array.apply(null,Array(traceNames.size)).map(function(_,i) {return (i+1).toString();});
		    // };


	    $scope.violinLayout = {
		height: $window.innerHeight / 2,
		width: $window.innerWidth,
		title: title,
		xaxis: {
		    type: 'category',
		    fixedRange: false,
		    range: [-1,Object.keys(traceNames).length+1],
		    categoryorder: ((louvain) ? 'array' : 'trace'),
		    categoryarray: ((louvain) ? Array.apply(null,Array(Object.keys(traceNames).length)).map(function(_,i) {return (i+1);}) : []),
		    title: xLab
		},
		yaxis: {
		    title: yLab,
		    zeroline: false
		},
		shapes: $scope.sampleGeneViolin ? [{
		    type: 'line',
		    // xref: "paper",
		    // yref: 'paper',
		    x0: -1,
		    x1: Object.keys(traceNames).length+100,
		    y0: $scope.inputtedSample[$scope.geneSelected.id],
		    y1: $scope.inputtedSample[$scope.geneSelected.id],
		    line: {
			color: 'rgba(255,0,0,1)',
			width: 4,
			dash: 'dash',
			opacity: 0.2
		    }
		}] : []
	    };

	    if(data.length / Object.keys(traceNames).length > 100){
		markerSize = 6;
	    }
	    else{
		markerSize = 10;
	    }
	    
	    if(Object.keys(traceNames).length == goodTraces.length){
		deferred.resolve([{
		    type: 'violin',
		    x: plotData.unpack(data.filter((x) => goodTraces.includes(x.traceName)),'traceName'),
		    y: plotData.unpack(data.filter((x) => goodTraces.includes(x.traceName)),'color'),
		    // x: clustVec,
		    // y: colorVec,
		    points: 'all',
		    jitter: 0.4,
		    side: 'positive',
		    pointpos: -1,
		    marker: {
			symbol: 'circle',
			size: markerSize,
			opacity: 0.2
		    },
		    meanline: {visible: true},
		    hoverinfo: 'none',
		    spanmode: 'hard'
		}]);
	    }
	    else{
		deferred.resolve([{
		    type: 'violin',
		    x: plotData.unpack(data.filter((x) => goodTraces.includes(x.traceName)),'traceName'),
		    y: plotData.unpack(data.filter((x) => goodTraces.includes(x.traceName)),'color'),
		    // x: clustVec,
		    // y: colorVec,
		    points: 'all',
		    jitter: 0.6,
		    side: 'positive',
		    pointpos: -1,
		    marker: {
			symbol: 'circle',
			size: markerSize,
			opacity: 0.2
		    },
		    meanline: {visible: true},
		    hoverinfo: 'none',
		    showlegend: false,
		    spanmode: 'hard'
		    // span: [0,math.max(plotData.unpack(data.filter((x) => goodTraces.includes(x.traceName)),'color'))]
		},
		{
		    type: 'box',
		    x: plotData.unpack(data.filter((x) => !(goodTraces.includes(x.traceName))),'traceName'),
		    y: plotData.unpack(data.filter((x) => !(goodTraces.includes(x.traceName))),'color'),
		    // boxpoints: 'all',
		    jitter: 0.3,
		    pointpos: 0,
		    marker: {
			symbol: 'circle',
			size: 10,
			opacity: 0.2,
			color: '#1C61A5'
		    },
		    // meanline: {visible: true},
		    hoverinfo: 'none',
		    showlegend: false,
		    line: {color: '#1C61A5'},
		    fillcolor: '#88ACD2'
		}]);
	    }
	    // });
	    return deferred.promise;
	};

	//     var colorVec = [];
	//     var clustVec = [];
	    
	//     for(i=0; i<$scope.filteredData.length;i++){
	// 	colorVal = parseFloat(colorHash[$scope.filteredData[i]['rnaseq_profile_id']]);
	// 	if(colorVal > -10000){
	// 	    colorVec.push(colorVal);
	// 	    clustVec.push($scope.filteredData[i]['louvain_k30']);
	// 	}
	// 	else{
	// 	    console.log('h');
	// 	}
	// 	// colorVec.push(parseFloat(colorHash[$scope.filteredData[i]['rnaseq_profile_id']]));		
	//     }
	    
	//     if(i==$scope.filteredData.length){
	// 	deferred.resolve([{
	// 	    type: 'violin',
	// 	    x: plotData.unpack($scope.filteredData,'louvain_k30'),
	// 	    y: colorVec,
	// 	    // box: {visible: true},
	// 	    // line: {color: 'blue'},
	// 	    points: 'all',
	// 	    // spanmode: 'hard',
	// 	    jitter: 0.6,
	// 	    side: 'positive',
	// 	    pointpos: -1,
	// 	    marker: {
	// 	    	symbol: 'circle',
	// 	    	size: 2,
	// 		opacity: 0.2
	// 	    },
	// 	    meanline: {visible: true},
	// 	    hoverinfo: 'none'
	// 	    // transforms: [{
	// 	    // 	type: 'groupby',
	// 	    // 	// groups: plotData.unpack($scope.filteredData,'louvain_k30')
	// 	    // 	groups: clustVec
	// 	    // }]
	// 	}]);
	//     }
	//     return deferred.promise;
	// };




	// $scope.violinClick = function() {
	//     // $scope.violinClick = function(geneHash) {
	//     if(!$scope.trace_select.fields){
	// 	traceSelect = [];
	//     }
	//     else{
	// 	traceSelect = $scope.trace_select.fields;
	//     }
	//     traceArray = (($scope.violinXgroup == 'Cluster') ? [{id: 'louvain_k30', title: 'Louvain k=30'}] : traceSelect);
	//     geneHash = (($scope.violinYgroup == 'Gene') ? $scope.geneValues : $scope.euclid_pca_trace);
	//     yLabel = (($scope.violinYgroup == 'Gene') ? $scope.geneSelected.symbol : 'Sample Dissimilarity');
	//     switch($scope.violinData){
	//     case 'filtered': 
	// 	$scope.makeViolinTrace($scope.filteredData,geneHash,traceArray,yLabel)
	// 	    .then((response) => {
	// 		$scope.violinTrace = response;
	// 	    });
	// 	break;
	//     case 'all':
	// 	$scope.makeViolinTrace($scope.data,geneHash,traceArray,yLabel)
	// 	    .then((response) => {
	// 		$scope.violinTrace = response;
	// 	    });
	// 	break;
	//     }
	// };
	
	$scope.tsneClick = function() {
	    // if(!$scope.trace_select_fields){
	    // 	traceSelect = [];
	    // }
	    // else{
	    // 	traceSelect = $scope.trace_select_fields;
	    // }
	    switch($scope.tsneColor){
		// case 'cluster':
		// 	$scope.tsneLayout.title = 'Louvain k=30';
		// 	switch($scope.tsneData){
		// 	case 'filtered': 
		// 	    plotData.buildTraces($scope.filteredData,[{id: 'louvain_k30',title: 'Louvain k=30'}])
		// 	    .then((result) => {
		// 		$scope.tsneTraces=result;
		// 	    });
		// 	    break;
		// 	case 'all':
		// 	    plotData.buildTraces($scope.data,[{id: 'louvain_k30',title: 'Louvain k=30'}])
		// 		.then((result) => {
		// 		    $scope.tsneTraces=result;
		// 		});
		// 	    break;
		// 	}
		// 	break;
	    case 'metadata':
		title = '';
		if($scope.trace_select.fields){
		    $scope.trace_select.fields.forEach((entry) => {title=title.concat(entry.title,' ');});
		    $scope.tsneLayout.title = title.substr(0,title.length-1);;
		    if($scope.trace_select.fields.length > 0){$scope.tsneLayout.showlegend = true;}
		}
		switch($scope.tsneData){
		case 'filtered': 
		    plotData.buildTraces($scope.filteredData,$scope.trace_select.fields)
			.then((result) => {
			    $scope.tsneTraces=result;
			});
		    break;
		case 'all':
		    plotData.buildTraces($scope.data,$scope.trace_select.fields)
			.then((result) => {
			    $scope.tsneTraces=result;
			});
		    break;
		}
		// plotData.buildTraces($scope.filteredData,$scope.trace_select.fields)
		//     .then((result) => {
		// 	$scope.tsneTraces=result;
		//     });
		break;
	    // case 'gene':
	    // 	switch($scope.tsneData){
	    // 	case 'filtered':
	    // 	    $scope.markerTrace($scope.filteredData,$scope.geneValues).
	    // 		then((result) => {
	    // 		    $scope.tsneLayout.title = $scope.geneSelected.symbol;
	    // 		    $scope.tsneTraces=result;
	    // 		});
	    // 	    break;
	    // 	case 'all':
	    // 	    $scope.markerTrace($scope.data,$scope.geneValues).
	    // 		then((result) => {
	    // 		    $scope.tsneLayout.title = $scope.geneSelected.symbol;
	    // 		    $scope.tsneTraces=result;
	    // 		});
	    // 	    break;
	    // 	}
	    // 	break;
	    case 'samp-dist':
		switch($scope.tsneData){
		case 'filtered':
		    $scope.markerTrace($scope.filteredData,$scope.euclid_pca_trace)
			.then((result) => {
			    $scope.tsneLayout.title = 'Sample Dissimilarity';
			    $scope.tsneTraces=result;
			});
		    break;
		case 'all':
		    $scope.markerTrace($scope.data,$scope.euclid_pca_trace)
			.then((result) => {
			    $scope.tsneLayout.title = 'Sample Dissimilarity';
			    $scope.tsneTraces=result;
			});
		    break;
		}
		break;

	    case 'mesh':
		switch($scope.tsneData){
		case 'filtered':
		    $scope.buildOntologyTraces($scope.filteredData,'mesh')
			.then((ontologyTraces) => {
			    $scope.tsneTraces = ontologyTraces;
			});
		    break;
		case 'all':
		    $scope.buildOntologyTraces($scope.data,'mesh')
			.then((ontologyTraces) => {
			    $scope.tsneTraces = ontologyTraces;
			});
		    break;
		}
		break;

	    case 'doid':
		switch($scope.tsneData){
		case 'filtered':
		    $scope.buildOntologyTraces($scope.filteredData,'doid')
			.then((ontologyTraces) => {
			    $scope.tsneTraces = ontologyTraces;
			});
		    break;
		case 'all':
		    $scope.buildOntologyTraces($scope.data,'doid')
			.then((ontologyTraces) => {
			    $scope.tsneTraces = ontologyTraces;
			});
		    break;
		}
		break;
	    };


		    
	    // $scope.markerTrace(colorHash)
	    // 	.then((response) => {
	    // 	    $scope.traces = response;
	    // 	});
	};
    // };

	$scope.$watch(
	    function($scope) {
		return $scope.uberon_selection;
	    },
	    function(newValue, oldValue){

		if(newValue && newValue != oldValue){

		    // var id = newValue.a_attr.iri.split('/').slice(-1)[0];
		    var id = newValue.id;

		    $http.get('http://localhost:3000/ontology_info/' + id)
			.then((response) => {
			    $scope.ontologyInfo.uberon = response.data;

			    // $scope.buildOntologyTraces($scope.filteredData,'uberon')
			    // 	.then((ontologyTraces) => {
			    // 	    $scope.uberonTraces = ontologyTraces;
			    // 	});
			});
		}
	    });

	$scope.$watch(
	    function($scope) {
		return $scope.doid_selection;
	    },
	    function(newValue, oldValue){

		if(newValue && newValue != oldValue){

		    // var id = newValue.a_attr.iri.split('/').slice(-1)[0];
		    var id = newValue.id;

		    $http.get('http://localhost:3000/ontology_info/' + id)
			.then((response) => {
			    $scope.ontologyInfo.doid = response.data;

			    // $scope.buildOntologyTraces($scope.filteredData,'uberon')
			    // 	.then((ontologyTraces) => {
			    // 	    $scope.uberonTraces = ontologyTraces;
			    // 	});
			});
		}
	    });


	$scope.$watch(
	    function($scope) {
		return $scope.mesh_selection;
	    },
	    function(newValue, oldValue){

		if(newValue && newValue != oldValue){

		    var id = newValue.id;

		    $http.get('http://localhost:3000/ontology_info/' + id)
			.then((response) => {
			    $scope.ontologyInfo.mesh = response.data;
			});
		}
	    });
	
	
	$scope.$watch(
	    function($scope) {
		return $scope.tsneColor;
	    },
	    function(newValue, oldValue){
		if(newValue != oldValue){
		    switch(newValue){
		    case 'cluster':
			$scope.tsne_status = 'Color by Cluster';
			$scope.tsneDisabled = false;
			break;
			
		    case 'metadata': 
			$scope.tsne_status = 'Color by Metadata';
			$scope.tsneDisabled = false;
			break;
			
		    case 'gene': 
			$scope.tsne_status = $scope.gene_color_status;
			if($scope.geneValues){
			    $scope.tsneDisabled=false;
			}
			else{
			    $scope.tsneDisabled=true;
			}
			break;
			
		    case 'samp-dist': 
			$scope.tsne_status = $scope.euclid_pca_status;
			if($scope.euclid_pca_status == "Color by Distance"){
			    $scope.tsneDisabled=false;
			}
			else{
			    $scope.tsneDisabled=true;
			}
			break;
		    }
		}
	    }
	);

	$scope.$watch(
	    function($scope) {
		return $scope.violinYgroup;
	    },
	    function(newValue, oldValue){
		if(newValue != oldValue && newValue == 'Gene'){
		    // $scope.violinClick($scope.geneValues);
		    $scope.violin_status = $scope.gene_color_status;
		    if($scope.geneValues){
			$scope.violinDisabled=false;
			if($scope.inputtedSample){
			    $scope.sampleGeneDisabled = false;
			}
		    }
		    else{
			$scope.violinDisabled=true;
			$scope.sampleGeneDisabled = true;
		    }
		    
		}

		if(newValue != oldValue && newValue == 'samp-dist'){
		    $scope.violin_status = $scope.euclid_pca_status;
		    $scope.sampleGeneDisabled = true;
		    if($scope.euclid_pca_status == "Color by Distance"){
			$scope.violinDisabled=false;
		    }
		    else{
			$scope.violinDisabled=true;
		    }

		}

		    
		// if(newValue == 'Cluster' && oldValue != 'Cluster'){
		//     $scope.violinClick($scope.geneValues,[],$scope.geneSelected);
		// }
		// if(newValue == 'Metadata' && oldValue != 'Metadata'){
		//     $scope.violinClick($scope.geneValues,$scope.trace_select.fields,$scope.geneSelected);
		// }
	    }
	);
		    

	// $scope.$watch(
	//     function($scope) {
	// 	return $scope.geneValues;
	//     },
	//     function(newValue,oldValue){
	// 	if(newValue){
	// 	    $scope.violinClick(newValue);
	// 	}
	//     }
	// );

	$scope.$watch(
	    function($scope) {
		return $scope.euclid_pca_status;
	    },
	    function(newValue,oldValue){
		if(newValue && newValue != oldValue){
		    if($scope.euclid_pca_status == 'Color by Distance'){
			    $scope.significantDistances();		    
		    }
		    if($scope.violinYgroup == 'samp-dist'){
			$scope.violin_status = $scope.euclid_pca_status;
			if($scope.euclid_pca_status == 'Color by Distance'){
			    $scope.violinDisabled = false;
			}
			else{
			    $scope.violinDisabled=true;
			}
		    }
		    if($scope.tsneColor == 'samp-dist'){
			$scope.tsne_status = $scope.euclid_pca_status;
			if($scope.euclid_pca_status == 'Color by Distance'){
			    $scope.tsneDisabled = false;
			}
			else{
			    $scope.tsneDisabled = true;
			}
		    }
		    if($scope.violinYgroup == 'Gene' && $scope.euclid_pca_status == 'Color by Distance'){
			$scope.sampleGeneDisabled = false;
		    }
		    else{
			$scope.sampleGeneDisabled=true;
		    }
		}
	    }
	);

	$scope.$watch(
	    function($scope) {
		return $scope.gene_color_status;
	    },
	    function(newValue,oldValue){
		if(newValue && newValue != oldValue){
		    if($scope.violinYgroup == 'Gene'){
			$scope.violin_status = $scope.gene_color_status;
			if($scope.geneValues){
			    $scope.violinDisabled = false;
			}
			else{
			    $scope.violinDisabled=true;
			}
		    }
		    if($scope.tsneColor == 'gene'){
			$scope.tsne_status = $scope.gene_color_status;
			if($scope.geneValues){
			    $scope.tsneDisabled = false;
			}
			else{
			    $scope.tsneDisabled=true;
			}
		    }
		    
		}
	    }
	);

	$scope.$watch(
	    function($scope) {
		return $scope.filter_select.field;
	    },
	    function(newValue,oldValue){

		if(newValue){
		    $scope.filter_select.value = [];
		    $scope.valueOptions = Array.from(new Set(plotData.unpack($scope.data,newValue.id)));
		    $scope.valueSelectDisabled=false;

		}
		
		// if(newValue && (newValue.id == 'project' || newValue.id == 'seq_platform' || newValue.id == 'extraction_kit')){
		//     $http.get('/data/metadata.json').then((response) => {
			
		// 	var result = response.data;

		// 	$scope.valueOptions = result[newValue.id];
		// 	$scope.valueSelectDisabled=false;

		//     });
		// } else {

		//     // if(newValue && (newValue.id == 'tissue_general' || newValue.id == 'tissue_detail')){
			
		//     // }
		    
		//     $scope.filter_select.value = undefined;
		//     $scope.valueSelectDisabled=true;
		//     $scope.valueOptions = [];

		// }
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

	    $scope.groupList = [];
	    $scope.selectedGroup = null;
	    $scope.removeGroup = (id) => {
		$scope.groupList = $scope.groupList.filter((entry) => { return entry.id !== id;});
	    };
	    // $http.get('http://localhost:3000/marker_info/'+$scope.markerID)
	    // 	.then((response) => {
	    // 	    $scope.markerTableParams.settings({
	    // 		dataset: response.data
	    // 	    });
	    // 	});
	    
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
		{id: 'sampling_region', title: 'Sample Region'},
		{id: 'sources', title: 'Sample Source'}// ,
		// {id: 'kmean_1', title: 'Kmeans n=1'},
		// {id: 'kmean_2', title: 'Kmeans n=2'},
		// {id: 'kmean_3', title: 'Kmeans n=3'},
		// {id: 'kmean_4', title: 'Kmeans n=4'},
		// {id: 'kmean_5', title: 'Kmeans n=5'},
		// {id: 'kmean_6', title: 'Kmeans n=6'},
		// {id: 'kmean_7', title: 'Kmeans n=7'},
		// {id: 'kmean_8', title: 'Kmeans n=8'},
		// {id: 'kmean_9', title: 'Kmeans n=9'},
		// {id: 'kmean_10', title: 'Kmeans n=10'},
		// {id: 'kmean_11', title: 'Kmeans n=11'},
		// {id: 'kmean_12', title: 'Kmeans n=12'},
		// {id: 'kmean_13', title: 'Kmeans n=13'},
		// {id: 'kmean_14', title: 'Kmeans n=14'},
		// {id: 'kmean_15', title: 'Kmeans n=15'},
		// {id: 'kmean_16', title: 'Kmeans n=16'},
		// {id: 'kmean_17', title: 'Kmeans n=17'},
		// {id: 'kmean_18', title: 'Kmeans n=18'},
		// {id: 'kmean_19', title: 'Kmeans n=19'},
		// {id: 'kmean_20', title: 'Kmeans n=20'},
		// {id: 'louvain_k30', title: 'Louvain k=30'}
	    ];

	    $scope.violinTrace = [{}];
	    $scope.violinLayout = {
		height: $window.innerHeight / 2,
		width: $window.innerWidth,
		title: 'Violin Plot',
		xaxis: {
		    type: 'category',
		    fixedRange: false,
		    range: [-1,1],
		    title: ''

		},
		yaxis: {
		    title: '',
		    zeroline: false
		}
	    };

	    $scope.getGenes = (val) => {
		
		// return [{name: 'Sox2',id:1000,symbol: 'Sox2'},{name: 'Sox1',id:1002,symbol:'Sox1'}];

		var deferred = $q.defer();

		$http.get('http://localhost:3000/gene_info/'+val)
		    .then((response) => { 
			deferred.resolve(response.data.map((item) => {
			    return {'id': item.gene_id, 'symbol': item.gene_symbol, 'markerStr': item.marker_of_clusters.length > 0 ? ', Marker for: '+item.marker_of_clusters: item.marker_of_clusters};
			}));
		    });

	    	// var createCORSRequest = function(method, url) {

    	    	//     var xhr = new XMLHttpRequest();
    	    	//     if ("withCredentials" in xhr) {
    	    	// 	xhr.open(method,url,true);
    	    	//     } else if (typeof XDomainRequest != "undefined"){
    	    	// 	xhr = new XDomainRequest();
    	    	// 	xhr.open(method,url);
    	    	//     }
    	    	//     else {
    	    	// 	xhr = null;
    	    	//     }
    	    	//     return xhr;
    	    	// };

	    	// // var xhr = createCORSRequest('GET',"http://mygene.info/v3/query?q=_id:" + val + "*%20OR%20symbol:" + val + "*&species=mouse&size=20");
	    	// // var xhr = createCORSRequest('GET',"http://mygene.info/v3/query?q=" +  val + "*&species=mouse&size=20");

	    	// if(!xhr){
	    	//     alert('Your browser does not support this application. We suggest Chrome or Firefox');
	    	// }

	    	// xhr.onload = () => {
	    	//     var response = JSON.parse(xhr.response);

		//     deferred.resolve(response.hits.map((item) => {
		// 	// return 'Symbol: ' + item.symbol + ' ID: ' + item._id + ' Name: ' + item.name;
		// 	return {'id': item._id, 'symbol': item.symbol, 'name': item.name};
		//     }));
		    
	    	// };

	    	// xhr.onerror = () => {
	    	//     alert('Error');
	    	// };

	    	// xhr.send();

		return deferred.promise;

	    };
	
	    // $http.get('/data/allen/gene_list.json').then((response) => {
	    // 	$scope.geneOptions = response.data;
	    // });

	    $scope.filterOptions = [
		{id: 'exclude', title: 'Remove'},
		{id: 'include', title: 'Only'}
	    ];

	    $scope.tsneLayout = {
		height: $window.innerHeight / 2,
		width: $window.innerWidth,
		title: '',
		xaxis: {visible: false},
		yaxis: {visible: false},
		hovermode: 'closest'
	    };
	    
	    // $scope.violinLayout = {
	    // 	height: $window.innerHeight / 3,
	    // 	weight: $window.innerWidth,
	    // 	title: 'Violin Plot',
	    // 	xaxis: {
	    // 	    type: 'category',
	    // 	    fixedrange: false,
	    // 	    categoryorder: ['array'],
	    // 	    categoryarray: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((x) => {return x.toString();}),
	    // 	    range: [-2,20]
	    // 	}// ,
	    // 	// yaxis: {
	    // 	//     type: 'log'
	    // 	// }

	    // };

	    plotData.getData()
		.then(plotData.processData)
		.then((data) => {
		    $scope.data = data;
		    $scope.filteredData = data;
		    return plotData.buildTraces(data,[]);
		})
		.then((traces) => {
		    // $http.get('http://localhost:3000/gene_val/100009600')
		    // 	.then((response) => {
		    // 	    $scope.geneValues = response.data;
		    // 	    $scope.gene_color_status = "Color by Zglp1";
		    // 	    // document.getElementById('geneButton').disabled=false;
		    // 	    // $scope.violinClick(response.data);
		    // 	    // $scope.violinClick();
		    // 	    // if($scope.violinYgroup == 'Gene'){
		    // 	    // 	$scope.violin_status = $scope.gene_color_status;
		    // 	    // 	$scope.violinDisabled=false;
		    // 	    // }
		    // 	});
		    $scope.tsneTraces = traces;
		    // $scope.buildTraces=plotData.buildTraces;
		    $scope.tsneOptions = {showLink:false};
		    // function for defining listeners for events emitted by plotly.js
		    $scope.tsneEvents = (graph) => {
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
			
			return reducedFilters.filter((entry) => entry.value.length > 0);
		    }
		    

		    reducedFilters = reduceFilters();

		    var cnt = 0;

		    $scope.filteredData = reducedFilters.reduce((currData,filterEntry) => {
			cnt++;
			if(filterEntry.action === "exclude"){
			    return currData.filter((dataEntry) => {return !filterEntry.value.includes(dataEntry[filterEntry.field]); });
			}
			else if(filterEntry.action === "include"){
			    return currData.filter((dataEntry) => {return filterEntry.value.includes(dataEntry[filterEntry.field]); });
			}
			else{
			    return currData;
			}
		    },$scope.data);

		    // if(cnt===reducedFilters.length){
		    // 	plotData.buildTraces($scope.filteredData,$scope.trace_fields)
		    // 	    .then((result) => $scope.tsneTraces = result);
		    // }

		};

		$scope.removeFilter = (id) => {
		    $scope.filterList = $scope.filterList.filter((entry) => {return entry.id !== id;});
		    $scope.filterData();
		};

		$scope.addFilter = () => {
			
		    valueLabel = '"'+$scope.filter_select.value[0]+'"';

		    for(i = 1; i < $scope.filter_select.value.length; i++){

			valueLabel = valueLabel + ', ' + '"'+$scope.filter_select.value[i]+'"';
			
		    }
		    
		    var entry = {
			marked: true,
			id: Math.floor(Math.random()*11000),
			field: $scope.filter_select.field.id,
			value: $scope.filter_select.value,
			action: $scope.filter_select.action.id,
			filterLabel: $scope.filter_select.action.title + ' ' + valueLabel + ' in ' + $scope.filter_select.field.title
		    };

		    $scope.filterList.push(entry);
		    
		    $scope.filterData();

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
    // .directive('ontologyExplorer',[() => {
    // 	return{
    // 	    restrict: 'E',
    // 	    replace: true,
    // 	    template: '<div></div>',
    // 	    scope: {
    // 		ont: '@',
    // 		ontNode: '=',
    // 		divid: '@'
    // 	    },
    // 	    controller: ($scope) => {
    // 		$('#'+$scope.divid).on('select_node.jstree', (e, data) => {
    // 			$scope.ontNode = data.node;
    // 			// $scope.filter_select.value = {'id': data.node.id,
    // 			// 			     'title': data.node.text};
    // 		    });

		
    // 	    },
    // 	    link: (scope, element, attrs) => {
    // 		// scope.ontN = null;

    // 		var createCORSRequest = function(method, url) {

    // 		    var xhr = new XMLHttpRequest();
    // 		    if ("withCredentials" in xhr) {
    // 			xhr.open(method,url,true);
    // 		    } else if (typeof XDomainRequest != "undefined"){
    // 			xhr = new XDomainRequest();
    // 			xhr.open(method,url);
    // 		    }
    // 		    else {
    // 			xhr = null;
    // 		    }
    // 		    return xhr;
    // 		};


    // 		var tree = $('#'+scope.divid).jstree({
    // 		    'plugins': [],
    // 		    'core': {
    // 			'data': (node,cb) => {
    // 			    url = node.id === '#' ?
    // 				'data/ontologies/roots/' + scope.ont + '_jstree_roots.json':
    // 				'https://www.ebi.ac.uk/ols/api/ontologies/' + scope.ont + '/terms/' + encodeURIComponent(encodeURIComponent(node.original.iri)) + '/jstree/children/' + node.id;
    // 			    var xhr = createCORSRequest('GET', url);

    // 			    if(!xhr){
    // 				alert('Your browser does not support this application! We suggest Chrome or Firefox');
    // 			    }

    // 			    xhr.onload = () => {
    // 				var response = JSON.parse(xhr.response);
    // 				cb.call(this,response);
    // 			    };
			    
    // 			    xhr.onerror = () => {
    // 				alert('Error');
    // 			    };

    // 			    xhr.send();
    // 			}
    // 		    }
    // 		});
			   

    // 	    }
    // 	};
    // }])

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
			    // url = node.id === '#' ?
			    // 	'data/ontologies/roots/' + scope.ont + '_jstree_roots.json':
			    // 	'https://www.ebi.ac.uk/ols/api/ontologies/' + scope.ont + '/terms/' + encodeURIComponent(encodeURIComponent(node.original.iri)) + '/jstree/children/' + node.id;

			    url = node.id === '#' ?
				'http://localhost:3000/' + scope.ont + '_tree/root':
				'http://localhost:3000/' + scope.ont + '_tree/' + node.id;
			    var xhr = createCORSRequest('GET', url);

			    if(!xhr){
				alert('Your browser does not support this application! We suggest Chrome or Firefox');
			    }

			    xhr.onload = () => {
				var response = JSON.parse(xhr.response);
				var response_data = JSON.parse(response.children);
				cb.call(this,response_data);
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

    .directive('meshExplorer',[() => {
	return{
	    restrict: 'E',
	    replace: true,
	    template: '<div></div>',
	    scope: {
	    	// ont: '@',
	    	ontNode: '=',
	    	divid: '@'
	    },
	    controller: ['$scope', '$http', ($scope, $http) => {
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

		

		
	    }],
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
				'http://localhost:3000/mesh_tree/root' : 
				// 'data/ontologies/roots/' + scope.ont + '_jstree_roots.json':
				'http://localhost:3000/mesh_tree/' + node.id;
				// 'https://www.ebi.ac.uk/ols/api/ontologies/' + scope.ont + '/terms/' + encodeURIComponent(encodeURIComponent(node.original.iri)) + '/jstree/children/' + node.id;
			    var xhr = createCORSRequest('GET', url);

			    if(!xhr){
				alert('Your browser does not support this application! We suggest Chrome or Firefox');
			    }

			    xhr.onload = () => {
				var response = JSON.parse(xhr.response);
				var response_data = JSON.parse(response.children);
				
				cb.call(this,response_data);
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
			    $scope.tsneTraces=result;
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

    .directive('fileInput', ['csvParse', 'httpRequests', '$log', function(csv, httpRequests, $log){
	return{
	    restrict: 'E',
	    replace: true,
	    template: '<input type="file"></input>',
	    scope: {
		url: '@',
		storage: '=',
		sample: '=',
		status: '='
		}, // isolated scope
	    link: (scope, element, attrs) => {

		element.on('change', () => {
		    // document.getElementById('pcaButton').disabled = true;
		    scope.status="Processing...";
		    delete scope.storage;
		    var output = "";
		    reader = new FileReader();
		    if(element[0].files && element[0].files[0]){
			reader.onload = (event) => {
			    output = event.target.result;
			    scope.sample = {};
			    output.split(/\n/)
				.map((item) => {
				    item_parts = item.substr(2,item.length).split(/\t/);
				    scope.sample[item_parts[0].substr(0,item_parts[0].length-1)] = Math.log(parseFloat(item_parts[1])+1);
				});
			    // scope.sample = output;
			    httpRequests.post(scope.url, output, 'text/plain')

				.then((response) =>{
				    // document.getElementById('pcaButton').disabled=false;
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
    }]);



// angular.module("mercatorApp",['plotly','ui.select','ngSanitize','olsAutocompleteMod'])

//     .factory('csvParse', () => {
// 	return {
// 	    CSVtoArray: (text) => {
// 		var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
// 		var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
// 		// return NULL if input string is not well formed CSV string.
// 		if (!re_valid.test(text)) {return null;}
// 		var a = [];                     // Initialize array to receive values.

// 		text.replace(re_value, // "Walk" the string using replace with callback.
// 			     function(m0, m1, m2, m3) {
// 				 // Remove backslash from \' in single quoted values.
// 				 if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
// 				 // Remove backslash from \" in double quoted values.
// 				 else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
// 				 else if (m3 !== undefined) a.push(m3);
// 				 return ''; // Return empty string.
// 			     });
// 		// Handle special case of empty last value.
// 		if (/,\s*$/.test(text)) a.push('');
// 		return a;
// 	    }
// 	};
//     })

//     .factory('plotData',['csvParse','$http', '$q', '$log', (csv,$http,$q,$log) => {
// 	var factory = {
// 	    // return column key from data matrix rows 

// 	    unpack: (rows,key) => {
// 		// return Object.keys(rows).map((row) => { return rows[row][key]; });
// 		return rows.filter((row) => {return typeof(row) != 'undefined';})
// 		    .map((row) => { return row[key]; });
// 	    },
// 	    // return promise of tsne data

// 	    getData: () => {
// 		return $http.get('/data/recount_noAmnio_tsne.csv');
// 	    },
// 	    // parse csv data file for tsne
// 	    // input:
// 	    //      text: text of csv file
// 	    // return:
// 	    //      promise of resolve lines array

// 	    // getMetadata: () => {
// 	    // 	return $http.get('data/recount_metadata.json');
// 	    // },

// 	    processData: (text) => {
// 		var textLines = text['data'].split(/\r\n|\n/);
// 		var headers = csv.CSVtoArray(textLines[0]);
// 		var deferred = $q.defer();

// 		var lines = {};
// 		// populate array lines with hashes for rows of csv file
// 		// length-1 because splitting on new line adds an empty line to the end of the file
// 		for(var i=1; i < (textLines.length-1); i++){
// 		    var line = {};
// 		    var splitLine = csv.CSVtoArray(textLines[i]);
// 		    if(splitLine.length != headers.length){
// 			$log.error('Header length',headers.length);
// 			$log.error('Line Length',splitLine.length);
// 			$log.error('Line number:',i);
// 			deferred.reject('header and line different lengths');
// 		    }
// 		    // populate line with attributes from header and values from splitLine
// 		    for(var j=0; j < headers.length; j++){
// 			line[headers[j]]=splitLine[j];
// 		    }
// 		    // lines.push(line);
// 		    lines[line.id] = line;
// 		    // resolve on last loop iteration
// 		    if(i === (textLines.length-2) && j === (headers.length)){
// 			deferred.resolve(lines);
// 		    }
// 		}
// 		return deferred.promise;
// 	    },

// 	    // Build trace array from data array and tracefields
// 	    // input:
// 	    //   data: array of data hashes corresponding to rows of input csv
// 	    //   traceFields: array of strings corresponding to fields in csv header
// 	    // return:
// 	    //   promise with resolve trace array
// 	    buildTraces: function(data, traceFields) {
// 		var deferred = $q.defer();
// 		// if no trace fields, return single trace
// 		if(!traceFields || traceFields.length === 0){
// 		    deferred.resolve([{
// 			mode: 'markers',
// 			name: 'test',
// 			x: factory.unpack(Object.keys(data).map(key => data[key]),'y1'),
// 			y: factory.unpack(Object.keys(data).map(key => data[key]),'y2'),
// 			type: 'scattergl',
// 			opacity: 1.0
// 		    }]);
// 		}

// 		else{
// 		    traces = [];
// 		    // return single string traceName that defines name of trace for a given entry line and fields traceFields
// 		    function createTraceName(line,traceFields) {
// 			var fields=traceFields.map(function(entry) {return line[entry];});
// 			var traceName = "";
// 			fields.forEach((entry) => {traceName=traceName.concat(entry," ");});
// 			return traceName;
// 		    }
// 		    var traceNames=new Set();
// 		    // create array of promises of traceNames (might be overkill?)
// 		    let nameProcessing = data.map(line => {
// 		    	return $q((resolve,reject) => {
// 		    	    traceName = createTraceName(line,traceFields);
// 		    	    line.traceName = traceName;
// 		    	    traceNames.add(traceName);
// 		    	    resolve();
// 		    	});
// 		    });

// 		    $q.all(nameProcessing)
// 			.then(() => {
// 			    let traceProcessing = [];
// 			    // return array of promises of resolve trace
// 			    traceNames.forEach((traceName) => {
// 				traceProcessing.push($q((resolve,reject) => {
// 				    trace = {
// 					mode: 'markers',
// 					name: traceName,
// 					type: 'scattergl',
// 					x: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}),'y1'),
// 					y: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}),'y2'),
// 					// x: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}).map((key) => {data[key];}),'y1'),
// 					// y: factory.unpack(Object.keys(data).filter((key) => {return data[key].traceName === traceName;}).map((key) => {data[key];}),'y2'),
// 					// y: factory.unpack(data.filter((line) => {return line.traceName === traceName;}),'y2'),
// 					opacity: 1.0
// 				    };
// 				    resolve(trace);
// 				}));
// 			    });
// 			    return $q.all(traceProcessing);
// 			})
// 			.then((traces) => deferred.resolve(traces));

// 		}
// 		return deferred.promise;
// 	    }
// 	};
// 	return factory; 
//     }])
//     // Controller for plotly plot

//     .controller('plotController',['$http', '$scope', '$log', '$q', 'plotData', '$window', function($http, $scope, $log, $q, plotData, $window){
// 	var vm = this;

// 	// vm.colorize = function() {
// 	//     if(this.trace_fields){
// 	// 	traceFields = this.trace_fields.map((entry) => {
// 	// 	    return(entry.id);
// 	// 	});
// 	//     }
// 	//     else{
// 	// 	traceFields = [];
// 	//     };
						
// 	//     plotData.buildTraces($scope.filteredData, traceFields)
// 	// 	    .then((result) => {
// 	// 		$scope.traces=result;
// 	// 	    });
//     	//     };

// 	$scope.filter_select = {"field": undefined,
// 				"action": undefined,
// 				"value": undefined};

// 	$scope.trace_select = {"fields": undefined};

// 	$scope.valueOptions = [];

// 	$scope.valueSelectDisabled=true;

// 	$scope.buildOntologyTraces = function(data,ontology){

// 	    var deferred = $q.defer();

// 	    if($scope.ontologyInfo[ontology].length == 0){
// 		deferred.resolve([{
// 		    mode: 'markers',
// 		    name: 'test',
// 		    x: factory.unpack(data,'y1'),
// 		    y: factory.unpack(data,'y2'),
// 		    type: 'scattergl',
// 		    opacity: 0.5,
// 		    marker: {color: 'rgb(128,128,128)'}
// 		}]);
// 	    }

// 	    else{
// 		traces = [];
// 		runsInTraces = new Set([]);
// 		ontologyData = $scope.ontologyInfo[ontology];
// 		samples = Object.keys(data);
// 		let traceMaking = Object.keys(ontologyData).map(entry => {
// 		    return $q((resolve,reject) => {
// 			// runsInTraces = runsInTraces.concat(ontologyData[entry]);
// 			traceLabel = entry.replace(/\+/g,'<br>');
// 			runsInTraces = new Set([...runsInTraces,...ontologyData[entry]]); //runsInTraces.concat(ontologyData[entry]);
// 			traces.push({
// 			    mode: 'markers',
// 			    type: 'scattergl',
// 			    name: traceLabel,
// 			    // x: plotData.unpack(data.filter((line) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y1'),
// 			    // x: plotData.unpack(Object.keys(data).filter((key) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y1'),
// 			    x: plotData.unpack(ontologyData[entry].map((sample) => {return data[sample];}),'y1'),
// 			    y: plotData.unpack(ontologyData[entry].map((sample) => {return data[sample];}),'y2'),
// 			    // y: plotData.unpack(data.filter((line) => {return ontologyData[entry].indexOf(line.id) > -1;}),'y2'),
// 			    opacity: 1.0
// 			});
// 			resolve();
// 		    });
// 		});
		
// 		$q.all(traceMaking)
// 		    .then(() => {
// 			unLabSamples = samples.filter(x => !runsInTraces.has(x));
// 			traces.push({
// 			    mode: 'markers',
// 			    type: 'scattergl',
// 			    name: 'unlabeled',
// 			    x: plotData.unpack(unLabSamples.map((sample) => {return data[sample]; }),'y1'),
// 			    y: plotData.unpack(unLabSamples.map((sample) => {return data[sample]; }),'y2'),
// 			    // x: plotData.unpack(data.filter((line) => {return runsInTraces.indexOf(line.id) == -1;}),'y1'),
// 			    // y: plotData.unpack(data.filter((line) => {return runsInTraces.indexOf(line.id) == -1;}),'y2'),
// 			    opacity: 0.2
// 			});
// 			deferred.resolve(traces);
// 		    });

// 	    }
// 	    return deferred.promise;
// 	};

// 	$scope.colorOntology = function(){
// 	    $scope.traces = $scope.uberonTraces;
// 	};

// 	$scope.$watch(
// 	    function($scope) {
// 		return $scope.uberon_selection;
// 	    },
// 	    function(newValue, oldValue){

// 		if(newValue && newValue != oldValue){

// 		    var id = newValue.a_attr.iri.split('/').slice(-1)[0];

// 		    $http.get('http://localhost:3000/ontology_info/' + id)
// 			.then((response) => {
// 			    $scope.ontologyInfo.uberon = response.data;

// 			    $scope.buildOntologyTraces($scope.filteredData,'uberon')
// 				.then((ontologyTraces) => {
// 				    $scope.uberonTraces = ontologyTraces;
// 				});
// 			});
// 		}
// 	    });

// 	$scope.$watch(
// 	    function($scope) {
// 		return $scope.filter_select.field;
// 	    },
// 	    function(newValue,oldValue){
		
// 		if(newValue && (newValue.id == 'project' || newValue.id == 'seq_platform' || newValue.id == 'extraction_kit')){
// 		    $http.get('/data/metadata.json').then((response) => {
			
// 			var result = response.data;

// 			$scope.valueOptions = result[newValue.id];
// 			$scope.valueSelectDisabled=false;

// 		    });
// 		} else {

// 		    // if(newValue && (newValue.id == 'tissue_general' || newValue.id == 'tissue_detail')){
			
// 		    // }
		    
// 		    $scope.filter_select.value = undefined;
// 		    $scope.valueSelectDisabled=true;
// 		    $scope.valueOptions = [];

// 		}
// 	    });

// 	// $scope.$watch(
// 	//     ($scope) => {
// 	// 	return $scope.uberon_selection;
// 	//     },
// 	//     (newVal, oldVal) => {
// 	// 	if(newVal && ($scope.filter_select.field.id == 'tissue_general' || $scope.filter_select.field.id == 'tissue_detail')){
// 	// 	    $scope.filter_select.value={'name': newVal.text, 'id': newVal.id};
// 	// 	}
// 	//     });
// 	//     function(old, new) {
// 	// 	if (new < 5) 
// 	// // 	    $http.get('/data/metadata.json').then((response) => {
// 	// // 		var result = response.data;
// 	// // 		$scope.valueOptions = result[new];
// 	// 	}
// 	//     };
// 	// );

// 	// Initialization function

// 	function init() {

// 	    $scope.ontologyInfo = {};

// 	    $scope.groupList = [];
// 	    $scope.selectedGroup = null;
// 	    $scope.removeGroup = (id) => {
// 		$scope.groupList = $scope.groupList.filter((entry) => { return entry.id !== id;});
// 	    };
// 	    $scope.addGroup = () => {

// 		var entry = {
// 		    marked: false,
// 		    id: Math.floor(Math.random()*11000),
// 		    groupName: $scope.inputGroupName,
// 		    cardinality: $scope.selectedGroup.points.length,
// 		    groupLabel: $scope.inputGroupName + ': ' + $scope.selectedGroup.points.length
// 		};

// 		$scope.groupList.push(entry);

// 		document.getElementById('addSelectionInput').disabled = true;
// 		document.getElementById('groupForm').reset();

// 	    };

// 	    $scope.attributeOptions = [
// 		{id: 'project', title: 'Data source'},
// 		{id: 'tissue_general', title: 'General tissue'},
// 		{id: 'tissue_detail', title: 'Detailed tissue'},
// 		{id: 'extraction_kit', title: 'Extraction kit'},
// 		{id: 'seq_platform', title: 'Sequencing platform'}
// 	    ];

// 	    $scope.filterOptions = [
// 		{id: 'exclude', title: 'Remove'},
// 		{id: 'include', title: 'Only'}
// 	    ];

// 	    plotData.getData()
// 		.then(plotData.processData)
// 		.then((data) => {
// 		    $scope.data = data;
// 		    $scope.filteredData = data;
// 		    return plotData.buildTraces(data,[]);
// 		})
// 		.then((traces) => {
// 		    $scope.layout = {
// 			height: $window.innerHeight,
// 			width: $window.innerWidth,
// 			title: 'Tsne test!'
			
// 		    };
// 		    $scope.traces = traces;
// 		    $scope.buildTraces=plotData.buildTraces;
// 		    $scope.options = {showLink:false};
// 		    // function for defining listeners for events emitted by plotly.js
// 		    $scope.plotlyEvents = (graph) => {
// 			graph.on('plotly_selected', (event) => {
// 			    if(event) {
// 				$scope.selectedGroup = event;
// 				document.getElementById('addSelectionInput').disabled = false;
// 				$scope.$apply();
// 			    }
// 			});
// 		    };
// 		})

// 		.catch(function(error) {
// 		    $log.error('Failed',error);
// 		});
// 	};
// 	init();
//     }])

//     .directive('filterInput',['$http', function($http) {
//     	return{
// 	    restrict: 'A',
// 	    controller: ['$scope', 'plotData', ($scope, plotData) => {
		
// 		$scope.filterData = () => {

// 		    function reduceFilters(){

// 			filterSet = new Set();
			
// 			$scope.filterList.forEach((entry) => {
// 			    filterSet.add(entry.field+'+'+entry.action);
// 			});
			
// 			var reducedFilters = [];

// 			filterSet.forEach((entry) => {
// 			    var ids = entry.split('+');
// 			    reducedFilters.push({
// 				value: $scope.filterList.filter((filterEntry) => {return filterEntry.marked && filterEntry.field===ids[0] && filterEntry.action===ids[1];})
// 				    .reduce((x,y) => x.concat(y.value),[]),
// 				field: ids[0],
// 				action: ids[1]
// 			    });
// 			});
			
// 			return reducedFilters;
// 		    }
		    

// 		    reducedFilters = reduceFilters();

// 		    var cnt = 0;

// 		    $scope.filteredData = reducedFilters.reduce((currData,filterEntry) => {
// 			cnt++;
// 			if(filterEntry.action === "exclude"){
// 			    // return currData.filter((dataEntry) => {return !filterEntry.value.includes(dataEntry[filterEntry.field]); });
// 			    return Object.keys(currData).filter((dataEntry) => {return !filterEntry.value.includes(currData[dataEntry][filterEntry.field]); }).map((key) => {return currData[key]; });
// 			}
// 			else if(filterEntry.action === "include"){
// 			    return Object.keys(currData).filter((dataEntry) => {return filterEntry.value.includes(currData[dataEntry][filterEntry.field]); }).map((key) => {return currData[key]; });			    
// 			    // return currData.filter((dataEntry) => {return filterEntry.value.includes(dataEntry[filterEntry.field]); });
// 			}
// 			else{
// 			    return currData;
// 			}
// 		    },$scope.data);

// 		    if(cnt===reducedFilters.length){
// 			$scope.buildTraces($scope.filteredData,$scope.trace_fields)
// 			    .then((result) => $scope.traces = result);
// 		    }

// 		};

// 		$scope.removeFilter = (id) => {
// 		    $scope.filterList = $scope.filterList.filter((entry) => {return entry.id !== id;});
// 		};

// 		$scope.addFilter = () => {

// 		    if($scope.filter_select.field && ($scope.filter_select.field.id == 'tissue_general' || $scope.filter_select.field.id == 'tissue_detail')){
			

// 			var entry = {
// 			    marked: true,
// 			    id: Math.floor(Math.random()*11000),
// 			    field: $scope.filter_select.field.id,
// 			    value: $scope.uberon_selection.id,
// 			    action: $scope.filter_select.action.id,
// 			    filterLabel: $scope.filter_select.action.title + ' ' + $scope.uberon_selection.text + ' in ' + $scope.filter_select.field.title
// 			};

// 			$scope.filterList.push(entry);
			
// 		    } else {

			
// 			var entry = {
// 			    marked: true,
// 			    id: Math.floor(Math.random()*11000),
// 			    field: $scope.filter_select.field.id,
// 			    value: $scope.filter_select.value[0].name,
// 			    action: $scope.filter_select.action.id,
// 			    filterLabel: $scope.filter_select.action.title + ' ' + $scope.filter_select.value[0].name + ' in ' + $scope.filter_select.field.title
// 			};

// 			$scope.filterList.push(entry);

// 		    }

// 		    // $scope.filterList.push(entry);

// 		};
// 	    }],
// 	    link: (scope, element, attrs) => {

// 		scope.filterList = [];
		
//     		// var $select_field = $('#filter-select-field').selectize({
// 		//     maxItems: 1,
// 		//     valueField: 'id',
// 		//     labelField: 'title',
// 		//     searchField: 'title',
// 		//     options: [
// 		// 	{id: 'project', title: 'Data source'},
// 		// 	{id: 'tissue_general', title: 'General tissue'},
// 		// 	{id: 'tissue_detail', title: 'Detailed tissue'},
// 		// 	{id: 'extraction_kit', title: 'Extraction kit'},
// 		// 	{id: 'seq_platform', title: 'Sequencing platform'}
// 		//     ],
//     		//     onChange: (value) => {
//     		// 	if(!value.length) return;
//     		// 	select_value.disable();
//     		// 	select_value.clearOptions();
// 		// 	select_value.load((callback) => {
// 		// 	    $.getJSON("data/metadata.json", (data) => {
// 		// 		var results = data[value];
// 		// 		select_value.enable();
// 		// 		callback(results);
// 		// 	    });
// 		// 	});
// 		//     }
// 		// });

// 		// var $select_value = $('#filter-select-value').selectize({
// 		//     maxItems: null,
// 		//     valueField: 'name',
// 		//     labelField: 'name',
// 		//     searchField: 'name',
// 		//     create: false
// 		// });

// 		// var $select_action = $('#filter-select-action').selectize({
// 		//     maxItems: 1,
// 		//     valueField: 'id',
// 		//     labelField: 'title',
// 		//     searchField: 'title',
// 		//     create: false,
// 		//     options: [
// 		// 	{id: 'exclude', title: 'Remove'},
// 		// 	{id: 'include', title: 'Only'}
// 		// 	]
// 		// });

// 		// select_field = $select_field[0].selectize;
// 		// select_value = $select_value[0].selectize;

// 		// select_value.disable();
		
// 	    }
//     	};
//     }])
//     // .directive('ontologySearch',[() => {
//     // 	return {
//     // 	    restrict: 'E',
//     // 	    replace: true,
//     // 	    template: '<input style="font-weight: normal" size="35" type="text" name="q" data-olswidget="select" data-olsontology="" data-selectpath="https://www.ebi.ac.uk/ols/" olstype="" id="local-searchbox" placeholder="Enter the term you are looking for" class="ac_input"></input>',
//     // 	    link: (scope, element, attrs) => {
//     // 		$(document).ready( () => {
//     // 		    // var instance = new app();
//     // 		    olsAutocompleteMod.olsAutocomplete.start();
//     // 		});
//     // 	    }
//     // 	};
//     // }])

//     .directive('ontologyExplorer',[() => {
// 	return{
// 	    restrict: 'E',
// 	    replace: true,
// 	    template: '<div></div>',
// 	    scope: {
// 		ont: '@',
// 		ontNode: '=',
// 		divid: '@'
// 	    },
// 	    controller: ($scope, $http) => {
// 		$('#'+$scope.divid).on('select_node.jstree', (e, data) => {
// 		    $scope.ontNode = data.node;
		    
// 		    $scope.$apply();

// 		    // // var id = data.node.iri.a_attr.replace("UBERON_(\d{1,})","UBERON:\1");
// 		    // var id = data.node.a_attr.iri.split('/').slice(-1)[0];
		    
// 		    // $http.get('http://localhost:3000/ontology_info/' + id)
// 		    // 	.then((response) => {
// 		    // 	    $scope.ontologyInfo = response.data;

// 		    // 	    $scope.$apply();
// 		    // 	});
// 			// $scope.filter_select.value = {'id': data.node.id,
// 		    // 			     'title': data.node.text};

// 		});

		

		
// 	    },
// 	    link: (scope, element, attrs) => {
// 		// scope.ontN = null;

// 		var createCORSRequest = function(method, url) {

// 		    var xhr = new XMLHttpRequest();
// 		    if ("withCredentials" in xhr) {
// 			xhr.open(method,url,true);
// 		    } else if (typeof XDomainRequest != "undefined"){
// 			xhr = new XDomainRequest();
// 			xhr.open(method,url);
// 		    }
// 		    else {
// 			xhr = null;
// 		    }
// 		    return xhr;
// 		};


// 		var tree = $('#'+scope.divid).jstree({
// 		    'plugins': [],
// 		    'core': {
// 			'data': (node,cb) => {
// 			    url = node.id === '#' ?
// 				'data/ontologies/roots/' + scope.ont + '_jstree_roots.json':
// 				'https://www.ebi.ac.uk/ols/api/ontologies/' + scope.ont + '/terms/' + encodeURIComponent(encodeURIComponent(node.original.iri)) + '/jstree/children/' + node.id;
// 			    var xhr = createCORSRequest('GET', url);

// 			    if(!xhr){
// 				alert('Your browser does not support this application! We suggest Chrome or Firefox');
// 			    }

// 			    xhr.onload = () => {
// 				var response = JSON.parse(xhr.response);
// 				cb.call(this,response);
// 			    };
			    
// 			    xhr.onerror = () => {
// 				alert('Error');
// 			    };

// 			    xhr.send();
// 			}
// 		    }
// 		});
			   

// 	    }
// 	};
//     }])

//     // Selectize menu for coloring plot
//     // .directive('colorSelect', function() {
//     // 	return{
//     // 	    restrict: 'E',
//     // 	    template: '<select></select>',
//     // 	    replace: true,
//     // 	    controller: ['$scope', ($scope) => {
//     // 		var $select = $('#select-groups').selectize({
//     // 		    maxItems: null,
//     // 		    valueField: 'id',
//     // 		    labelField: 'title',
//     // 		    searchField: 'title',
//     // 		    options: [
//     // 			{id: 'project', title: 'Data source'},
//     // 			{id: 'tissue_general', title: 'General tissue'},
//     // 			{id: 'tissue_detail', title: 'Detailed tissue'},
//     // 			{id: 'extraction_kit', title: 'Extraction kit'},
//     // 			{id: 'seq_platform', title: 'Sequencing platform'}
//     // 		    ],
//     // 		    create: false
//     // 		});
//     // 	    }]
//     // 	};
//     // })

//     // Button that allows coloring
//     .directive('colorButton', ['plotData', function(plotData) {
//     	return{
//     	    restrict: 'E',
//     	    template: '<input></input>',
//     	    replace: true,
//     	    controller: ['$scope', ($scope) => {
// 		$scope.colorize = function() {
// 		    if($scope.trace_select.fields){
// 			traceFields = $scope.trace_select.fields.map((entry) => {
// 			    return(entry.id);
// 			});
// 		    }
// 		    else{
// 			traceFields = [];
// 		    };
		    
// 		    plotData.buildTraces($scope.filteredData, traceFields)
// 			.then((result) => {
// 			    $scope.traces=result;
// 			});
//     		};
//     	    }]
//     	};
//     }])

//     // factory for handling http requests
//     .factory('httpRequests', ['$http', '$log', function($http, $log) {
// 	return {

// 	    /**  
// 	     httpRequests.post
// 	     url: type string
// 	     data: type json
// 	     type: type string
// 	     successCallback: type function handle
// 	     errorCallback: type function handle

// 	     return: void
// 	     */

// 	    post: (url, data, type) => {
// 		return $http({
// 		    url: url,
// 		    method: 'POST',
// 		    data: data,
// 		    headers: {
// 		    	'Content-Type': type
// 		    }
// 		});

// 	    }
// 	};
//     }])

// /**
//  file input directive
//  */

//     .directive('fileInput', ['csvParse', 'httpRequests', '$log', function(csv, httpRequests, $log) {
// 	return{
// 	    restrict: 'E',
// 	    replace: true,
// 	    template: `<input type="file"></input>`,
// 	    scope: {
// 		url: '@',
// 		storage: '=',
// 		status: '='
// 		}, // isolated scope
// 	    link: (scope, element, attrs) => {

// 		element.on('change', () => {
// 		    document.getElementById('pcaButton').disabled = true;
// 		    scope.status="Processing...";
// 		    var output = "";
// 		    reader = new FileReader();
// 		    if(element[0].files && element[0].files[0]){
// 			reader.onload = (event) => {
// 			    output = event.target.result;
// 			    httpRequests.post(scope.url, output, 'text/plain')

// 				.then((response) =>{
// 				    document.getElementById('pcaButton').disabled=false;
// 				    scope.status="Color by Distance";
// 				    var textLines = response.data.split(/\r\n|\n/);
// 				    scope.storage = {};
// 				    textLines.forEach((entry) => {
// 					entryParsed = csv.CSVtoArray(entry);
// 					scope.storage[entryParsed[0]] = entryParsed[1];
// 				    });
// 				},(response) => {
// 				    $log.error(response);
// 				});
// 			};
// 			reader.readAsText(element[0].files[0]);
// 		    }
// 		});
// 	    }
// 	};
//     }])

//     .directive('distButton', [() => {
// 	return{
// 	    restrict: 'E',
// 	    replace: true,
// 	    template: `<input type="button"></input>`,
// 	    controller: ['plotData', '$q', '$scope', (plotData, $q, $scope) => {

// 		$scope.euclid_pca_status="Waiting for file";

// 		$scope.colorTrace = function(colorHash)	{
// 		    var deferred = $q.defer();
// 		    var colorVec = [];
// 		    for(i=0; i<$scope.filteredData.length; i++){
// 			colorVec.push(colorHash[$scope.filteredData[i]['data_id']]);
// 		    }

// 		    if(i===$scope.filteredData.length){
// 			deferred.resolve([{
// 			    mode: 'markers',
// 			    name: 'test',
// 			    x: plotData.unpack($scope.filteredData,'y1'),
// 			    y: plotData.unpack($scope.filteredData,'y2'),
// 			    text: colorVec,
// 			    type: 'scattergl',
// 			    hoverinfo: 'text',
// 			    marker: {
// 				color: colorVec,
// 				showscale: true
// 			    }
// 			}]);
// 		    }
// 		    return deferred.promise;
// 		};

// 		$scope.colorClick = function(colorHash) {
// 		    $scope.colorTrace(colorHash)
// 			.then((response) => {
// 			    $scope.traces = response;
// 			});
// 		};
// 	    }]
// 	};
//     }]);

