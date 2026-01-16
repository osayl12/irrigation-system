const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

let lastWarning = null;
let connected = false;

client.on("connect", () => {
  connected = true;
  client.subscribe("irrigation/warn");
});

client.on("close", () => {
  connected = false;
});

client.on("message", (topic, payload) => {
  if (topic === "irrigation/warn") {
    try {
      lastWarning = JSON.parse(payload.toString());
    } catch {
      lastWarning = { message: payload.toString() };
    }
  }
});

module.exports = {
  client,
  getLastWarning: () => lastWarning,
  clearWarning: () => { lastWarning = null; },
  getStatus: () => ({
    mqttConnected: connected
  })
};
