const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
          const ReviewsCollection = client.db("TimberKitchen").collection("reviews");
          
          app.get('/services', async(req, res)=>{
               const query ={};
               const cursor = ServicesCollection.find(query);
               const services = await cursor.limit(3).toArray();
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
          app.post("/addService", async (req, res) => {
               const product = req.body;
               const result = await ServicesCollection.insertOne(product);
               res.send(result);
          });

          //Review api's
          app.get('/reviews/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {productId : id};
               const options ={
                    sort: { timestamp: -1 }
               }
               const reviews = await ReviewsCollection.find(query, options).toArray()
               res.send(reviews)
          })
          app.get('/review/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)}
               const review = await ReviewsCollection.findOne(query)
               res.send(review)
          })
          app.post('/addReviews', async(req, res)=>{
               const review = req.body;
               const result = await ReviewsCollection.insertOne(review);
               res.send(result);
          });
          app.get('/myReviews', verifyJWT, async(req, res)=>{
               const decoded = req.decoded;
               if(decoded.email !== req.query.email){
                    return res.status(403).send({message: 'Forbidden access'})
               }

               let query = {};
               if (req.query.email) {
                    query = { email: req.query.email };
               }
               const data = await ReviewsCollection.find(query).toArray();
               res.send(data);
          })
          app.delete("/reviews/:id", async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await ReviewsCollection.deleteOne(query);
               res.send(result);
          });
          app.patch('/review/:id', async(req, res)=>{
               const id = req.params.id;
               const message = req.body.message;
               const query = {_id: ObjectId(id)}
               const updateDoc = {$set: {message: message},};
               const result = await ReviewsCollection.updateOne(query, updateDoc);
               res.send(result)
          })

          //JWT
          app.post('/jwt', (req, res)=>{
               const user = req.body;
               const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
               res.send({token})
          })
          function verifyJWT(req, res, next){
               const authHeader = req.headers.authorization;
               if(!authHeader){
                 return res.status(401).send({message: 'Unauthorized access'})
               }
               const token = authHeader.split(' ')[1];
               jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
                 if(err){
                   return res.status(403).send({message: 'Forbidden access'})
                 }
                 req.decoded = decoded;
                 next()
               })
             }
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