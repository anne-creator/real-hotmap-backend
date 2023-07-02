const mongoose = require("mongoose");
const {MongoClient} = require("mongodb");
const {PubSub} = require('@google-cloud/pubsub');
const fs = require('fs');
const avro = require('avro-js');
var path = require("path");
let mongodbClient;

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected ");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}



module.exports = connectDb;