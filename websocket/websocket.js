const WebSocket = require('ws');

let webSocket;

const createWebSocketServer = (server) => {
  webSocket = new WebSocket.Server({ server });
  return webSocket;
}

module.exports = createWebSocketServer;