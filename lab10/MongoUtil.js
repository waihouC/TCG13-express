const MongoClient = require('mongodb').MongoClient;

// global variable is to store the database
let _db;

async function connect(url, dbname) {
    let client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    console.log("Database connected");
}

function getDB() {
    return _db;
}

// allow other JS files to use 'connect' and 'getDB' functions
module.exports = {
    connect, getDB
}