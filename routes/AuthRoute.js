const router = require("express").Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const multer = require('multer');
const path = require('path');

const emailTemplatesRoute = require("../routes/EmailTemplateRoute");
const templatesRoute = require("../routes/TemplatesRoute");
const RequestRoute = require("../routes/RequestRoute");
const companyRoute = require("../routes/CompanyRoute");
const groupRoute = require("../routes/GroupRoute");
const assetRoute = require("../routes/AssetRoute");

const CompanyController = require('../controllers/CompanyController');
const ExcelController = require('../controllers/ExcelController');

const { login } = require("../controllers/AuthenticationController");
const { approveOrReject, revoke } = require("../controllers/ApproveController");
const { getRequestDetails } = require("../controllers/RequestHandleController");

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Authentication route
router.post('/login', login);

// Company routes
router.use('/company', authMiddleware, companyRoute);

// Group routes
router.use('/group', authMiddleware, groupRoute);

// Template routes
router.use('/templates', authMiddleware, templatesRoute);

// Request routes
router.get('/request/:id', getRequestDetails);
router.use("/request", authMiddleware, RequestRoute);

// Approval routes
router.put('/approve-or-reject/:id', approveOrReject);
router.put('/revoke/:id', authMiddleware, revoke);

// Email template routes
router.use('/email_templates', authMiddleware, emailTemplatesRoute);

// Asset routes
router.use('/asset', assetRoute);

// Excel routes
router.post('/upload-excel', upload.single('excelFile'), ExcelController.uploadExcelFile);
router.get('/download-excel/:fileName', ExcelController.downloadExcelFile);
router.post('/create-excel',ExcelController.createExcelFile);

// Bulk upload route
router.post('/bulk-upload/:companyCode', upload.single('excelFile'), CompanyController.getEmployeeinBulk);

module.exports = router;