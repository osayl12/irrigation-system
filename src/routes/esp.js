const router = require("express").Router();
const { createAvgSensor } = require("../controllers/esp");

router.post("/create", createAvgSensor);


module.exports = router;
