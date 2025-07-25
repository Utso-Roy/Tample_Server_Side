require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("TampleData");
    const collection = database.collection("addIncomeData");
    const collection2 = database.collection("uttarParaData");
    const collection3 = database.collection("uploadFiles");
    const majhaparaCollection = database.collection("majhaparaCollection");
    const dokkhiparaCollection = database.collection("dokkhinparaCollection");
    const riceCollection = database.collection("rice-collections");
    const outCollection = database.collection("outCollection");
    const expenseCollection = database.collection("expenseCollection");
    const pujaExpenseCollection = database.collection("pujaExpenseCollection");
    const currentBillCollection = database.collection("currentBillCollection");
    const prosadCollection = database.collection("prosadCollection");
    const otherBillsCollection = database.collection("otherBillsCollection");
    const decorationBillsCollection = database.collection("decorationBillsCollection");
    const khoriBillsCollection = database.collection("KhoriBillsCollection");
    const addEventCollection = database.collection('addEventCollection')

  app.post("/addIncomeData", async (req, res) => {
  const user = req.body;
  const result = await collection.insertOne(user);

  if (result.insertedId) {
    const insertedData = { _id: result.insertedId, ...user };
    res.send({ suc: true, insertedId: result.insertedId, insertedData });
  } else {
    res.send({ suc: false });
  }
  });
    
    //total add Income
    
