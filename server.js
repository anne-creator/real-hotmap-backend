const express = require("express");
const app = express();
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const port = process.env.PORT;
const createWebSocketServer = require("./websocket/websocket");
const UberData = require("./models/uberData");
const { getPickupData } = require('./controller/hotmapController');

app.use(express.json());
connectDb();

const server = app.listen(port, () => {
    console.log(`Server Run on ${port} `)
})

const webSocket = createWebSocketServer(server);
webSocket.on('connection', async (webSocketClient) => {
    console.log('A new client Connected!');
    const uberData = await getPickupData();
    webSocketClient.send(JSON.stringify(uberData));
});