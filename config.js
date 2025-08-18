require("dotenv").config();
function env(k, def) { return process.env[k] ?? def; }
module.exports = {
  BACKEND_WS: env("BACKEND_WS", "https://ticketapi-ceqz.onrender.com"),
  LOCATION_ID: env("LOCATION_ID", "sucursal-central-01"),
  BRIDGE_TOKEN: env("BRIDGE_TOKEN", "changeme"),
  PRINTER_ENCODING: env("PRINTER_ENCODING", "GB18030"),
  LOG_LEVEL: env("LOG_LEVEL", "info")
};