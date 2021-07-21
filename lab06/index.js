const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

// enable forms
app.use(express.urlencoded({
    'extended': false
}))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// define route (.hbs is optional, but name must match)
app.get('/add-food', function(req, res){
    res.render('add_food');
})

// to intercept data from form
app.post('/add-food', function(req,res){
    console.log(req.body);
    let fullname = req.body.fullname;

    // how to handle checkboxes
    // 1. if it is undefined, change it to store an empty array
    // 2. if it is just a single string, convert it to
    // an array containing that single string
    // 3. if it is an array, then leave it as it is

    // Method 1
    // let tags = [];
    // // check if tags is defined
    // if (req.body.tags) {
    //     // check if is array
    //     if (Array.isArray(req.body.tags)) {
    //         tags = req.body.tags;
    //     } else {
    //         // single string
    //         tags = [ req.body.tags ];
    //     }
    // }

    // Method 2
    let tags = req.body.tags || [];
    tags = Array.isArray(tags) ? tags : [ tags ];

    // tags will be an empty array, if req.body.tags is undefined
    // will be an array with just one string inside, if req.body.tags is a string
    // will be an array with more than one string inside, if req.body.tags is an array
    console.log("Selected tag =", tags);

    let cuisine = req.body.cuisine;
    console.log("Selected cuisine is " + cuisine);

    let ingredients = req.body.ingredients || [];
    ingredients = Array.isArray(ingredients) ? ingredients : [ ingredients ];
    console.log("Selected ingredients =", ingredients);

    res.send(`Thank you, ${fullname}`);
})

app.get('/show-number-form', function(req, res){
    res.render('add_numbers');
})

app.post('/show-number-form', function(req, res){
    console.log(req.body);
    let firstnum = req.body.first_number;
    let secondnum = req.body.second_number;
    let operation = req.body.operation;
    //let total = parseInt(firstnum) + parseInt(secondnum);
    let total = 0;
    if (operation == "add") {
        total = parseInt(firstnum) + parseInt(secondnum);
    } else if (operation == "subtract") {
        total = parseInt(firstnum) - parseInt(secondnum);
    } else {
        total = parseInt(firstnum) * parseInt(secondnum);
    }

    // Method 1:
    //res.send("Sum = " + total);

    // Method 2:
    res.render('total', {
        'total': total
    })
})

app.listen(3000, ()=>console.log("Server started"));