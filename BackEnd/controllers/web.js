const mqtt = require("../mqtt/mqttClient");
const pool = require("../models/db");

// ---------- READ ----------
const getSensors = async (_req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM sensors ORDER BY id DESC");
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch sensors" });
  }
};

const getIrrigations = async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM irrigation_system ORDER BY id DESC",
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch irrigations" });
  }
};

// ---------- DELETE ----------
const deleteSensor = async (req, res) => {
  try {
    await pool.execute("DELETE FROM sensors WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete sensor" });
  }
};

const deleteIrrigation = async (req, res) => {
  try {
    await pool.execute("DELETE FROM irrigation_system WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete irrigation" });
  }
};

// ---------- UPDATE ----------
const updateSensor = async (req, res) => {
  try {
    const allowed = ["SensorName", "Val_avg", "Pot_id"];
    const keys = Object.keys(req.body).filter((k) => allowed.includes(k));
    if (!keys.length) return res.status(400).json({ error: "No valid fields" });

    const sql = `UPDATE sensors SET ${keys.map((k) => `${k}=?`).join(",")} WHERE id=?`;
    const values = [...keys.map((k) => req.body[k]), req.params.id];

    await pool.execute(sql, values);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update sensor" });
  }
};

const updateIrrigation = async (req, res) => {
  try {
    const allowed = ["count", "pot_id"];
    const keys = Object.keys(req.body).filter((k) => allowed.includes(k));
    if (!keys.length) return res.status(400).json({ error: "No valid fields" });

    const sql = `UPDATE irrigation_system SET ${keys.map((k) => `${k}=?`).join(",")} WHERE id=?`;
    const values = [...keys.map((k) => req.body[k]), req.params.id];

    await pool.execute(sql, values);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update irrigation" });
  }
};

/* ---------- STATS ---------- */
const getWeeklyStats = async (req, res) => {
  const { type, mode } = req.query;

  let sql = "";

  // === בחירת הנתון ===
  if (type === "temp") {
    sql = `
      SELECT date, AVG(Val_avg) AS avg_value
      FROM sensors
      WHERE SensorName = 'temp'
      GROUP BY date
      ORDER BY date
    `;
  } else if (type === "soil") {
    sql = `
      SELECT date, AVG(Val_avg) AS avg_value
      FROM sensors
      WHERE SensorName = 'soil'
      GROUP BY date
      ORDER BY date
    `;
  } else if (type === "water") {
    sql = `
    SELECT date, SUM(liters) AS avg_value
    FROM irrigation_system
    GROUP BY date
    ORDER BY date
  `;
  }

  if (!sql) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const [rows] = await pool.execute(sql);

  res.json(
    rows.map((r) => ({
      ...r,
      mode,
    })),
  );
};

/* ===== GET system status ===== */
const getStatus = (req, res) => {
  res.json(mqtt.getStatus());
};

/* ===== GET warnings ===== */
const getWarnings = (req, res) => {
  res.json(mqtt.getLastWarning());
};

/* ===== Pump control ===== */
const setPump = (req, res) => {
  const { state, force = false } = req.body;

  let command = "OFF";

  if (state && force) {
    command = "FORCE_ON";
  } else if (state) {
    command = "ON";
  }
  mqtt.client.publish("irrigation/pump", command);

  if (force) mqtt.clearWarning();

  res.json({ success: true });
};

/* ===== Mode control ===== */
const setMode = (req, res) => {
  const { mode } = req.body;
  mqtt.client.publish("irrigation/mode", String(mode));
  res.json({ success: true });
};

/* ===== Schedule ===== */
const setSchedule = (req, res) => {
  const { start, end, times, duration } = req.body;

  mqtt.client.publish(
    "irrigation/schedule",
    JSON.stringify({ start, end, times, duration }),
  );

  res.json({ success: true });
};

module.exports = {
  getSensors,
  getIrrigations,
  deleteSensor,
  deleteIrrigation,
  updateSensor,
  updateIrrigation,

  getWarnings,
  getWeeklyStats,
  setPump,
  setMode,
  setSchedule,
  getStatus,
};
