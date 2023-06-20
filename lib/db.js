require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI;
const options = {};

if (!URI) {
  throw new Error('Please add your Mongo DB URI to .env file');
}

let client = new MongoClient(URI, options);
let clientPromise;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

module.exports = clientPromise;
