const { WebSocketServer } = require('ws');
const webSocket = new WebSocketServer({ port: 8081 });

module.exports = webSocket;