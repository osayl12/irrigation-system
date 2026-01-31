const mqtt = require("mqtt");
const client = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883");
const pool = require("../models/db");

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

const SAMPLE_HOURS = [0, 6, 12, 18];
let lastSampleKey = null;

setInterval(async () => {
  try {
    if (!systemStatus.mqttConnected) return;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    if (!SAMPLE_HOURS.includes(hour)) return;
    if (minute !== 0 || second !== 0) return;

    const key = `${now.toDateString()}-${hour}`;
    if (lastSampleKey === key) return;

    lastSampleKey = key;

    // שמירת 3 דגימות: temp/soil/light לטבלת sensors
    const potId = 1;

    const inserts = [
      ["temp", Number(systemStatus.temp ?? -999), potId],
      ["soil", Number(systemStatus.soil ?? -1), potId],
      ["light", Number(systemStatus.light ?? -1), potId],
    ];

    const slotStart = `${String(hour).padStart(2, "0")}:00:00`;
    const slotEnd = `${String(hour).padStart(2, "0")}:59:59`;

    for (const [name, val, id_pot] of inserts) {
      const [[exists]] = await pool.execute(
        `SELECT COUNT(*) AS c
         FROM sensors
         WHERE date = CURDATE()
           AND SensorName = ?
           AND Pot_id = ?
           AND time BETWEEN ? AND ?`,
        [name, id_pot, slotStart, slotEnd],
      );

      if (exists.c > 0) continue;

      await pool.execute(
        `INSERT INTO sensors (SensorName, Val_avg, date, time, Pot_id)
         VALUES (?, ?, CURDATE(), CURTIME(), ?)`,
        [name, val, id_pot],
      );
    }
  } catch (e) {
    // silent
  }
}, 1000);

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
