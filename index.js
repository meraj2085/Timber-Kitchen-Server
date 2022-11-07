const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
port = process.env.PORT || 5000;

//All middleware
app.use(cors());
app.use(express.json());

// async function run(){
     
// }
// run()

app.get('/', (req, res)=>{
     res.send('Timber kitchen server is running...')
})

app.listen(port, ()=>{
     console.log(`Server is running on port ${port}`);
})