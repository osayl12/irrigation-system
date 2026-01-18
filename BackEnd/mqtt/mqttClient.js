const mqtt = require("mqtt");
const client = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883");

let lastWarning = null;
let lastUpdate = Date.now();

let systemStatus = {
  mqttConnected: false,
  pump: false,
  mode: "UNKNOWN",
  temp: null,
  soil: null,
  light: null,
};

client.on("connect", () => {
  systemStatus.mqttConnected = true;

  client.subscribe([
    "irrigation/warn",
    "irrigation/status",
    "irrigation/mode",
    "irrigation/sensors",
  ]);
});

client.on("close", () => {
  systemStatus.mqttConnected = false;
});

client.on("message", (topic, payload) => {
  const msg = payload.toString();
  lastUpdate = Date.now();

  // ---- WARNINGS ----
  if (topic === "irrigation/warn") {
    try {
      lastWarning = JSON.parse(msg);
    } catch {
      lastWarning = { message: msg };
    }
  }

  // ---- PUMP STATUS ----
  if (topic === "irrigation/status") {
    systemStatus.pump = msg === "ON";
  }

  // ---- MODE ----
  if (topic === "irrigation/mode") {
    systemStatus.mode = msg;
  }

  // ---- SENSORS ----
  if (topic === "irrigation/sensors") {
    try {
      const data = JSON.parse(msg);
      systemStatus.temp = data.temp ?? null;
      systemStatus.soil = data.soil ?? null;
      systemStatus.light = data.light ?? null;
    } catch {
      // ignore bad payload
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
    ...systemStatus,
    stale: Date.now() - lastUpdate > 10000,
  }),
};
