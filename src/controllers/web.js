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

const getWeeklyStats = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: "type is required" });
    }

    let sql = "";

    if (type === "temp") {
      sql = `
        SELECT date, AVG(Val_avg) AS avg_value
        FROM sensors
        WHERE SensorName = 'temp'
          AND date >= CURDATE() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
      `;
    } 
    else if (type === "soil") {
      sql = `
        SELECT date, AVG(Val_avg) AS avg_value
        FROM sensors
        WHERE SensorName = 'soil'
          AND date >= CURDATE() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
      `;
    } 
    else if (type === "water") {
      sql = `
        SELECT date, SUM(count) AS avg_value
        FROM irrigation_system
        WHERE date >= CURDATE() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
      `;
    } 
    else {
      return res.status(400).json({ message: "Invalid type" });
    }

    const [rows] = await pool.execute(sql);
    return res.json(rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    await web.deleteSensor(id);
    res.json({ message: "Sensor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteIrrigation = async (req, res) => {
  try {
    const { id } = req.params;
    await web.deleteIrrigation(id);
    res.json({ message: "Irrigation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;

    await web.updateSensor(id, req.body);

    return res.json({
      message: "Sensor updated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const updateIrrigation = async (req, res) => {
  try {
    const { id } = req.params;

    await web.updateIrrigation(id, req.body);

    return res.json({
      message: "Irrigation updated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getSensors,
  getIrrigations,
  getPots,
  getStrains,
  deleteSensor,
  deleteIrrigation,
  updateSensor,
  updateIrrigation,
  getWeeklyStats
};
