const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");

const emailTemplatesRoute = require("./EmailTemplateRoute");
const templatesRoute = require("./TemplatesRoute");
const RequestRoute = require("./RequestRoute");
const companyRoute = require("./CompanyRoute");
const groupRoute = require("./GroupRoute");
const assetRoute = require("./AssetRoute");

const { login } =  require("../controllers/AuthenticationController");
const { approveOrReject, revoke } = require("../controllers/ApproveController");
const { getRequestDetails } = require("../controllers/RequestHandleController");

// Public routes
router.post('/login', login);

// Protected routes
router.use('/company', authMiddleware, companyRoute);
router.use('/group', authMiddleware, groupRoute);
router.use('/templates', authMiddleware, templatesRoute); 
router.get('/request/:id', getRequestDetails);
router.use("/request", authMiddleware, RequestRoute);

router.use('/email_templates', authMiddleware, emailTemplatesRoute);
router.use('/asset', assetRoute);
// router.post ( '/api/employee/approve', authMiddleware, approver);

module.exports = router;