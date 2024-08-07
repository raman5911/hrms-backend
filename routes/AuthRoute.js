const router = require("express").Router();  
const { authMiddleware } = require("../middlewares/AuthMiddleware");

const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const RequestRoute= require("../routes/RequestRoute");
const companyRoute = require("../routes/CompanyRoute");
const groupRoute = require("../routes/GroupRoute");

const { login } =  require("../controllers/AuthenticationController");
// const { approver } = require("../controllers/ApproveController");

router.post('/login', login);

router.use('/company', authMiddleware, companyRoute);
router.use('/group', authMiddleware, groupRoute);
router.use('/templates', authMiddleware, templatesRoute); 
// router.use("/request", authMiddleware, RequestRoute);

router.use('/email_templates', authMiddleware, emailTemplatesRoute);
// router.post ( '/api/employee/approve', authMiddleware, approver);

module.exports = router;