const mqtt = require("mqtt");
const client = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883");

let lastWarning = null;
let connected = false;
let lastStatus = null;

client.on("connect", () => {
  connected = true;
  client.subscribe("irrigation/warn");
  client.subscribe("irrigation/status");
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

  if (topic === "irrigation/status") {
    try {
      lastStatus = JSON.parse(payload.toString());
    } catch {
      lastStatus = null;
    }
  }
});

module.exports = {
  client,
  getLastWarning: () => lastWarning,
  clearWarning: () => {
    lastWarning = null;
  },
  getStatus: () => ({
    mqttConnected: connected,
    pump: lastStatus?.pump ?? false,
    mode: lastStatus?.mode ?? "UNKNOWN",
    temp: lastStatus?.temp ?? null,
    soil: lastStatus?.soil ?? null,
    light: lastStatus?.light ?? null,
  }),
};
