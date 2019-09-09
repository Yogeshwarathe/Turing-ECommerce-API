var express = require('express');
var orders = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');

orders.use(bodyparser.urlencoded({
    extended: true
}));

orders.use(express.json())


var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})


orders.post('/orders/create',(req,res)=>{
    var body = req.body;
    // console.log(a)

    var token = req.headers.cookie
    // console.log(token);
    if (token != undefined){
        token = token.split(' ')
        token = token[token.length-1]
        token = token.slice(0,-13)
        // console.log(token);
        token = jwt.verify(token,"123")
        // console.log(token.customer_id);
        knex
            .select('*')
            .from('shopping_cart')
            .join('product',function(){
                this.on('shopping_cart.product_id','product.product_id')
            })
            .where('shopping_cart.cart_id',req.body.cart_id)
            .then((data)=>{
                // console.log(dict);
                knex('orders').insert({
                    total_amount : data[0].quantity * data[0].price,
                    created_on : new Date(),
                    customer_id : token.customer_id,
                    shipping_id : req.body.shipping_id,
                    tax_id : req.body.tax_id
                    })
                    .then(()=>{
                        // res.send("insert is done");
                        knex('customer')
                        .where('customer.customer_id',token.customer_id)
                        .del()
                        .then(()=>{
                            res.send('Done');
                        })
                        .catch((err)=>{
                            res.send("Error");
                            console.log(err);
                        })
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.send("Error");
                    })
            })
            .catch((err)=>{
                console.log("table join error",err)
            })
    }
  
})


var serve = orders.listen("3000",(req,res)=>{
    console.log("orders is workin");
})