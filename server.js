const express = require("express");
const app = express();
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const port = process.env.PORT;
const createWebSocketServer = require("./websocket/websocket");
const UberData = require("./models/uberData");
const cors = require('cors');
// const { runDataGeneration} = require('./simulator');
const { getPickupData } = require('./controller/hotmapController');
const { getPastData } = require('./controller/hotmapController');
app.use(express.json());
app.use(cors());

connectDb();


app.get("/api/get", getPickupData);

// runDataGeneration(1000, 5);


const server = app.listen(port, () => {
    console.log(`Server Run on ${port} `)
})

app.get("/api/getPast", getPastData);
// const webSocket = createWebSocketServer(server);
// webSocket.on('connection', async (webSocketClient) => {
//     console.log('A new client Connected!');

//     const uberData = await getPickupData();
//     webSocketClient.send(JSON.stringify(uberData));
// });

// webSocket.on('connection', async (webSocketClient) => {
//     console.log('A new client Connected!');
//     const uberData = await getTable();
//     webSocketClient.send(JSON.stringify(uberData));
// });


// webSocket.on('error', (error) => {
//     console.log(error);
// });

// async function getTable() {
//     const {BigQuery} = require('@google-cloud/bigquery');
//     const bigquery = new BigQuery();
//     const datasetId = "perceptive-day-388607.mangoDb_change_stream";
//     const tableId = "perceptive-day-388607.mangoDb_change_stream.NEW_MONDB_CHANGE_STREAM";
//     const query = `SELECT *
//     FROM \`perceptive-day-388607.mangoDb_change_stream.NEW_MONDB_CHANGE_STREAM\``;
//     const options = {
//         query: query,
//         location: 'northamerica-northeast2',
//       };
//       const [job] = await bigquery.createQueryJob(options);
//       console.log(`Job ${job.id} started.`);
//       const [rows] = await job.getQueryResults();
//       console.log('Rows:');
//       rows.forEach(row => console.log(row));
//       return rows;
//   }
