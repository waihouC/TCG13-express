// npm install -g nodemon
// to install node monitor: auto restart server due to changes

const express = require('express');
// to render html
const hbs = require('hbs');

let app = express();

app.set('view engine', 'hbs');

// inform express where to find static files
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('hello');
})

// make sure all routes are defined before starting server
app.listen(3000, ()=>console.log("Server started"))