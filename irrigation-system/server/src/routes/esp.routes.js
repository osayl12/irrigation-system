const router = require("express").Router();
const { createAvg, getByPot } = require("../controllers/esp.controller");

router.post("/", createAvg);
router.get("/pot/:potId", getByPot);

module.exports = router;
