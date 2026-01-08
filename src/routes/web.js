const router = require("express").Router();
const {
  getSensors,
  getIrrigations,
  getPots,
  getStrains,
  deleteSensor,
  deleteIrrigation,
  updateSensor,
  updateIrrigation,
    getWeeklyStats  
} = require("../controllers/web");

router.get("/sensors", getSensors);
router.get("/irrigations", getIrrigations);
router.get("/pots", getPots);
router.get("/strains", getStrains);
router.get("/stats/weekly", getWeeklyStats);

router.delete("/sensors/:id", deleteSensor);
router.delete("/irrigations/:id", deleteIrrigation);

router.patch("/sensors/:id", updateSensor);
router.patch("/irrigations/:id", updateIrrigation);


module.exports = router;
