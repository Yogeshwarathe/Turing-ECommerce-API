var express = require('express');
var Product = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');


Product.use(bodyParser.urlencoded({
    extended: true
}));

Product.use(express.json())


var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})




// module.exports = (Product,knex)=>{

Product.get("/products",(req,res)=>{
    knex.select('*').from('product')
    .then((Data)=>{
        res.json(Data);
    })
    .catch((error)=>{
        res.json(error)
        console.log(error)
    })
})

Product.get("/products/:search",(req,res)=>{
    knex.select('*')
    .from('product')
    .where('product.name',req.params.search)
    .then((Data)=>{
        res.json(Data);
    })
    .catch((error)=>{
        res.json(error)
        console.log(error)
    })
})




Product.get("/products/:id",(req,res)=>{
    var product_id = req.params.id;
    knex
    .select('*')
    .from('product')
    .where('product_id',product_id)
    .then((Data)=>{
        // res.json(Data);
        res.send(Data);
        // console.log(Data)
    })
    .catch((error)=>{
        res.send(error)
        // console.log(err)
    })
})


Product.get('/products_inCategory/:category_id',(req,res)=>{
    knex
    .select(
        'product.product_id',
        'product.name',
        'product.description',
        'product.price',
        'product.discounted_price',
        'product.thumbnail'
    )
    .from('product')
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .where('product_category.product_id', req.params.category_id)
    .then((data)=>{
      // console.log(data)
      res.send(data); 
    })
    .catch((error)=>{
      res.send(error);
      console.log(error)
    })
  })


Product.get('/In_Department/:dep_id',(req,res)=>{
    knex
    .select(
        'product.product_id',
        'product.name',
        'product.description',
        'product.price',
        'product.discounted_price',
        'product.thumbnail'
    )
    .from('product')
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .join('category', function(){
        this.on('product_category.category_id', 'category.category_id')
    })
    .join('department', function(){
        this.on('category.department_id', 'department.department_id')
    })
    .where('department.department_id', req.params.dep_id)
    .then((data)=>{
      // console.log(data)
      res.send(data); 
    })
    .catch((error)=>{
      res.send(error);
    //   console.log(error)
    })
  })

Product.get('/products_Details/:id',(req,res)=>{
    knex
    .select('product.product_id',
        'product.name',
        'product.description',
        'product.price',
        'product.discounted_price',
        'product.image',
        'product.image_2')
    .from("product")
    .where('product.product_id', req.params.id)
    .then((data)=>{
        // console.log(data)
        res.send(data); 
      })
    .catch((err)=>{
        res.send(err)
    })
})

Product.get('/products_location/:id',(req,res)=>{
    knex
    .select('category.category_id',
            'category.name as category_name',
            'category.department_id',
            'department.name as department_name'
            )
    .from('category')
    .join('department',function(){
        this.on('category.department_id','department.department_id')
    })
    .join('product_category',function(){
        this.on('category.category_id','product_category.category_id')
    })
    .where('product_category.product_id',req.params.id)
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send(err);
    })
})

Product.get('/products_reviews/:id',(req,res)=>{
    knex
    .select('review.review',
            'review.rating',
            'review.created_on',
            'product.name')
    .from('review')
    .join('product',function(){
        this.on('product.product_id','review.product_id')
    })
    .where('review.product_id',req.params.id)
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send(err);
    })
})

Product.post('/products_reviews/:id',(req,res)=>{
    var all_data = {
        review_id : req.body.review_id,
        customer_id : req.params.id,
        product_id : req.body.product_id,
        review : req.body.review,
        rating : req.body.rating,
        created_on : req.body.created_on

    }
    knex('review').insert(all_data)
    .then((data)=>{
        // console.log("data insert done");
        res.send("data insert done");
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })

})

// }

var server = Product.listen("3000",()=>{
    console.log("it is working");
})


