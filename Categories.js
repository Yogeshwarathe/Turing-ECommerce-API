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

// this is use for get data 
app.get('/categories',(req,res)=>{
    knex.select('*').from('category')
    .then((Data)=> {
        res.json(Data);
        console.log('get is working');
    })
    .catch((error)=> {
        res.json(error);
    })
})

//this is use for get data  id
app.get('/categories/:id',(req,res)=>{
  knex.select('*').from('category').where("category_id",req.params.id)
  .then((Data)=>{
    res.json(Data);
    console.log("get id is working");
  })
  .catch((error)=>{
    res.json(error);
    console.log(error);
  })
})


app.get('/inProduct/:id',(req,res)=>{
  // i join two table (product_category and category) and then inter produt id and got data
  knex.select('category.category_id', 'department_id', 'name')
  .from('category')
  .join('product_category', function(){
    this.on('category.category_id', 'product_category.category_id')
  })
  .where('product_category.product_id', req.params.id)
  .then((data)=>{
    // console.log(data)
    res.json(data);
  })
  .catch((error)=>{
    res.json(error);
  })
  
})

app.get('/department/:id',(req,res)=>{
  knex.select('*')
  .from("category")
  .where("department_id",req.params.id)
  .then((Data)=>{
    res.json(Data);
  })
  .catch((error)=>{
    res.json(error);
  })
})


var server = app.listen(3000, () => {
  console.log("app is working....");
}); 


