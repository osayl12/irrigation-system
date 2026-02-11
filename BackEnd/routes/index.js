const router = require("express").Router();

router.use("/esp", require("./esp"));
router.use("/web", require("./web"));

module.exports = router;
