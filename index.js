const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogrrwih.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send(`<h1 style="text-align:center">BiCycle Shop</h1>`)
});

async function run() {
    try {
        await client.connect();
        const database = client.db("biCycle_shop");
        const biCyclesCollection = database.collection("biCycles");
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection("users");


        // //All Plans Get API
        app.get('/allBiCycles', async (req, res) => {
            const allBiCycles = await biCyclesCollection.find({}).toArray();
            res.send(allBiCycles);
        });
        // Post API
        app.post('/allBiCycles', async (req, res) => {
            const biCycle = req.body;
            const result = await biCyclesCollection.insertOne(biCycle);
            res.json(result);
        });
        //Get Single BiCycle id API
        app.get('/allBiCycles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await biCyclesCollection.findOne(query);
            res.json(result);
        });
        //All Orders Get Api
        app.get('/orders', async (req, res) => {
            const orders = await ordersCollection.find({}).toArray();
            res.send(orders);
        });
        //Orders Post API
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result);
        });
        //Get User Orders By email
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await ordersCollection.find({ email }).toArray();
            res.json(result);
        });
        //Review Post API
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        //Get User Review API
        app.get('/review', async (req, res) => {
            const orders = await reviewCollection.find({}).toArray();
            res.send(orders);
        });
        //Get Admin Email Api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //Users Post API
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.json(result);
        });
        //Users update
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //Users Admin update
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user?.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        //Update status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: { status: updateStatus }
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        //Delete/Cancel from AllOrders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });
        //Delete/Cancel from AllBiCycles/Product
        app.delete('/allBiCycles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await biCyclesCollection.deleteOne(query);
            res.json(result);
        });

    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server Running port at ${port}`)
});