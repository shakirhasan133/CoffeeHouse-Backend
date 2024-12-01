const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//Midleware

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ege5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("CoffeeDB");
    const CoffeeData = database.collection("Coffees");

    app.get("/products", async (req, res) => {
      const cursor = CoffeeData.find();
      const data = await cursor.toArray();
      res.send(data);
    });

    app.get("/product-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CoffeeData.findOne(query);
      res.send(result);
    });
    app.get("/edit-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CoffeeData.findOne(query);
      res.send(result);
    });

    app.put("/edit-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: req.body,
      };

      const updateRes = await CoffeeData.updateOne(query, updateDoc, option);
      console.log(updateRes);

      res.send(updateRes);
    });

    app.delete("/delete/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await CoffeeData.deleteOne(filter);
        console.log("Data Delete Successfully");
        res.send(result);
      } catch (error) {
        res.send("Something went wrong");
      }
    });

    app.post("/addCoffees", async (req, res) => {
      const coffees = req.body;
      try {
        const data = await CoffeeData.insertOne(coffees);
        res.send(data);
      } catch (error) {
        res.send(error);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.listen(port, () => {
  console.log(`The servicer is runnin on : ${port}`);
});
