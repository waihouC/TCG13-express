// from install
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
// from local
const MongoUtil = require('./MongoUtil');
const ObjectId = require('mongodb').ObjectId;

// setup environmental variables to store the mongo connection string
require('dotenv').config();

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(express.urlencoded({
    'extended': false
}))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

const helpers = require('handlebars-helpers');
helpers({
    'handlebars': hbs.handlebars
})

async function main() {
    // have to conenct to MongoDB before setting routes
    await MongoUtil.connect(process.env.MONGO_URI, 'tcg13_cico');

    // set routes
    app.get('/', function(req, res){
        res.send('Hello World');
    });

    app.get('/food_record', async function(req, res){
        // 1. Get all food records from DB
        let db = MongoUtil.getDB();
        // project: allow you to select the fields to display
        // else can remove to show everything
        let foodRecords = await db.collection('food').find({}).project({
            'foodName': 1,
            'calories': 1,
            'tags':1
        }).toArray();
        res.render('food', {
            'foodRecords': foodRecords
        })
    });

    app.get('/food_record/create', function(req, res){
        res.render('add_food');
    });

    app.post('/food_record/create', function (req, res){
        let foodName = req.body.foodName;
        let calories = req.body.calories;
        let tags = req.body.tags;
        // check if tags is undefined, change it to an empty array
        if (!tags) {
            tags = [];
        } else if (!Array.isArray(tags)) {
            // if tags is a single string,
            // change it into an array with that string as
            // the only element
            tags = [tags];
        }

        // insert into the Mongo DB
        // get an instance of the database client
        let db = MongoUtil.getDB();
        db.collection('food').insertOne({
            'foodName': foodName,
            'calories': calories,
            'tags': tags
        })
        res.redirect('/food_record')
    });

    app.get('/food_record/:id/update', async function(req,res){
        let id = req.params.id;
        // find the doucment we want to update
        let db = MongoUtil.getDB();
        let foodRecord = await db.collection('food').findOne({
            '_id': ObjectId(id)
        })

        res.render('edit_food', {
            'foodRecord' : foodRecord
        })
    });

    app.post('/food_record/:id/update', async function(req,res){
        let id = req.params.id;
        let foodName = req.body.foodName;
        let calories = req.body.calories;
        let tags = req.body.tags;

        if (!tags) {
            tags = [];
        } else if (Array.isArray(tags)) {
            tags = [tags];
        }

        let db = MongoUtil.getDB();
        db.collection('food').updateOne({
            '_id': ObjectId(id)
        },{
            '$set':{
                'foodName': foodName,
                'calories':calories,
                'tags': tags
            }
        })
        res.redirect('/food_record');
    });

    app.get('/food_record/:id/delete', async function(req, res){
        // retrieve the food record to delete
        let id = req.params.id;
        let db = MongoUtil.getDB();
        let foodRecord = await db.collection('food').findOne({
            '_id':ObjectId(id)
        })
        res.render('delete_food', {
            foodRecord
        })
    });

    app.post('/food_record/:id/delete', async function(req, res){
        let id = req.params.id;
        let db = MongoUtil.getDB();
        await db.collection('food').deleteOne({
            '_id':ObjectId(id)
        })
        res.redirect('/food_record');
    });
}

main();

// connect to MongoDB before setting route
app.listen(3000, ()=>console.log("Server started"));

