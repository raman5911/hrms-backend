const { Signup, Login } = require("../controllers/AuthController");
const { userVerification } = require("../middlewares/AuthMiddleware");
const usersRoute = require("../routes/UsersRoute");
const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const { trusted } = require("mongoose");
const { sendMailToUser} = require("../util/Emailfunc");
const {approver} = require("../controllers/ApproveController");
const RequestRoute= require("../routes/RequestRoute");
const { signup, signIN } =  require("../controllers/AuthenticationController");
const router = require("express").Router();  

router.use("/request", RequestRoute);
router.post("/Sign_up",signup)
router.post("/signup", Signup);
router.post("/Sign_IN",signIN);
router.post('/login', Login);
router.post('/',userVerification);
router.use('/users', usersRoute);
router.use('/email_templates', emailTemplatesRoute);
router.use('/templates', templatesRoute); 
router.post ( '/sendMail', sendMailToUser); 
router.post ( '/api/employee/approve' , approver);

module.exports = router;