const { Signup, Login } = require("../controllers/AuthController");
const { createRequest } = require("../controllers/RequestHandleController");
const { userVerification } = require("../middlewares/AuthMiddleware");
const usersRoute = require("../routes/UsersRoute");
const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const { trusted } = require("mongoose");
const { sendMailToUser} = require("../util/Emailfunc");
const {approver} = require("../controllers/ApproveController");  
const { checkEmployeeIdExistsEndpoint, generateEmployeeId } = require("../util/EmpIDgen");

const router = require("express").Router();  


router.post("/signup", Signup);
router.post('/login', Login);
router.post('/',userVerification);
router.post('/requests/create_request', createRequest);
router.use('/users', usersRoute);
router.use('/email_templates', emailTemplatesRoute);
router.use('/templates', templatesRoute); 
router.post ( '/sendMail', sendMailToUser); 
router.post ( '/api/employee/approve' , approver);  
router.get('/api/check-employee-id/:employeeId', checkEmployeeIdExistsEndpoint);
router.post('/api/generate-employee-id', generateEmployeeId);



module.exports = router;