const router = require("express").Router();
const c = require("../controllers/web");
const mqttClient = require("../mqtt/mqttClient");

// למרות שזה לא שמושי
router.get("/sensors", c.getSensors);
router.get("/irrigations", c.getIrrigations);

router.delete("/sensors/:id", c.deleteSensor);
router.delete("/irrigations/:id", c.deleteIrrigation);

router.patch("/sensors/:id", c.updateSensor);
router.patch("/irrigations/:id", c.updateIrrigation);
//------------------------------

// ===== STATS =====
router.get("/stats/weekly", c.getWeeklyStats);

// ===== WARNINGS =====
router.get("/warnings", (req, res) => {
  res.json(mqttClient.getLastWarning());
});

router.post("/pump", c.setPump);
router.post("/mode", c.setMode);
router.post("/schedule", c.setSchedule);

// ===== SYSTEM STATUS =====
router.get("/status", (req, res) => {
  res.json(mqttClient.getStatus());
});

module.exports = router;
