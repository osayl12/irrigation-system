const pool = require("../models/db");
const Esp = require("../models/esp");
const esp = new Esp(pool);

const createSensor = async (req, res) => {
  const { name, val, id_pot } = req.body;
  await esp.createSensor(name, val, id_pot);
  res.status(201).json({ message: "Sensor saved" });
};

const createIrrigation = async (req, res) => {
  const { count, pot_id } = req.body;
  await esp.createIrrigation(count, pot_id);
  res.status(201).json({ message: "Irrigation saved" });
};

module.exports = {
  createSensor,
  createIrrigation
};
