const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 4200


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccovq.mongodb.net/ema-john-with-auth-remastered-server?retryWrites=true&w=majority`;

console.log(process.env.DB_USER)


app.get('/', (req, res) => {
    res.send('Hello Rahul Mohonto!')
})

app.listen(port, () => {
    console.log(` server connected to 4200 port successfully`)
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("ema-john-with-auth-remastered-server").collection("products");

    app.post('/addProduct', (req, res) => {
        const products = req.body

        productsCollection.insertMany(products)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res,) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res,) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body
        productsCollection.find({ key: { $in: productKeys } })
        toArray((err, documents) => {
            res.send(documents);
        })
    })

});