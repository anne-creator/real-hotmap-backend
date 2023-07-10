const mongoose = require("mongoose");
const {MongoClient} = require("mongodb");
const {PubSub} = require('@google-cloud/pubsub');
const fs = require('fs');
const avro = require('avro-js');
var path = require("path");
let mongodbClient;

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;

let retryAttempts = 0;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 120000, // Set a longer timeout (e.g., 2 minutes)
    });
    console.log("Database connected");
  } catch (err) {
    console.error(err);
    if (retryAttempts < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying connection in ${RETRY_DELAY_MS / 1000} seconds...`);
      retryAttempts++;
      setTimeout(connectDb, RETRY_DELAY_MS);
    } else {
      console.log(`Maximum retry attempts reached. Exiting...`);
      process.exit(1);
    }
  }
};

module.exports = connectDb;