const pool = require("../models/db");
const Esp = require("../models/esp");

const esp = new Esp(pool);

const createAvgSensor = async (req, res) => {

  if (!req.body) {
    return res.status(400).json({ message: "Body is missing" });
  }

  try {
    const { name, val, id_pot } = req.body;

    if (!name || val === undefined || id_pot === undefined) {
      return res.status(400).json({
        message: "Missing parameters"
      });
    }

    await esp.createAvgSensor(name, val, id_pot);

    return res.status(201).json({
      message: "Sensor data saved successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { createAvgSensor };
