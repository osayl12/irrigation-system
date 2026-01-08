const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

let lastWarning = null;

client.on("message", (topic, payload) => {
  if (topic === "irrigation/warn") {
    try {
      lastWarning = JSON.parse(payload.toString());
    } catch {
      lastWarning = { message: payload.toString() };
    }
  }
});

client.on("connect", () => {
  client.subscribe("irrigation/warn");
});

module.exports = {
  client,
  getLastWarning: () => lastWarning,
  clearWarning: () => { lastWarning = null; }
};
