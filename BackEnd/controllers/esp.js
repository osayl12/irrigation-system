const pool = require("../models/db");
const Esp = require("../models/esp");
const esp = new Esp(pool);

const createSensor = async (req, res) => {
  try {
    const { name, val, id_pot } = req.body;

    if (
      typeof name !== "string" ||
      typeof val !== "number" ||
      typeof id_pot !== "number"
    ) {
      return res.status(400).json({ error: "Invalid sensor data" });
    }

    await esp.createSensor(name, val, id_pot);
    res.status(201).json({ message: "Sensor saved" });
  } catch {
    res.status(500).json({ error: "Error saving sensor" });
  }
};

const createIrrigation = async (req, res) => {
  try {
    const { count, pot_id, liters } = req.body;

    if (
      typeof count !== "number" ||
      typeof pot_id !== "number" ||
      typeof liters !== "number"
    ) {
      return res.status(400).json({ error: "Invalid irrigation data" });
    }

    await esp.createIrrigation(count, pot_id, liters);
    res.status(201).json({ message: "Irrigation saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving irrigation" });
  }
};

module.exports = {
  createSensor,
  createIrrigation,
};
