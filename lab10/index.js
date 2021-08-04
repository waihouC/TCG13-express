const express = require('express');
const cors = require('cors');
require('dotenv').config();

const MongoUtil = require('./MongoUtil');
const ObjectId = require('mongodb').ObjectId;
const MongoUri = process.env.MONGO_URI;

let app = express();

// Enable JSON
app.use(express.json())

// Enable Cross Origin Resources Sharing
// NOTE: CORS IS A FUNCTION CALL
app.use(cors())

async function main() {
    // have to conenct to MongoDB before setting routes
    await MongoUtil.connect(MongoUri, 'tcg13_cico');

    // Client will send:
    // {
    //      'description': <desc of food>,
    //      'food': <name of food>,
    //      'location': <location of food>
    // }
    app.post('/free_food_sighting', async function(req, res){
        try {
            let description = req.body.description;
            let food = req.body.food;
            let location = req.body.location;
            let db = MongoUtil.getDB();
            let result = await db.collection('food_sighting').insertOne({
                'description': description,
                'food': food,
                'location': location,
                'datetime': new Date()
            });
            res.status(200);
            res.json({
                'insertedId': result.insertedId
            });
        } catch (e) {
            console.log(e);
            res.status(500);
            res.json({
                'error': e
            })
        }
    })

    app.get('/free_food_sightings', async function(req, res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food_sighting').find({}).toArray();
        res.json(results);
    })

    // use 'put' to indicate update of doc
    app.put('/free_food_sightings/:foodid', async function(req, res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food_sighting').updateOne({
            '_id': ObjectId(req.params.foodid)
        }, {
            '$set': {
                'description': req.body.description,
                'food': req.body.food,
                'datetime': new Date()
            }    
        })
        res.json(results);
    })

    app.delete('/free_food_sightings/:foodid', async function(req, res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food_sighting').deleteOne({
            '_id': ObjectId(req.params.foodid)
        });
        res.json(results);
    })

    // { food: 'lasksa', 'location': 'seminar room'} ==> ?food=laksa&location=seminar%20room
    // free_food_sightings/search?food=laksa
    app.get('/free_food_sightings/search', async function(req, res){
        // declare empty criteria object
        // if the criteria is empty, use .findOne, else return all docs
        let criteria = {};

        // if description key exist in the req.query object
        if (req.query.description) {
            // add key 'description' to criteria object
            criteria['description'] = {$regex: req.query.description, $options:'i'};
        }

        if (req.query.food) {
            criteria['food'] = {$regex: req.query.food, $options:'i'}
        }

        let db = MongoUtil.getDB();
        let results = await db.collection('food_sighting').find({}).toArray();
        res.json(results);
    })
}

main();

app.listen(3000, ()=>console.log("Server started"));