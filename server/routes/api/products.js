const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const mongodb = require('mongodb');

const router = express.Router();

//Get Products
router.get('/',  async (req,res) => {
    const products = await loadProductsCollection();
    res.send(await products.find({}).toArray());
});



//Add Products
router.post('/', async (req,res) => {
    const products = await loadProductsCollection();
    const { name,description,price,qty} = req.body;

    if (!name || !description || !price || !qty) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        await products.insertOne({
          name,
          description,
          price,
          qty,
          createdAt: new Date(),
        });
        res.status(201).json({ message: 'Product added successfully!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

//Edit Product
router.post('/:id', async(req,res) => {
    const products = await loadProductsCollection();
    const {name,description,price,qty} = req.body;
    try {
         await products.updateOne({_id: new mongodb.ObjectId(req.params.id)},{$set: {name : name, description : description, price : price, qty : qty}})
        res.status(201).json({message: 'Product parameters edited successfully'});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
   
});

//Delete one product
router.delete('/:id', async (req,res) => {
    const products = await loadProductsCollection();
    try{
       await products.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.status(200).json({message: 'Product deleted successfully!'}); 
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
    
})

//Get specific product QTY
router.get('/:id',  async (req,res) => {
    const products = await loadProductsCollection();
    res.send(await products.findOne({_id: new mongodb.ObjectId(req.params.id)},{projection: {qty:1}}));
});

//load products collection object from database
async function loadProductsCollection() {
    const client = await mongodb.MongoClient.connect(process.env.MONGODB_URI);
    return client.db('Warehouse').collection('Products');
}

module.exports = router;