const router = require("express").Router();  
const { authMiddleware } = require("../middlewares/AuthMiddleware");

const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const RequestRoute= require("../routes/RequestRoute");
const companyRoute = require("../routes/CompanyRoute");
const groupRoute = require("../routes/GroupRoute");
const assetRoute = require("../routes/AssetRoute");

const { login } =  require("../controllers/AuthenticationController");
const { approveOrReject, revoke } = require("../controllers/ApproveController");

router.post('/login', login);

router.use('/company', authMiddleware, companyRoute);
router.use('/group', authMiddleware, groupRoute);
router.use('/templates', authMiddleware, templatesRoute); 
router.use("/request", authMiddleware, RequestRoute);
router.put( '/approve-or-reject/:id', approveOrReject);
router.put('/revoke/:id', authMiddleware, revoke);

router.use('/email_templates', authMiddleware, emailTemplatesRoute);
router.use('/asset', assetRoute);

module.exports = router;