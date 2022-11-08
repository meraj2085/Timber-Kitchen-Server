const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//All middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
          const ServicesCollection = client.db("TimberKitchen").collection("services");
          
          app.get('/services', async(req, res)=>{
               const query ={};
               const cursor = ServicesCollection.find(query);
               const services = await cursor.skip(3).toArray();
               res.send(services)
          })
          app.get('/allServices', async(req, res)=>{
               const query ={};
               const cursor = ServicesCollection.find(query);
               const services = await cursor.toArray();
               res.send(services)
          })
          app.get('/services/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)}
               const service = await ServicesCollection.findOne(query);
               res.send(service)
          })
     }
     finally{}
}
run().catch((err) => console.log(err));

app.get('/', (req, res)=>{
     res.send('Timber kitchen server is running...')
})

app.listen(port, ()=>{
     console.log(`Server is running on port ${port}`);
})