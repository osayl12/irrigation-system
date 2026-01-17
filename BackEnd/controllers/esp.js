const pool = require("../models/db");
const Esp = require("../models/esp");
const esp = new Esp(pool);

const createSensor = async (req, res) => {
  try {
    const { name, val, id_pot } = req.body;
    await esp.createSensor(name, val, id_pot);
    res.status(201).json({ message: "Sensor saved" });
  } catch (err) {
    res.status(500).json({ error: "Error saving sensor" });
  }
};

const createIrrigation = async (req, res) => {
  try {
    const { count, pot_id } = req.body;
    await esp.createIrrigation(count, pot_id);
    res.status(201).json({ message: "Irrigation saved" });
  } catch (err) {
    res.status(500).json({ error: "Error saving irrigation" });
  }
};

module.exports = {
  createSensor,
  createIrrigation,
};
