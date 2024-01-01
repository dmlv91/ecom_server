const express = require('express');
const mongodb = require('mongodb');
// const dotenv = require("dotenv");
// dotenv.config();
// const path = require("path");
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

//Get Products
router.get('/',  async (req,res) => {
    const products = await loadProductsCollection();
    res.send(await products.find({}).toArray());
});



//Add Products

router.post('/', async (req,res) => {
    const products = await loadProductsCollection();
    await products.insertOne({
        name: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});

//Edit Product
router.post('/:id', async(req,res) => {
    const products = await loadProductsCollection();
    await products.updateOne({_id: new mongodb.ObjectId(req.params.id)},{$set: {name : req.body.text}})
    res.status(201).send();
});

//Delete products

router.delete('/:id', async (req,res) => {
    const products = await loadProductsCollection();
    await products.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
    res.status(200).send();
})

async function loadProductsCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://test:eXtD9ei9xUeKqU8v@cluster0.zoteutk.mongodb.net/');

    return client.db('Warehouse').collection('Products');
}

module.exports = router;