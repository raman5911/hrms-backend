const router = require("express").Router();
const { getAll } = require("../controllers/AssetController");

router.get("/get_all", getAll);

module.exports = router;