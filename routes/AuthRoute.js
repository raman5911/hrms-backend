const { Signup, Login } = require("../controllers/AuthController");
const { userVerification } = require("../middlewares/AuthMiddleware");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const usersRoute = require("../routes/UsersRoute");
const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const { trusted } = require("mongoose");
const { sendMailToUser} = require("../util/Emailfunc");
const {approver} = require("../controllers/approver");
const RequestRoute= require("../routes/RequestRoute");
const { signup, signIN, profileHandler, updateHandler} =  require("../controllers/AuthenticationController");
console.log({signup, signIN, profileHandler, updateHandler});
const router = require("express").Router();  

// const { authMiddleware } = r

router.use("/request", RequestRoute);
router.post("/Sign_up", ...signup);
router.post("/signup", Signup);
router.post("/Sign_IN",signIN);
router.post('/login', Login);
router.post('/',userVerification);
// Protected routes
//router.get('/profile', authMiddleware,profileHandler);
router.get('/profile',  (req, res) => {
    res.json({ message: 'Profile route working' });
});
router.put('/update', (req, res) => {
    res.json({ message: 'Update route working' });
  });
//router.put('/update', authMiddleware, updateHandler);
router.use('/users',authMiddleware, usersRoute);
router.use('/email_templates', emailTemplatesRoute);
router.use('/templates', templatesRoute); 
router.post ( '/sendMail',sendMailToUser); 
router.post ( '/api/employee/approve' , approver);

module.exports = router;