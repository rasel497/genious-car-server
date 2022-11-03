const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const servicCollection = client.db('geniousCar').collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
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