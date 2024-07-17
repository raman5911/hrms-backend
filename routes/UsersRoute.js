const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleware");
const { fetchUsersList } = require("../controllers/UserDetailsController");

router.get('/list', fetchUsersList);

module.exports = router;