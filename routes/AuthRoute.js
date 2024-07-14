const { Signup, Login } = require("../controllers/AuthController");
const { createRequest } = require("../controllers/RequestHandleController");
const { userVerification } = require("../middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/',userVerification);
router.post('/requests/create_request', createRequest);

module.exports = router;