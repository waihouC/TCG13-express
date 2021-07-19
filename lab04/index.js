const express = require('express');
// to render html
const hbs = require('hbs');
const wax = require('wax-on');

let app = express();

app.set('view engine', 'hbs');

// inform express where to find static files
app.use(express.static('public'));

// setup Wax On (templates for HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.get('/', function(req, res){
    res.render('hello');
})

app.get('/contact-us', function(req, res){
    res.render('contact');
})

// make sure all routes are defined before starting server
app.listen(3000, ()=>console.log("Server started"))