app.get('/totalAddIncome', async (req, res) => {
  try {
    const result = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalTk: { $sum: "$amount" }
        }
      }
    ]).toArray();

    const totalTk = result[0]?.totalTk || 0;
    res.send({ totalTk });  // send as object for frontend clarity
  } catch (error) {
    console.error("Error in /totalAddIncome:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



    app.get("/addIncomeData", async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.send({ suc: true, data });
      } catch (err) {
        res.send({ suc: false, error: err.message });
      }
    });

    app.delete("/addIncomeData/:id", async (req, res) => {
      const id = req.params.id;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: result.deletedCount > 0 });
    });

    //  UttarPara API

    app.post("/uttarPara", async (req, res) => {
      const donation = req.body;
      console.log(donation);
      const result = await collection2.insertOne(donation);
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.get("/uttarPara", async (req, res) => {
      const data = await collection2.find({}).toArray();
      res.send({ success: true, data });
    });

   









    // uttarPara total tk

    app.get("/uttarPara/totalTk", async (req, res) => {
      const result = await collection2
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: { $sum: "$tk" },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    //Delete method

    app.delete("/uttarPara/:id", async (req, res) => {
      const id = req.params.id;
      const result = await collection2.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: result.deletedCount > 0 });
    });

    //outside collection

    app.get("/out-collections", async (req, res) => {
      const data = await outCollection.find().sort({ date: -1 }).toArray();
      res.send(data);
    });

    //outCollection Total tk

    app.get("/outCollectionTk", async (req, res) => {
      const result = await outCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    // POST new
    app.post("/out-collections", async (req, res) => {
      const doc = req.body;
      const result = await outCollection.insertOne(doc);
      res.send({ ...doc, _id: result.insertedId });
    });

    // DELETE
    app.delete("/out-collections/:id", async (req, res) => {
      const id = req.params.id;
      const result = await outCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //prosad collection

    app.get("/prosad-bills", async (req, res) => {
      const data = await prosadCollection.find().sort({ date: -1 }).toArray();
      res.send(data);
    });

    //total prosad bills

    app.get("/totalParosadBills", async (req, res) => {
      const result = await prosadCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: { $sum: "$tk" },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    // POST new
    app.post("/prosad-bills", async (req, res) => {
      const doc = req.body;
      const result = await prosadCollection.insertOne(doc);
      res.send({ ...doc, _id: result.insertedId });
    });

    // DELETE
    app.delete("/prosad-bills/:id", async (req, res) => {
      const id = req.params.id;
      const result = await prosadCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //add event

    app.post('/addEvent', async (req, res) => {
      const event = req.body
      try {
        const result = await addEventCollection.insertOne(event)
        res.send({ success: true, insertedId: result.insertedId })
      }
      catch (error) {
            res.status(500).send({ success: false, message: "Database error" });
      }
      
    })


    




    //add event get

    app.get('/addEvent', async (req, res) => {
      const result = await addEventCollection.find({}).toArray()
      res.send(result)
    })
    

    // delete event

    app.delete("/addEvent/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await addEventCollection.deleteOne(query);
  res.send(result);
});

    //all expense total collection

    
    const getTotalTkFromCollections = async () => {
  const pujaTotal = await pujaExpenseCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  const currentTotal = await currentBillCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  const prosadTotal = await prosadCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  const otherTotal = await otherBillsCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  const decorationTotal = await decorationBillsCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  const khoriTotal = await khoriBillsCollection.aggregate([
    { $group: { _id: null, total: { $sum: "$tk" } } },
  ]).toArray();

  // Total sum from all collections
  const grandTotal =
    (pujaTotal[0]?.total || 0) +
    (currentTotal[0]?.total || 0) +
    (prosadTotal[0]?.total || 0) +
    (otherTotal[0]?.total || 0) +
    (decorationTotal[0]?.total || 0) +
    (khoriTotal[0]?.total || 0);

  return grandTotal;
};

    app.get("/totalExpenseAllBills", async (req, res) => {
  try {
    const total = await getTotalTkFromCollections();
    res.send({ totalTk: total });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

    
    // total add expense income
    
 app.get('/totalExpenseIncome', async (req, res) => {
  try {
    const result = await expenseCollection.aggregate([
      {
        $addFields: {
          numberAsNumber: { $toDouble: "$number" } 
        }
      },
      {
        $group: {
          _id: null,
          totalTk: { $sum: "$numberAsNumber" }
        }
      }
    ]).toArray();

    const totalTk = result[0]?.totalTk || 0;
    res.send({ totalTk });
  } catch (error) {
    console.error("Error in /totalExpenseIncome:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



    // total rice collection
    
    app.get('/totalRiceCollection', async (req, res) => {
      const result = await riceCollection.aggregate([
        {
          $group: {
            _id: null,
            totalRice : {$sum : "$kg"}
          }
        }
      ]).toArray()
      const totalRiceIncome = result[0]?.totalRice || 0;
      res.send({totalRiceIncome})
    })







    


    //KhoriBills collection

    // CREATE
    app.post("/khori-bills", async (req, res) => {
      const doc = req.body;
      const result = await khoriBillsCollection.insertOne(doc);
      res.send({ ...doc, _id: result.insertedId });
    });

    // get
    app.get("/khori-bills", async (req, res) => {
      const data = await khoriBillsCollection.find().toArray();
      res.send(data);
    });

    app.get("/totalKhoriBills", async (req, res) => {
      const result = await khoriBillsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();

      res.send(result);
    });

    //  DELETE
    app.delete("/khori-bills/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ObjectId" });
      }

      try {
        const result = await khoriBillsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "No document found to delete" });
        }

        res.send({ success: true, result });
      } catch (err) {
        console.error(" Delete error:", err);
        res.status(500).send({ error: "Server error" });
      }
    });

    //others_bills

    app.get("/other-bills", async (req, res) => {
      const result = await otherBillsCollection.find().toArray();
      res.send(result);
    });

    //total other bills
    app.get("/totalOtherBills", async (req, res) => {
      const result = await otherBillsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    app.post("/other-bills", async (req, res) => {
      const bill = { ...req.body, category: "other" };
      const result = await otherBillsCollection.insertOne(bill);
      res.send({ insertedId: result.insertedId });
    });

    app.delete("/other-bills/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await otherBillsCollection.deleteOne({ _id: id });
      res.send(result);
    });

    //Decoration_bills

    app.get("/decoration-bills", async (req, res) => {
      const result = await decorationBillsCollection.find().toArray();
      res.send(result);
    });

    //total Decoration bills

    app.get("/totalDecorationBills", async (req, res) => {
      const result = await decorationBillsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    app.post("/decoration-bills", async (req, res) => {
      const bill = { ...req.body, category: "other" };
      const result = await decorationBillsCollection.insertOne(bill);
      res.send({ insertedId: result.insertedId });
    });

    app.delete("/decoration-bills/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await decorationBillsCollection.deleteOne({ _id: id });
      res.send(result);
    });

    // GET all rice collections
    app.get("/rice-collections", async (req, res) => {
      try {
        const data = await riceCollection.find({}).sort({ date: -1 }).toArray();
        res.json(data);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch data", error: err });
      }
    });

    // POST new rice collection
    app.post("/rice-collections", async (req, res) => {
      try {
        const { name, kg, date } = req.body;
        if (!name || !kg || !date) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const newEntry = { name, kg, date };
        const result = await riceCollection.insertOne(newEntry);
        res.json({ ...newEntry, _id: result.insertedId });
      } catch (err) {
        res.status(500).json({ message: "Failed to add data", error: err });
      }
    });

    // DELETE rice collection by ID
    app.delete("/rice-collections/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await riceCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully" });
      } catch (err) {
        res.status(500).json({ message: "Failed to delete data", error: err });
      }
    });

    //expense add

    app.get("/expenses", async (req, res) => {
      const data = await expenseCollection.find().sort({ _id: -1 }).toArray();
      res.send(data);
    });

    // POST a new expense
    app.post("/expenses", async (req, res) => {
      const expense = req.body;
      const result = await expenseCollection.insertOne(expense);
      res.send(result);
    });

    // DELETE an expense
    app.delete("/expenses/:id", async (req, res) => {
      const id = req.params.id;
      const result = await expenseCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // GET route
    app.get("/puja-expenses", async (req, res) => {
      const data = await pujaExpenseCollection
        .find({ category: "puja" })
        .toArray();
      res.send(data);
    });

    //total puja expense

    app.get("/totalPujaExpense", async (req, res) => {
      const result = await pujaExpenseCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    // POST route
    app.post("/puja-expenses", async (req, res) => {
      const result = await pujaExpenseCollection.insertOne({
        ...req.body,
        category: "puja",
      });
      res.send({ insertedId: result.insertedId });
    });

    // DELETE route
    app.delete("/puja-expenses/:id", async (req, res) => {
      const id = req.params.id;
      await pujaExpenseCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ deleted: true });
    });

    // GET route
    app.get("/current-bills", async (req, res) => {
      const data = await currentBillCollection
        .find({ category: "puja" })
        .toArray();
      res.send(data);
    });

    //total currents bills

    app.get("/totalCurrentsBills", async (req, res) => {
      const result = await currentBillCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    // POST route
    app.post("/current-bills", async (req, res) => {
      const result = await currentBillCollection.insertOne({
        ...req.body,
        category: "puja",
      });
      res.send({ insertedId: result.insertedId });
    });

    // DELETE route
    app.delete("/current-bills/:id", async (req, res) => {
      const id = req.params.id;
      await currentBillCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ deleted: true });
    });

    // server.js or donations.routes.js
    app.get("/dokkhin-donations", async (req, res) => {
      const donations = await dokkhiparaCollection.find().toArray();
      res.send(donations);
    });
    //total tk

    app.get("/dokkhinParaTotalTk", async (req, res) => {
      const result = await dokkhiparaCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: { $sum: "$tk" },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    app.post("/dokkhin-donations", async (req, res) => {
      const result = await dokkhiparaCollection.insertOne(req.body);
      res.send({ insertedId: result.insertedId });
    });

    app.delete("/dokkhin-donations/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await dokkhiparaCollection.deleteOne({ _id: id });
      res.send(result);
    });

    //  majhapara Donations
    app.post("/donations", async (req, res) => {
      try {
        const donation = req.body;
        const result = await majhaparaCollection.insertOne(donation);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/donations", async (req, res) => {
      try {
        const donations = await majhaparaCollection.find().toArray();
        res.json(donations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/majhaParaTotalTk", async (req, res) => {
      const result = await majhaparaCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalTk: {
                $sum: "$tk",
              },
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    // Delete a donation by ID
    app.delete("/donations/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await majhaparaCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 1) {
          res.json({ success: true });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Donation not found" });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // File Upload APIs
    app.post("/upLoadFile", async (req, res) => {
      const fileData = req.body;
      const result = await collection3.insertOne(fileData);
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.get("/upLoadFile", async (req, res) => {
      const result = await collection3.find().toArray();
      res.send({ success: true, data: result });
    });

    app.delete("/upLoadFile/:id", async (req, res) => {
      const id = req.params.id;
      const result = await collection3.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: result.deletedCount > 0 });
    });

    app.listen(port, () => {
      console.log(` Server is running on http://localhost:${port}`);
    });

    console.log(" MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed", error);
  }
}

run();

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running and MongoDB is connected!");
});
