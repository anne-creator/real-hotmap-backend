const mongoose = require("mongoose");
const {MongoClient} = require("mongodb");
const {PubSub} = require('@google-cloud/pubsub');
const fs = require('fs');
const avro = require('avro-js');
var path = require("path");
let mongodbClient;
const connectDb = async () => {
    try {
        // const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        mongodbClient = new MongoClient(process.env.CONNECTION_STRING);
        console.log("Database connected ");
        await monitorCollectionForInserts(mongodbClient, 'Uber_NYC', 'UberData');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}


async function monitorCollectionForInserts(client, databaseName, collectionName) {
    const collection = client.db(databaseName).collection(collectionName);
    // An aggregation pipeline that matches on new documents in the collection.
    const pipeline = [ { $match: { operationType: 'update' } } ];
    const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
    console.log("Pub/Sub connected");
    changeStream.on('change', event => {
        const document = event.fullDocument;
        publishDocumentAsMessage(document,  process.env.PUB_SUB_TOPIC);
    });
  
    // await closeChangeStream(timeInMs, changeStream);
 }
  
 function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Closing the change stream');
            changeStream.close();
            resolve();
        }, timeInMs)
    })
 };

 async function publishDocumentAsMessage(document, topicName) {
    const pubSubClient = new PubSub();
    const topic = pubSubClient.topic(topicName);
    const configDirectory = path.resolve(process.cwd(), "config");
    const file = fs.readFileSync(
        path.join(configDirectory, "chang-stream-schema.avsc"),
        "utf8"
      );
    const definition = file.toString();
    const type = avro.parse(definition);
    const message = {
        id: JSON.stringify(document._id),
        pickup_datetime: document.pickup_datetime.toString(),
        PULocationID: document.PULocationID.toString(),
        dropoff_datetime: document.dropoff_datetime.toString(),
        DOLocationID: document.DOLocationID.toString()
    };
    
    const dataBuffer = Buffer.from(type.toString(message));
    try {
        const messageId = await topic.publishMessage({ data: dataBuffer });
        console.log(`Avro record ${messageId} published.`);
    } catch(error) {
        console.error(error);
    }
 }

// const mongoose = require("mongoose");

// const connectDb = async () => {
//     try {
//         const connect = await mongoose.connect(process.env.CONNECTION_STRING);
//         console.log("Database connected: ", connect.connection.host, connect.connection.name)
//     } catch (err) {
//         console.log(err);
//         process.exit(1);
//     }
// }

module.exports = connectDb;