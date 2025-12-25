const router = require("express").Router();

router.use("/esp", require("./esp.routes"));

module.exports = router;
