const pool = require("../models/db");
const Web = require("../models/web");
const mqtt = require("../mqtt/mqttClient");
const web = new Web(pool);

/* ---------- STATE ---------- */
let pump = false;
let mode = "MANUAL";
let schedule = { start: "06:00", end: "18:00", times: 2 };

/* ---------- READ ---------- */
const getSensors = async (_, res) => {
  const [rows] = await web.getSensors();
  res.json(rows);
};

const getIrrigations = async (_, res) => {
  const [rows] = await web.getIrrigations();
  res.json(rows);
};

/* ---------- DELETE ---------- */
const deleteSensor = async (req, res) => {
  await web.deleteSensor(req.params.id);
  res.json({ success: true });
};

const deleteIrrigation = async (req, res) => {
  await web.deleteIrrigation(req.params.id);
  res.json({ success: true });
};

/* ---------- UPDATE ---------- */
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
  const { type } = req.query;
  let sql = "";

  if (type === "temp")
    sql = `SELECT date, AVG(Val_avg) avg_value FROM sensors WHERE SensorName='temp' GROUP BY date`;
  else if (type === "soil")
    sql = `SELECT date, AVG(Val_avg) avg_value FROM sensors WHERE SensorName='soil' GROUP BY date`;
  else if (type === "water")
    sql = `SELECT date, SUM(count) avg_value FROM irrigation_system GROUP BY date`;

  const [rows] = await pool.execute(sql);
  res.json(rows);
};

/* ---------- DASHBOARD ---------- */
const setPump = (req, res) => {
  const { state } = req.body;
  mqtt.publish("irrigation/pump", JSON.stringify({ state }));
  res.json({ pump: state });
};


const setMode = (req, res) => {
  mode = req.body.mode;
  mqtt.publish("irrigation/mode", JSON.stringify({ mode }));
  res.json({ mode });
};

const setSchedule = (req, res) => {
  schedule = req.body;
  mqtt.publish("irrigation/schedule", JSON.stringify(schedule));
  res.json(schedule);
};

const getStatus = (_, res) => {
  res.json({ pump, mode, schedule });
};

module.exports = {
  getSensors,
  getIrrigations,
  deleteSensor,
  deleteIrrigation,
  updateSensor,
  updateIrrigation,
  getWeeklyStats,
  setPump,
  setMode,
  setSchedule,
  getStatus
};
