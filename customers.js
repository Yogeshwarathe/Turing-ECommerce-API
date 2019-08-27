var express = require('express');
var customers = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

customers.use(cookieParser());


customers.use(bodyParser.urlencoded({
    extended: true
}));

customers.use(express.json())


var knex = require('knex')({
	client : "mysql",
	connection : {
		host : "localhost",
		user : "root",
		password : "navgurukul",
		database : "turingdb"
	}
})

// (post)resister a customer
customers.post("/customers/post", (req, res) =>{
    // console.log(req.body);
    var email = req.body.email;
    // console.log(email);
    var accessToken = jwt.sign(req.body, "123",{expiresIn: "24h"})
    res.cookie( accessToken, 'cookie_value');
    // console.log(accessToken );
    knex
    .select('*')
    .from('customer')
    .where('customer.email', email)
    .then((data) =>{
        knex('customer').insert(req.body)
        .then((result) =>{
            knex
            .select('*')
            .from('customer')
            .where('email',email)
            .then((user) =>{
                // console.log(user);
                userdata = {'customer': {'schema': user[0]}, accessToken, expires_in: '24h'}
                res.send(userdata);
            })
            .catch((err) => {
                console.log(err);
            })
        }).catch((err) =>{
            console.log(err);
        })
        
    })
})


customers.get('/customers/:id',(req,res)=>{
    var accessToken = jwt.sign(req.params, "123",{expiresIn: "24h"})
    // console.log(accessToken);
    if(accessToken!=undefined){
        // console.log(accessToken);
        jwt.verify(accessToken,"123", (err, data) =>{
            console.log(data);
            knex
            .select('*')
            .from('customer')
            .where('customer.customer_id',req.params.id)
            .then((data)=>{
                res.send(data);
            })
            .catch((err)=>{
                res.send(err);
                console.log(err);
            })
        })
    }
})

customers.put("/customers/put",(req, res)=>{
    var token = req.headers.cookie;
    // console.log(token);
    if(token!=undefined){
        token = token.split(" ")
        // console.log(token);
        token = token[token.length-1]
        token = token.slice(0,-13)
        // console.log(token);
        jwt.verify(token,"123", (err, data) =>{
            // console.log(data);
            var customer_id = data.customer_id;
            var token_data = req.body;
            // console.log(customer_id);
            knex('customer')
            .update(token_data)
            .where('customer.customer_id',customer_id)
            .then((data) =>{
                res.send("Put data updated successfully")
            }).catch((err) =>{
                res.send(err);
            })
        
        })
    }
})

customers.post("/customers/login", (req, res) =>{
    knex
    .select('*')
    .from('customer')
    .where('customer.email', req.body.email)
    .then((data) =>{
        // console.log(data);
        var accessToken = jwt.sign({name:data[0].name,customer_id : data[0].customer_id}, "123",{expiresIn: "24h"})
        // console.log(accessToken);
        res.cookie( accessToken, 'cookie_value');

        userdata = {'customer': {'schema': data[0]}, accessToken, expires_in: '24h'}
            // console.log(userdata);
            res.send(userdata);
            
        }).catch((err) =>{
            console.log(err);
        })
        
})


customers.put("/customers/address",(req, res)=>{
    var Alltoken = req.headers.cookie;
    // console.log(token);
    if(Alltoken!=undefined){
        Alltoken = Alltoken.split(" ")
        // console.log(token);
        Alltoken = Alltoken[Alltoken.length-1]
        Alltoken = Alltoken.slice(0,-13)
        // console.log(token);
        jwt.verify(Alltoken,"123", (err, data) =>{
            // console.log(data);
            var customer_id = req.body.customer_id;
            var token_data = req.body;
            // console.log(customer_id);
            knex('customer')
            .update(token_data)
            .where('customer.customer_id',customer_id)
            .then((data) =>{
                res.send("address data updated successfully")
            }).catch((err) =>{
                res.send(err);
            })
        
        })
    }
})


customers.put('/customers/creditCard',(req,res)=>{
    token = req.headers.cookie;
    // console.log(token);
    if (token!=undefined){
        token = token.split(" ")
        token = token[token.length-1]
        token = token.slice(0,-13)
        jwt.verify(token,"123",(err,data)=>{
            var customer_id = req.body.customer_id;
            var all_data = req.body;
            knex('customer')
            .update(all_data)
            .where('customer.customer_id',customer_id)
            .then((data)=>{
                res.send("data updete susesfuly");

            })
            .catch((err)=>{
                res.send(err);
                console.log(err)
            })

    })
}
})


var server = customers.listen('3000',()=>{
    console.log("customers it is working ");
})



