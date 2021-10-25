const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// user: crudDatabase1
// password: ObgTBXA3A2Oavgif

// mongodb connection
const uri =
  'mongodb+srv://crudDatabase1:ObgTBXA3A2Oavgif@cluster0.qhwc1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('userInformation');
    const usersCollections = database.collection('users');

    //Get api
    app.get('/users', async (req, res) => {
      // const users = res.body;
      const cusor = usersCollections.find({});
      const users = await cusor.toArray();
      res.send(users);
    });

    // get single users

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      // console.log('~ id', id);
      const query = { _id: ObjectId(id) };
      const user = await usersCollections.findOne(query);
      // console.log('load user with id', id);
      res.send(user);
    });

    // update user api
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedUser = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollections.updateOne(
        query,
        updateDoc,
        options
      );
      console.log('~ result', result);
      res.json(result);
    });

    // post API
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      // console.log('hitting the post', newUser);
      const result = await usersCollections.insertOne(newUser);
      // console.log(result);
      res.json(result);
    });

    // get delete api

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      // console.log('~ id', id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollections.deleteOne(query);
      // console.log('~ result', result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// get api

app.get('/', (req, res) => {
  res.send('Running My Crud server');
});

app.listen(port, () => {
  console.log(`running app listening at port :${port}`);
});
