const router = require("express").Router();
const { createSensor, createIrrigation } = require("../controllers/esp");

router.post("/sensor", createSensor);
router.post("/irrigation", createIrrigation);

module.exports = router;
