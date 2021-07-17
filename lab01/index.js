// import package
const express = require('express');
const hbs = require('hbs'); 

// create an Express app
let app = express();

// set up view engine
app.set('view engine', 'hbs');

// add routes here
// a route associates a url with a function
// req => request, res => response
app.get('/', function(req,res){
    res.send("<h1>Hello from Express</h1>");
})

app.get('/about-us', function(req,res){
    res.send("<h1>About Us</h1>");
})

// :<name> defines a placeholder
app.get('/greet/:fullname', function(req,res){
    let fullname = req.params.fullname;
    res.send(`<h1>Hello ${fullname}!</h1>`);
})

app.get('/contact-us', function(req, res){
    res.render('contact-us.hbs');
})

app.get('/luckynumber', function(req,res){
    let luckynumber = Math.floor(Math.random() * 100 + 1);
    res.render('lucky', {
        'number': luckynumber
    })
})

app.listen(3000, ()=>{
    console.log("Server started")
})
