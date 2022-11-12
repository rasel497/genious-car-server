const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());


// from Mongobd  database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mpr3cem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//  verify token generate
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized acess' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })

}

async function run() {
    try {
        // 01.from >Find Multiple Document [this section for show all data client side UI]
        const servicCollection = client.db('geniousCar').collection('services');
        const orderCollection = client.db('geniousCar').collection('order');

        // for using token whwn user login or sign up
        app.post('/jwt', (req, res) => {
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        });

        // Read for load all db to load client UI
        app.get('/services', async (req, res) => {
            const search = req.query.search;
            console.log(search)
            let query = {};
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }
            };
            // const query = { price: { $gt: 100 } };
            // const query = { price: { $lt: 200 } };
            // const query = { price: { $ne: 30 } }
            // const query = { price: { $in: [200, 150] } }
            // const query = { price: { $nin: [310, 200] } }
            const order = req.query.order === 'asc' ? 1 : -1;
            const cursor = servicCollection.find(query).sort({ price: order });
            const services = await cursor.toArray();
            res.send(services);
        });

        // 02.from >Find Document [this section for specefic data load to show client side UI click bttn show specefic checkout data]
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicCollection.findOne(query);
            res.send(service);
        });

        // 3.1.Get orders aapi [protita email user koyta order dise ta ber korer jonno Line:41-51]
        app.get('/orders', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            // console.log('inside orders api', decoded);
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'unauthorized access' })
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // 03.create order api >Insert Operation [using post for create data]
        app.post('/orders', verifyJWT, async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // for >Update a Document [add verifyJWT mane token na thke update korte dibo na]
        app.patch('/orders/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // Delete orders by id >Delete a Document [add verifyJWT mane token na thke delete korte dibo na]
        app.delete('/orders/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
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
});

app.listen(port, () => {
    console.log(`Genious car server is running port: ${port}`);
});