const router = require("express").Router();
const c = require("../controllers/web");

/*router.get("/sensors", c.getSensors);
router.get("/irrigations", c.getIrrigations);

router.delete("/sensors/:id", c.deleteSensor);
router.delete("/irrigations/:id", c.deleteIrrigation);

router.patch("/sensors/:id", c.updateSensor);
router.patch("/irrigations/:id", c.updateIrrigation);
*/
router.get("/stats/weekly", c.getWeeklyStats);

router.post("/pump", c.setPump);
router.post("/mode", c.setMode);
router.post("/schedule", c.setSchedule);
router.get("/status", c.getStatus);

module.exports = router;
