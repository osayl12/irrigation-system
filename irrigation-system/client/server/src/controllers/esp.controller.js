const db = require("../models/db");
const EspModel = require("../models/esp.model");

const esp = new EspModel(db);

const getByPot = async (req, res) => {
  try {
    const potId = Number(req.params.potId);
    const data = await esp.getByPot(potId);
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const createAvg = async (req, res) => {
  try {
    const { sensorName, avg, potId } = req.body;
    const id = await esp.create(sensorName, avg, potId);
    res.status(201).json({ id });
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getByPot, createAvg };
