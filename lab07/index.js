const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios');

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(express.urlencoded({
    'extended': false
}))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// set route
// READ
app.get('/pets', async function(req, res) {
    let response = await axios.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');  // async function to await
    res.render('pets', {
        'pets': response.data
    });
})

// CREATE
// display form
app.get('/pets/create', function(req,res) {
    res.render('create_pet');
})

// process form
app.post('/pets/create', async function(req,res) {
    console.log(req.body);
    let newPet = {
        "id": Math.floor(Math.random() * 1000000 + 10000),
        "category": {
          "id": Math.floor(Math.random() * 1000000 + 10000),
          "name": req.body.category
        },
        "name": req.body.name,
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": req.body.status
      }
    await axios.post('https://petstore.swagger.io/v2/pet', newPet);
    res.redirect('/pets');
})

// UPDATE
// Step 1: retrieve the info of the pet that the user
// wants to update and display in the form
app.get('/pets/:petID/update', async function(req, res) {
    let petID = req.params.petID;
    // get the info of the record that we want to update
    let response = await axios.get('https://petstore.swagger.io/v2/pet/' + petID);
    // display the info of the record in the form
    res.render('edit_pet', {
        'pet': response.data
    })
})

// Step 2: update the pet base on the user's input
app.post('/pets/:petID/update', async function(req,res) {
  console.log(req.body);
  let petID = req.params.petID
  let pet = {
      "id": petID,
      "category": {
        "id": 1,
        "name": req.body.category
      },
      "name": req.body.name,
      "photoUrls": [
        "string"
      ],
      "tags": [
        {
          "id": 0,
          "name": "string"
        }
      ],
      "status": req.body.status
    }
  // write the changes back to DB
  await axios.put('https://petstore.swagger.io/v2/pet', pet);
  res.redirect('/pets');
})

// DELETE
app.get('/pets/:petID/delete', async function(req,res) {
  let petID = req.params.petID;
  let response = await axios.get('https://petstore.swagger.io/v2/pet/' + petID);
  res.render('confirm_delete', {
      'pet': response.data
  })
})

app.post('/pets/:petID/delete', async function(req,res) {
  let petID = req.params.petID;
  // delete the record
  await axios.delete('https://petstore.swagger.io/v2/pet/' + petID);
  res.redirect('/pets');
})

app.listen(3000, ()=>console.log("Server started"));