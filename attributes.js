var express = require('express');
var app = express();
var mysql = require('mysql');

app.use(express.json())

var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})

app.get('/attributes',(req,res)=>{
	knex.select("*").from("attribute")
	.then((Data)=>{
		res.json(Data);
	})
	.catch((error)=>{
		res.json(error);
	})
})

app.get('/attributes/:id',(req,res)=>{
	knex.select("*").from("attribute").where("attribute_id",req.params.id)
	.then((Data)=>{
		res.json(Data);
	})
	.catch((error)=>{
		res.json(error);
	})
})

app.get('/value/attribute/:id',(req,res)=>{
	knex.select("attribute_value_id",'value').from("attribute_value").where("attribute_id",req.params.id)
	.then((Data)=>{
		res.json(Data);
	})
	.catch((error)=>{
		res.json(error);
	})
})

app.get('/inProduct/:produ_id',(req,res)=>{
  knex.select('attribute_value.attribute_id','attribute_value_id', 'value',)
  .from('attribute_value')
  .join('product_category','attribute' , function(){
    this.on('attribute_value.attribute_value_id', 'product_category.product_id','attribute.name')
  })
  .where('product_category.product_id', req.params.produ_id)
  .then((data)=>{
    // console.log(data)
    res.json(data); 
  })
  .catch((error)=>{
    res.json(error);
    console.log(error)
  })
}) 


var server = app.listen('3000',()=>{
	console.log('app is working......');
})