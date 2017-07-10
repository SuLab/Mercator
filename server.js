const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const exec = require('child_process').exec;
const Rserve = require('rserve-js');
const path = require('path');

var app = express();

var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var rawParser = bodyParser.raw();

app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.text({limit: '500kb'}));
app.use(bodyParser.raw({limit: '500kb'}));

app.use(express.static('public'));

// app.get('/',function (req, res) {

//     var client = Rserve.connect("localhost",8008,function() {
// 	console.log("Connected to R daemon");
	
// 	client.eval("data(iris)",function(err, response) {
// 	    if (err) {
// 		console.log('data load error');
// 		throw err;
// 	    }

// 	    client.eval("dim(iris)", function(err, response) {
// 		if (err) {
// 		    console.log('dim error');
// 		    throw err;
// 		}

// 		console.log(response);
// 	    });
// 	});
//     });
//     res.send('allo');
// });

// app.get('/',function(rep, res

app.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname + '/test.html'));
});

app.post('/euclid_distance',textParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    var num = Math.floor(Math.random()*8192);

    fs.writeFile("tmp/incoming/entry_"+num+".tmp",req.body,(err) => {
	if(err) {
	    return console.log(err);
	}
	console.log('Data written to tmp/incoming_tsv/entry_'+num+'.tsv');

	exec('gsed -f sh/newlines_sed.sh tmp/incoming/entry_' + num+'.tmp > tmp/incoming_tsv/entry_'+num+'.tsv', (error, stdout, stderr) => {
	    if (error) {
		console.error(`exec error: ${error}`);
		res.send(error);
		return;
	    }
	    exec('echo ' + num + ' | Rscript R/euclidian_distance.R', (error, stdout, stderr) => {
		// exec('echo ' + JSON.stringify(req.body), (error, stdout, stderr) => {
    		if (error) {
    		    console.error(`exec error: ${error}`);
    		    res.send(error);
    		    return;
    		}
    		console.log(`stdout: ${stdout}`);
    		console.log(`stderr: ${stderr}`);

		res.set({
	    	    'Content-Type': 'text/plain'});

		res.sendFile('entry_'+num+'.tsv',{ root: path.join(__dirname+'/tmp/outgoing/')},function(err){
	    	    if(err) {
	    		console.error(`exec error: ${err}`);
	    		res.send(error);
	    		return;
	    	    }
	    	    else{
	    		console.log('file sent');
	    	    }
		});
	    });
	});
    });
});

app.post('/euclid_pca',textParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    var num = Math.floor(Math.random()*8192);

    fs.writeFile("tmp/incoming/entry_"+num+".tmp",req.body,(err) => {
	if(err) {
	    return console.log(err);
	}

	console.log('Data written to tmp/incoming/entry_'+num+'.tsv');

	exec('gsed -f sh/newlines_sed.sh tmp/incoming/entry_' + num+'.tmp > tmp/incoming_tsv/entry_'+num+'.tsv', (error, stdout, stderr) => {
	    if (error) {
		console.error(`exec error: ${error}`);
		res.send(error);
		return;
	    }

	    exec('echo ' + num + ' | Rscript R/euclidian_pca_distance.R', (error, stdout, stderr) => {
		// exec('echo ' + JSON.stringify(req.body), (error, stdout, stderr) => {
    		if (error) {
    		    console.error(`exec error: ${error}`);
    		    res.send(error);
    		    return;
    		}
    		console.log(`stdout: ${stdout}`);
    		console.log(`stderr: ${stderr}`);

		res.set({
	    	    'Content-Type': 'text/plain'});

		res.sendFile('entry_'+num+'.tsv',{ root: path.join(__dirname+'/tmp/outgoing/')},function(err){
	    	    if(err) {
	    		console.error(`exec error: ${err}`);
	    		res.send(error);
	    		return;
	    	    }
	    	    else{
	    		console.log('file sent');
	    	    }
		});
	    });
	});
    });
});

	
app.post('/spearman_distance',textParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    var num = Math.floor(Math.random()*8192);

    fs.writeFile("tmp/incoming/entry_"+num+".tmp",req.body,(err) => {
	if(err) {
	    return console.log(err);
	}
	
	console.log('Data written to tmp/incoming/entry_'+num+'.tsv');

	exec('gsed -f sh/newlines_sed.sh tmp/incoming/entry_' + num+'.tmp > tmp/incoming_tsv/entry_'+num+'.tsv', (error, stdout, stderr) => {
	    if (error) {
		console.error(`exec error: ${error}`);
		res.send(error);
		return;
	    }

	    exec('echo ' + num + ' | Rscript R/spearman_rank_distance.R', (error, stdout, stderr) => {
		// exec('echo ' + JSON.stringify(req.body), (error, stdout, stderr) => {
    		if (error) {
    		    console.error(`exec error: ${error}`);
    		    res.send(error);
    		    return;
    		}
    		console.log(`stdout: ${stdout}`);
    		console.log(`stderr: ${stderr}`);

		res.set({
	    	    'Content-Type': 'text/plain'});

		res.sendFile('entry_'+num+'.tsv',{ root: path.join(__dirname+'/tmp/outgoing/')},function(err){
	    	    if(err) {
	    		console.error(`exec error: ${err}`);
	    		res.send(error);
	    		return;
	    	    }
	    	    else{
	    		console.log('file sent');
	    	    }
		});
	    });
	});
    });
});


// app.post('/spearman_distance',jsonParser, (req, res) => {
//     if(!req.body) return res.sendStatus(400);

//     var num = Math.floor(Math.random()*8192);

//     fs.writeFile("tmp/incoming_tsv/entry_"+num+".tsv",JSON.stringify(req.body),(err) => {
// 	if(err) {
// 	    return console.log(err);
// 	}
// 	console.log('Data written to tmp/incoming_json/entry_'+num+'.tsv');

//     });

//     exec('echo ' + num + ' | Rscript R/spearman_rank_distance.R', (error, stdout, stderr) => {
//     // exec('echo ' + JSON.stringify(req.body), (error, stdout, stderr) => {
//     	  if (error) {
//     	      console.error(`exec error: ${error}`);
//     	      res.send(error);
//     	      return;
//     	  }
//     	console.log(`stdout: ${stdout}`);
//     	console.log(`stderr: ${stderr}`);

//     	res.send(stdout);
//     });


//     // res.send('end');
// });


const server = app.listen(3000,function () {
    console.log('Example app listening on port 3000');
});

server.timeout = 360000;
