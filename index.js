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
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');

        // products post on database 
        // products get and show in UI

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
                // FINISH FIRST STEP
//==================================================================================



          
        // set user information on database
        // get user information and set to UI

        // POST user information to database
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })

        // GET all user from database
        app.get('/alluser', async (req, res) => {
            const user = userCollection.find({});
            const result = await user.toArray();
            res.send(result);
        })

        // (UPSERT) if user exist than update nor insert 
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = {email : user.email};
            const option = {upsert : true};
            const update = {$set : user};
            const result = await userCollection.updateOne(filter, update, option);
            res.json(result);
        })

        // DELETE user with uniqe id
        app.delete('/alluser/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.json(result);
        })

        // (UPDATE) make admin an user
        app.put('/user/admin', async (req, res) => {
            const user = req.body;
            const filter = {email : user.email};
            const updateDoc = {$set : {role : 'admin'}};
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // (GET) check the exist user - admin or not
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email : email};
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({admin : isAdmin})
        })
                 // FINISH SECOND STEP
//===================================================================================




        // user order send and get and show on UI

        // (POST) send user order on database
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // (GET) get a perticuler user order from database
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = {email : email};
            const order = orderCollection.find(query);         
            const result = await order.toArray();
            res.json(result);
        })

        // (DELETE) normal user can delete these order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        // (GET) get all order from database
        app.get('/order/all', async (req, res) => {
            const order = orderCollection.find({});
            const result = await order.toArray();
            res.send(result);
        })

        // (DELETE) admin can delete these order
        app.delete('/order/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
                      // FINISH THIRE STEP
//==================================================================================


        // user review post on database
        app.post('/review', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        // get all feedback and show UI
        app.get('/review', async (req, res) => {
            const review = reviewCollection.find({});
            const result = await review.toArray();
            res.send(result);
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