const router = require("express").Router();
const {
  getSensors,
  getIrrigations,
  getPots,
  getStrains,
  deleteSensor,
  deleteIrrigation
} = require("../controllers/web");

router.get("/sensors", getSensors);
router.get("/irrigations", getIrrigations);
router.get("/pots", getPots);
router.get("/strains", getStrains);
router.delete("/sensors/:id", deleteSensor);
router.delete("/irrigations/:id", deleteIrrigation);

module.exports = router;
