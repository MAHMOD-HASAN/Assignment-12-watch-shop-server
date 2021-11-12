// import all packages
const express = require('express');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfgcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run () {
    try {
        await client.connect();
        const database = client.db('WatchShop');
        const productCollection = database.collection('watches');
        const userCollection = database.collection('users');

        // products send database by post api
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result);
        })

        // products get with get api
        app.get('/product', async (req, res) => {
            const product = productCollection.find({});
            const result = await product.toArray();
            res.send(result);
        })

        // get singel product with get api
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.json(product);
        })


        // user related post and get api
        // send user on database
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('watch shop server is ok');
})

app.listen(port, () => {
    console.log('port is running on', port);
})