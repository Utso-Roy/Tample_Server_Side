require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const { ObjectId } = require('mongodb');
//Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db('TampleData');
      const collection = database.collection('addIncomeData');
    const collection2 = database.collection('uttarParaData')
    const  collection3 = database.collection('uploadFiles')

    //  POST: Add Income
    app.post('/addIncomeData', async (req, res) => {
      const user = req.body;
      const result = await collection.insertOne(user);

      if (result.insertedId) {
        res.send({ suc: true, insertedData: { ...user, _id: result.insertedId } });
      } else {
        res.send({ suc: false });
      }
    });
      
      app.post('/uttarPara', async (req, res) => {
        const donation = req.body;
  try {
    const result = await collection2.insertOne(donation);
    if (result.insertedId) {
      res.send({ success: true, insertedId: result.insertedId });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

      // GET all UttarPara Data
app.get('/uttarPara', async (req, res) => {
  try {
    const data = await collection2.find({}).toArray();
    res.send({ success: true, data });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch' });
  }
});
      
      
      
      
      
      
      //delete UttarPara Data

      
      app.delete('/uttarPara/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await collection2.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.send({ success: true });
    } else {
     res.send({ success: true, insertedId: result.insertedId });

    }
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error' });
  }
});
      
      
    
    
    //Post : upload Files 
    app.post('/upLoadFile', async (req, res) => {
      const fileData = req.body
      console.log(fileData)

      try {
        const result = await collection3.insertOne(fileData)
        if (result.insertedId) {
          res.send({ success: true, insertedId: result.insertedId })
          
        }
      }
      catch (err) {
        
      res.status(500).send({success:false})
      }
    })
      

    //uploadFile Delete 
    
    app.delete("/upLoadFile/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await collection3.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Data deleted successfully." });
    } else {
      res.status(404).send({ success: false, message: "No matching document found." });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});



    //get upload files

  app.get('/upLoadFile', async (req, res) => {
  try {
    const result = await collection3.find().toArray();
    res.send({ success: true, data: result });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch data' });
  }
});




      
      //Delete addInocme Data
app.delete('/addIncomeData/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  const query = { _id: new ObjectId(id) };
  const result = await collection.deleteOne(query);

  if (result.deletedCount > 0) {
    res.send({ success: true, message: 'Data deleted successfully' });
  } else {
    res.send({ success: false, message: 'No data found with this ID' });
  }
});

    //  GET: Get All Income
    app.get('/addIncomeData', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.send({ suc: true, data });
      } catch (err) {
        res.send({ suc: false, error: err.message });
      }
    });

    console.log(" MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed", error);
  }
}

run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
  res.send(' Server is running and MongoDB is connected!');
});

// Start Server
app.listen(port, () => {
  console.log(` Server listening on port ${port}`);
});
