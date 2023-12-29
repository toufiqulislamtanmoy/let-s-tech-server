const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Learning Is Downloading")
})




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vtt9h1d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollections = client.db("language-learning").collection("users");
    const langCollections = client.db("language-learning").collection("languages");

    /********Create user*******/
    app.post("/users", async (req, res) => {
      const userDetails = req.body;
      const query = { email: userDetails.email };
      const existingUser = await userCollections.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exist" });
      }
      const result = await userCollections.insertOne(userDetails);
      res.send(result);
    })

    app.get("/allUsers", async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);

    })

    /********Find The user Role*******/

    app.get('/role/:email', async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email }
      const options = {
        projection: { role: 1 },
      };
      const result = await userCollections.findOne(query, options);
      res.send(result);

    })

    /********Create Language*******/
    app.post("/addLang", async (req, res) => {
      const langDetails = req.body;
      const query = { langName: langDetails.langName };
      const existingUser = await langCollections.findOne(query);
      if (existingUser) {
        return res.send({ message: "You Already Added" });
      }
      const result = await langCollections.insertOne(langDetails);
      res.send(result);
    })
    app.get("/dispLang", async (req, res) => {
      const result = await langCollections.find().toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})