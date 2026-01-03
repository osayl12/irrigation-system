const pool = require("../models/db");
const Esp = require("../models/esp");
const esp = new Esp(pool);

// POST /esp/sensors
const createAvgSensor = async (req, res) => {
  try {
    const { name, val, id_pot } = req.body;

    if (!name || val === undefined || id_pot === undefined) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    await esp.createAvgSensor(name, val, id_pot);
    return res.status(201).json({ message: "Sensor data saved successfully" });

  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(409).json({ message: "pot_id does not exist" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /esp/irrigations
const createIrrigation = async (req, res) => {
  try {
    const { pot_id, duration } = req.body;

    if (pot_id === undefined || duration === undefined) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    await esp.createIrrigation(pot_id, duration);
    return res.status(201).json({ message: "Irrigation saved successfully" });

  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(409).json({ message: "pot_id does not exist" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createAvgSensor, createIrrigation };
