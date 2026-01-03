const router = require("express").Router();
const {
  getSensors,
  getIrrigations,
  getPots,
  getStrains
} = require("../controllers/web");

router.get("/sensors", getSensors);
router.get("/irrigations", getIrrigations);
router.get("/pots", getPots);
router.get("/strains", getStrains);

module.exports = router;
