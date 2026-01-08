const mqtt = require("../mqtt/mqttClient");



/* ---------- READ ---------- */
/*
const getSensors = async (_, res) => {
  const [rows] = await web.getSensors();
  res.json(rows);
};

const getIrrigations = async (_, res) => {
  const [rows] = await web.getIrrigations();
  res.json(rows);
};

/* ---------- DELETE ---------- */
/*
const deleteSensor = async (req, res) => {
  await web.deleteSensor(req.params.id);
  res.json({ success: true });
};

const deleteIrrigation = async (req, res) => {
  await web.deleteIrrigation(req.params.id);
  res.json({ success: true });
};

/* ---------- UPDATE ---------- */
/*
const updateSensor = async (req, res) => {
  await web.updateSensor(req.params.id, req.body);
  res.json({ success: true });
};

const updateIrrigation = async (req, res) => {
  await web.updateIrrigation(req.params.id, req.body);
  res.json({ success: true });
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
  }

  else if (type === "soil") {
    sql = `
      SELECT date, AVG(Val_avg) AS avg_value
      FROM sensors
      WHERE SensorName = 'soil'
      GROUP BY date
      ORDER BY date
    `;
  }

  else if (type === "water") {
    sql = `
      SELECT date, SUM(count) AS avg_value
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
    rows.map(r => ({
      ...r,
      mode 
    }))
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

  mqtt.client.publish(
    "irrigation/pump",
    JSON.stringify({ state, force })
  );

  if (force) mqtt.clearWarning();

  res.json({ success: true });
};

/* ===== Mode control ===== */
const setMode = (req, res) => {
  const { mode } = req.body;
  mqtt.client.publish(
    "irrigation/mode",
    JSON.stringify({ mode })
  );
  res.json({ success: true });
};

/* ===== Schedule ===== */
const setSchedule = (req, res) => {
  mqtt.client.publish(
    "irrigation/schedule",
    JSON.stringify(req.body)
  );
  res.json({ success: true });
};

module.exports = {
  /*
  getSensors,
  getIrrigations,
  deleteSensor,
  deleteIrrigation,
  updateSensor,
  updateIrrigation,
*/
  getWarnings,
  getWeeklyStats,
  setPump,
  setMode,
  setSchedule,
  getStatus
};
