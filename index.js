const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();

// midleware
app.use(cors());
app.use(express.json());


// from Mongobd  database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mpr3cem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // 01.from >Find Multiple Document [this section for show all data client side UI]
        const servicCollection = client.db('geniousCar').collection('services');
        const orderCollection = client.db('geniousCar').collection('order');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // 02.from >Find Document [this section for specefic data load to show client side UI click bttn show specefic checkout data]
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicCollection.findOne(query);
            res.send(service);
        });

        // 03.order api >Insert Operation [using post for create data]
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(err => console.error(err));


// initial setup
app.get('/', (req, res) => {
    res.send('genious car server is running');
})

app.listen(port, () => {
    console.log(`Genious car server is running port: ${port}`);
})