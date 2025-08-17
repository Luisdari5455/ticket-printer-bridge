const { io } = require("socket.io-client");
const { BACKEND_WS, BRIDGE_TOKEN } = require("./config");
let socket;
function connect() {
  socket = io(BACKEND_WS, {
    transports: ["websocket"],
    auth: { token: BRIDGE_TOKEN },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  });
  return socket;
}
function getSocket() {
  if (!socket) throw new Error("Socket no inicializado");
  return socket;
}
module.exports = { connect, getSocket };