const { connect } = require("./socketClient");
const { printTicket } = require("./printer");
const { LOCATION_ID, LOG_LEVEL, BACKEND_WS } = require("./config");

function log(level, ...args) {
  const order = ["debug","info","warn","error"];
  if (order.indexOf(level) >= order.indexOf(LOG_LEVEL)) {
    console[level === "debug" ? "log" : level](...args);
  }
}

const socket = connect();

socket.on("connect", () => {
  log("info", `[bridge] Conectado a ${BACKEND_WS} id ${socket.id}`);
  log("info", `[bridge] Registrando bridge con LOCATION_ID=${LOCATION_ID}`);
  socket.emit("register-bridge", { locationId: LOCATION_ID });
});

socket.on("disconnect", (reason) => log("warn","[bridge] disconnect:", reason));
socket.on("connect_error", (err) => log("warn","[bridge] connect_error:", err.message || err));

// (opcional) keepalive
setInterval(() => { try { socket.emit("ping-check"); } catch {} }, 30000);
socket.on("pong-check", (d) => log("debug","[bridge] pong-check", d));

// 👇 Evento que dispara la impresión
socket.on("print-ticket", (job) => {
  try {
    log("info","[bridge] Job de impresión recibido");
    if (!job || job.type !== "escpos") return;
    printTicket(job.payload);
  } catch (e) { log("error","[bridge] Error job:", e.message || e); }
});
