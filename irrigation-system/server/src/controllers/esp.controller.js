const db = require("../models/db");
const EspModel = require("../models/esp.model");

const esp = new EspModel(db);

const createAvg = async (req, res) => {
  try {
    console.log("📥 From ESP:", req.body);

    const { sensorName, avg, potId } = req.body;
    if (!sensorName || typeof avg !== "number" || !potId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const id = await esp.create(sensorName, avg, potId);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getByPot = async (req, res) => {
  try {
    const potId = Number(req.params.potId);
    const data = await esp.getByPot(potId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createAvg, getByPot };
