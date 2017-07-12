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

app.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/euclid_pca',textParser, (req, res) => {
    if(!req.body) {res.sendStatus(400); return;};

    var num = Math.floor(Math.random()*8192);

    fs.writeFile("private/tmp/incoming/entry_"+num+".tsv",req.body,(err) => {
	if(err) {
	    console.log(err);
	    return;
	}

	console.log('Data written to private/tmp/incoming/entry_'+num+'.tsv');

	exec('echo ' + num + ' | Rscript public/src/R/euclidian_pca_distance.R', (error, stdout, stderr) => {
    	    if (error) {
    		console.error(`exec error: ${error}`);
    		res.send(error);
    		return;
    	    }
    	    console.log(`stdout: ${stdout}`);
    	    console.log(`stderr: ${stderr}`);

	    res.set({
	    	'Content-Type': 'text/plain'});

	    res.sendFile('entry_'+num+'.tsv',{ root: path.join(__dirname+'/private/tmp/outgoing/')},function(err){
	    	if(err) {
		    console.error(`exec error: ${err}`);
	    	    res.send(error);
	    	    return;
	    	}
	    	else{
		    console.log('file sent');
	    	    return;
	    	}
	    });
	});
	return;
    });
    return;
});

const server = app.listen(3000,function () {
    console.log('Example app listening on port 3000');
});

server.timeout = 360000;
