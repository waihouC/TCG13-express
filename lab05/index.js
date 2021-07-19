const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

let app = express();

app.set('view engine', 'hbs');

// inform express where to find static files
app.use(express.static('public'));

// setup Wax On (templates for HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// register own helper for ifEquals
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options){
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
})

app.get('/', function(req, res){
    res.render('hello');
})

app.get('/contact-us', function(req, res){
    res.render('contact');
})

app.get('/fruits', function(req, res){
    let fruits = ['apples', 'bananas', 'oranges', 'cherries'];
    let isRaining = true;
    let favourite = 'apples'
    res.render('fruits', {
        'fruits': fruits,
        'raining': isRaining,
        'favourite': favourite
    })
})

// make sure all routes are defined before starting server
app.listen(3000, ()=>console.log("Server started"))