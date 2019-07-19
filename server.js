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
app.use(bodyParser.text({limit: '10mb'}));
app.use(bodyParser.raw({limit: '500kb'}));

var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var rawParser = bodyParser.raw();

genecn = JSON.parse(fs.readFileSync('db_con.json'));

const db = pgp(genecn);

app.get('/ols/:resourceIRI/:nodeID',(req, res) => {

    var url = 'https://www.ebi.ac.uk/ols/api/ontologies/terms/' + req.params.resourceIRI + '/children/jstree/' + req.params.nodeID;
    req.pipe(request(url)).pipe(res);

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
	

app.get('/tissue_info/:ontTerm',(req,res) => {

    db.oneOrNone("SELECT termTree FROM tissue_tree WHERE id = $1",req.params.ontTerm)
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
});

app.get('/doid_info/:ontTerm',(req,res) => {

    db.oneOrNone("SELECT termtree FROM doid_dat WHERE id = $1",req.params.ontTerm)
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
});

app.get('/efo_info/:ontTerm',(req,res) => {

    db.oneOrNone("SELECT termtree FROM efo_tree WHERE id = $1",req.params.ontTerm)
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
});

app.get('/ontology_info/:ontTerm',(req,res) => {
    db.oneOrNone("SELECT termtree FROM mesh_tree WHERE id = $1",req.params.ontTerm)
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

});





const server = app.listen(3000,function () {
    console.log('Example app listening on port 3000');
});



server.timeout = 360000;
