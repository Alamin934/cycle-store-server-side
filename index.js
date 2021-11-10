const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wpmdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send(`<h1 style="text-align:center">BiCycle Shop</h1>`)
});

async function run() {
    try {
        await client.connect();
        const database = client.db("biCycle_shop");
        const biCyclesCollection = database.collection("biCycles");
        const OrdersCollection = database.collection("orders");


        // //All Plans Get API
        // app.get('/allPlans', async (req, res) => {
        //     const cursor = tourPlansCollection.find({});
        //     const allPlans = await cursor.toArray();
        //     res.send(allPlans);
        // });
        // // Post API
        // app.post('/addTourPlans', async (req, res) => {
        //     const plan = req.body;
        //     const result = await tourPlansCollection.insertOne(plan);
        //     res.json(result);
        // });
        // //Get Single Plan id API
        // app.get('/allPlans/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await tourPlansCollection.findOne(query);
        //     res.json(result);
        // });
        // //All User Plans Get Api
        // app.get('/userPlans', async (req, res) => {
        //     const cursor = userPlansCollection.find({});
        //     const result = await cursor.toArray();
        //     res.send(result);
        // });
        // //User Plans Post API
        // app.post('/userPlans', async (req, res) => {
        //     const userPlan = req.body;
        //     const result = await userPlansCollection.insertOne(userPlan);
        //     res.json(result);
        // });
        // //Get single User Plans By email
        // app.get('/myPlans/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const cursor = userPlansCollection.find({ email });
        //     const result = await cursor.toArray();
        //     res.json(result);
        // });
        // //Delete/Cancel My Plans
        // app.delete('/myPlans/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await userPlansCollection.deleteOne(query);
        //     res.json(result);
        // });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server Running port at ${port}`)
});