const pool = require("../models/db");
const Web = require("../models/web");
const web = new Web(pool);

const getSensors = async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const [rows] = await web.getSensors(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getIrrigations = async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const [rows] = await web.getIrrigations(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPots = async (req, res) => {
  try {
    const [rows] = await web.getPots();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStrains = async (req, res) => {
  try {
    const [rows] = await web.getStrains();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSensors, getIrrigations, getPots, getStrains };
