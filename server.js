const express = require("express");
const app = express();
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const port = process.env.PORT;
// const webSocket = require("./websocket/websocket");
const createWebSocketServer = require("./websocket/websocket");
const UberData = require("./models/uberData");
const { getPickupData } = require('./controller/hotmapController');
app.use(express.json());

connectDb();

// first routes is the folder name, second is the file name
app.use("/api/example", require("./routes/routes"))
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server Run on ${port} `)
})

const webSocket = createWebSocketServer(server);

//when testing, use Postman and use ws://localhost:8080
//we can remove the GET since websocket will do the same work
//TODO: complete the logic for fetching all data from DB.
webSocket.on('connection', async (webSocketClient) => {
    console.log('A new client Connected!');   
    const uberData = await getPickupData();
    webSocketClient.send(JSON.stringify(uberData));
});