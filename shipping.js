var express = require('express');
var shipping = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');

shipping.use(bodyparser.urlencoded({
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

shipping.get('/shipping/regions',(req,res)=>{
    knex
    .select('*')
    .from('shipping_region')
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send("Error");
        console.log(err);
    })
})


shipping.get('/shipping/regions/:id',(req,res)=>{
    knex
    .select('*')
    .from('shipping')
    .where('shipping.shipping_region_id',req.params.id)
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send("Error");
        console.log(err);
    })
})



var server = shipping.listen(3000,function(){
    console.log("shipping server is working");
})