var express = require('express');
var tax = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');

tax.use(bodyparser.urlencoded({
    extended: true
}));


var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})

tax.get('/tax',(req,res)=>{
    knex
    .select('*')
    .from('tax')
    .then((data)=>{
        res.send(data);

    })
    .catch((err)=>{
        res.send("Error");
        console.log(err);
    })
})


tax.get('/tax/:id',(req,res)=>{
    knex
    .select('*')
    .from('tax')
    .where('tax.tax_id',req.params.id)
    .then((data)=>{
        res.send(data);

    })
    .catch((err)=>{
        res.send("Error");
        console.log(err);
    })
})


var server = tax.listen(3000,function(){
    console.log("server is working")
})