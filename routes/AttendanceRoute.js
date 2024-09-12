const router = require("express").Router();
const { punchIn, punchOut } = require("../controllers/AttendanceController");

router.post("/punch_in", punchIn);
router.put("/punch_out", punchOut);

module.exports = router;