var express = require('express');
var shoppingcart = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');
var uuid = require("uuid"); // unic id maker
var cookieParser = require('cookie-parser');
// var datetime = new Date();
// console.log(datetime);

shoppingcart.use(bodyparser.urlencoded({
    extended: true
}));

shoppingcart.use(express.json())


var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})

// Generate the unique cart id
shoppingcart.get('/shoppingcart/generateUniqueId',(req,res)=>{
    var unic_id = uuid.v1();
    unic_id = unic_id.split("-")
    // console.log(unic_id[0]);
    res.send({cart_id : unic_id[0]})
    
})

// add a product in the cart
shoppingcart.post('/shoppincart/add', (req, res) => {
    var cart_id = req.body.cart_id;
    var product_id = req.body.product_id;
    var attributes = req.body.attributes;

    function all_data() {
        knex
        .select(
            'item_id',
            'name',
            'attributes',
            'shopping_cart.product_id',
            'image',
            'price',
            'quantity'
        )
        .from('shopping_cart')
        .join('product', function() {
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where('shopping_cart.cart_id', cart_id)
        .then((data) => {
            // console.log(data)
            var add_subtotal = data[0].quantity * data[0].price;
            // console.log(add_subtotal);
            data[0].subtotal = add_subtotal
            // console.log(data);
            return res.send(data);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        })
    }

   
    knex
    .select('*')
    .from('shopping_cart')
    .where('shopping_cart.cart_id', cart_id)
    .then((data) => {
        if (data.length == 0) {
            knex('shopping_cart')
            .insert({
                cart_id: cart_id,
                product_id: product_id,
                attributes: attributes,
                quantity: 1,
                added_on: new Date()
            })
            .then(() => {
                all_data();
            })
            .catch((err) => {
                console.log(err);
                res.send('error');
            })

        } else {
            quantity = data[0].quantity + 1
            // console.log(quantity)
            knex('shopping_cart')
            .update({
                'quantity': quantity,
                'added_on': new Date()
            })
            .where('shopping_cart.cart_id', cart_id)
            .then(() => {
                all_data(); 
            })
        }
        })
    .catch((err) => {
        console.log(err);
        res.send("Error!");
    })
})

// get list of products in shopping cart
shoppingcart.get('/shoppingcart/:cart_id',(req,res)=>{
    var cart_id = req.params.cart_id;
    // console.log(cart_id);
    knex
    .select(
        'item_id',
        'name',
        'attributes',
        'shopping_cart.product_id',
        'image',
        'price',
        'quantity'
    )
    .from('shopping_cart')
    .join('product', function() {
        this.on('shopping_cart.product_id', 'product.product_id')
    })
    .where('shopping_cart.cart_id', cart_id)
    .then((data) => {
        // console.log(data)
        var add_subtotal = data[0].quantity * data[0].price;
        // console.log(add_subtotal);
        data[0].subtotal = add_subtotal
        // console.log(data);
        res.send(data);
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })

    
})

// update the cart by item 
shoppingcart.put('/update/:id',(req,res)=>{
    // console.log(req.params.id);
    // console.log(req.body.quantity);
    knex('shopping_cart')
    .update({
        quantity: req.body.quantity,
        added_on: new Date()
    })
    .where('shopping_cart.cart_id',req.params.id)
    .then(()=>{
        // console.log("done");
        knex
        .select('cart_id')
        .from('shopping_cart')
        .where('shopping_cart.cart_id',req.params.id)
        .then((data)=>{
            // var product_id = data[0].product_id;
            // console.log(product_id);
            knex
                .select(
                    'item_id',
                    'name',
                    'attributes',
                    'shopping_cart.product_id',
                    'price',
                    'quantity',
                )
                .from('shopping_cart')
                .join('product',function(){
                    this.on('shopping_cart.product_id','product.product_id')
                })
                .where('shopping_cart.cart_id',data[0].cart_id)
                .then((Data)=>{
                    // console.log(Data);
                    var man_data = Data[0].quantity * Data[0].price;
                    Data[0].subtotal = man_data
                    res.send(Data);
                })
                .catch((err)=>{
                    console.log(err);
                    res.send('!error');
                })
        })
        .catch((err)=>{
            console.log(err);
            res.send("error");
        })

    })
    .catch((err)=>{
        console.log(err);
        res.send("Error");
    })
})

// emty cart 
shoppingcart.delete('/empty/delete/:cart_id',(req,res)=>{
    knex('shopping_cart')
    .where('shopping_cart.cart_id',req.params.cart_id)
    .del()
    .then(()=>{
        res.send("Delete sucsessfull");
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error");
    })
})

// return a totalAmount in shoppingcart
shoppingcart.get('/totalAmount/:cart_id',(req,res)=>{
    knex
    .select(
        'quantity',
        'price'
    )
    .from('shopping_cart')
    .join('product',function(){
        this.on('shopping_cart.product_id','product.product_id')
    })
    .where('shopping_cart.cart_id',req.params.cart_id)
    .then((data)=>{
        // var total_data = data[0].quantity * data[0].price;
        res.send({total_amount : data[0].quantity * data[0].price});
    })
    .catch((err)=>{
        res.send("Error");
        console.log(err);
    })
})

// move a product to cart and save a Product for latter
shoppingcart.get('/moveToCart/:item_id',(req,res)=>{

    function insert_data(){
        knex
        .select(
            'item_id',
            'cart_id',
            'product_id',
            'attributes',
            'quantity',
        )
        .from('shopping_cart')
        .where('shopping_cart.item_id', req.params.item_id)
        .then((data) => {
            // console.log(data[0]);
            knex('saveData')
            .insert(data[0])
            .then((insert)=>{
                // res.send("data insert done");
                knex('shopping_cart')
                .where('shopping_cart.item_id',req.params.item_id)
                .del()
                .then(()=>{
                    res.send("delete done");
                })
                .catch((err)=>{
                    console.log(err);
                    res.send("ERROR IN DELETE");
                })

            })
            .catch((err)=>{
                console.log(err);
                res.send("err in your terminal");
            })
        })
        .catch((err) => {
            console.log(err);
            res.send("Error");
        })
    }
    
    knex.schema.hasTable('saveData')
    .then((exists)=>{
        if(!exists){
            return knex.schema.createTable('saveData', function(table) {
                table.integer('item_id').primary();
                table.string('cart_id');
                table.integer('product_id');
                table.string('attributes');
                table.integer('quantity');

                insert_data() // it is function 
            })
                
                
        
        } else {
            // console.log(req.params.item_id);
            insert_data()  // it is function 
        }    
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error");
    })


})

// get products saved for latter 
shoppingcart.get('/getSaved/:id',(req,res)=>{
    // var cart_id = req.params.id;
    // console.log(cart_id);
    knex
    .select('item_id',
            'name',
            'attributes',
            'price'
            )
    .from('saveData')
    .join('product',function(){
        this.on('saveData.product_id','product.product_id')
    })
    .where('saveData.cart_id', req.params.id)
    .then((data)=>{
        console.log(data);
        res.send(data);
    })
    .catch((err)=>{
        console.log(err);
        res.send("!Error")
    })
})

// Remove a product in the cart
shoppingcart.delete('/remove/product/:item_id',(req,res)=>{
    // var item_id = req.params.item_id;
    // console.log(item_id);
    knex('saveData')
    .where('saveData.item_id',req.params.item_id)
    .del()
    .then(()=>{
        res.send("Delete is done")
    })
    .catch((err)=>{
        console.log(err);
        res.send("!Error");
    })
})

var serve = shoppingcart.listen("3000",(req,res)=>{
    console.log("shoppingcart is workin");
})