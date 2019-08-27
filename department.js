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
app.get('/department',(req,res)=>{
    knex.select('*').from('department')
    .then((Data)=> {
        res.json(Data);
        console.log('get is working');
    })
    .catch((error)=> {
        res.json(error);
    })
})

//this is use for get data throw id
app.get('/department/:id',(req,res)=>{
  // var department_id = req.params.id;
  // console.log(department_id);
  knex.select('*').from('department').where("department_id",req.params.id)
  .then((Data)=>{
    res.json(Data);
    console.log("get id is working");
  })
  .catch((error)=>{
    res.json(error);
    console.log(error);
  })
})


var server = app.listen(3000, () => {
  console.log("app listening");
}); 
