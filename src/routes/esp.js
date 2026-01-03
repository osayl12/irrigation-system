const router = require("express").Router();
const {   createAvgSensor,createIrrigation } = require("../controllers/esp");

router.post("/create", createAvgSensor);

router.post("/sensors", createAvgSensor);
router.post("/irrigations", createIrrigation);

module.exports = router;
