const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const exec = require('child_process').exec;
const Rserve = require('rserve-js');
const path = require('path');
const request = require('request');
const pgp = require('pg-promise')();

var app = express();

app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.text({limit: '500kb'}));
app.use(bodyParser.raw({limit: '500kb'}));

app.use(express.static('public'));

var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var rawParser = bodyParser.raw();

const genecn = {
    host: 'localhost',
    port: '5432',
    database: 'mydb',
    user: 'Jake'
};

const db = pgp(genecn);

app.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ols/:resourceIRI/:nodeID',(req, res) => {

    var url = 'https://www.ebi.ac.uk/ols/api/ontologies/terms/' + req.params.resourceIRI + '/children/jstree/' + req.params.nodeID;
    req.pipe(request(url)).pipe(res);

});

app.get('/uberon_search/:searchTerm',(req,res) => {

    res.set({'Content-Type': 'application/json'});

    db.any("SELECT id,name FROM recount_metasra WHERE id LIKE 'UBERON%' AND (UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') OR UPPER(id) LIKE UPPER('%" + req.params.searchTerm + "%')) LIMIT 12")
    //db.any("SELECT id,name FROM recount_metasra WHERE UPPER(id) LIKE UPPER('" + req.params.searchTerm + "%') OR UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') LIMIT 12") 
	.then((data) => {
	    res.send(data);
	})
	.catch((error) => {
	    res.send(error);
	});
});

app.get('/doid_search/:searchTerm',(req,res) => {

    res.set({'Content-Type': 'application/json'});

    db.any("SELECT id,name FROM recount_metasra WHERE id LIKE 'DOID%' AND (UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') OR UPPER(id) LIKE UPPER('%" + req.params.searchTerm + "%')) LIMIT 12")
    //db.any("SELECT id,name FROM recount_metasra WHERE UPPER(id) LIKE UPPER('" + req.params.searchTerm + "%') OR UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') LIMIT 12") 
	.then((data) => {
	    res.send(data);
	})
	.catch((error) => {
	    res.send(error);
	});
});


app.get('/gene_vals/:gene_id',(req,res) => {

    db.one('SELECT vals FROM gene_vals WHERE gene_id = $1',req.params.gene_id)

	.then((data) => {
	    res.set({
		'Content-Type': 'application/json'});

	    if(!data){
		res.send({});
	    }
	    else{
		res.send(data.vals);
	    }
	});
});
	

app.get('/ontology_info/:ontTerm',(req,res) => {

    // var ont_id = req.params.ontTerm.replace('_','');



    db.oneOrNone("SELECT termtree FROM recount_metasra WHERE id = $1",req.params.ontTerm)
	.then((data) => {
	    
	    res.set({
		'Content-Type': 'application/json'});

	    if(!data){
		res.send({});
	    }
	    else{
		res.send(data.termtree);
	    }
	    
	});

    // res.set({'Content-Type': 'application/json'});

    // db.any("select * FROM gene WHERE UPPER(gene_id) LIKE UPPER('" + req.params.searchTerm + "%') OR UPPER(gene_symbol) LIKE UPPER('" + req.params.searchTerm + "%') LIMIT 12")
    // 	.then((data) => {
    // 	    res.send(data);
    // 	})
    // 	.catch((error) => {
    // 	    res.send(error);
    // 	});
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
	    
	    return;
	});
	return;
    });
});

app.get('/mesh_tree/:id',(req,res) => {

    res.set({'Content-Type': 'application/json'});

    // db.one("SELECT children FROM mesh_tree WHERE " + req.params.id + " LIKE id")
    db.one("SELECT children FROM mesh_tree WHERE id = $1",req.params.id)
	   // 'UBERON%' AND (UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') OR UPPER(id) LIKE UPPER('%" + req.params.searchTerm + "%')) LIMIT 12")
    //db.any("SELECT id,name FROM recount_metasra WHERE UPPER(id) LIKE UPPER('" + req.params.searchTerm + "%') OR UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') LIMIT 12") 
	.then((data) => {
	    res.send(data);
	})
	.catch((error) => {
	    res.send(error);
	});
});

app.get('/doid_tree/:id',(req, res) => {
    res.set({'Content-Type': 'application/json'});

    // db.one("SELECT children FROM mesh_tree WHERE " + req.params.id + " LIKE id")
    db.one("SELECT children FROM doid_tree WHERE id = $1",req.params.id)
	   // 'UBERON%' AND (UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') OR UPPER(id) LIKE UPPER('%" + req.params.searchTerm + "%')) LIMIT 12")
    //db.any("SELECT id,name FROM recount_metasra WHERE UPPER(id) LIKE UPPER('" + req.params.searchTerm + "%') OR UPPER(name) LIKE UPPER('%" + req.params.searchTerm + "%') LIMIT 12") 
	.then((data) => {
	    res.send(data);
	})
	.catch((error) => {
	    res.send(error);
	});
});


const server = app.listen(3000,function () {
    console.log('Example app listening on port 3000');
});



server.timeout = 360000;
