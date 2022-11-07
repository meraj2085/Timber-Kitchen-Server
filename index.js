const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//All middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
          const ServicesCollection = client.db("TimberKitchen").collection("test");
          const user = {name: 'Meraj', age: 20, email: 'meraj123@gmail.com'}
          const result = await ServicesCollection.insertOne(user)
          console.log(result);
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