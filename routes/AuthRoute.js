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

const { login } =  require("../controllers/AuthenticationController");
const { approveOrReject, revoke } = require("../controllers/ApproveController");
const { getRequestDetails } = require("../controllers/RequestHandleController");
const ExcelController = require('../controllers/ExcelController');
const CompanyController = require('../controllers/CompanyController');

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

router.post('/login', login);

router.use('/company', authMiddleware, companyRoute);
router.use('/group', authMiddleware, groupRoute);
router.use('/templates', authMiddleware, templatesRoute); 
router.get('/request/:id', getRequestDetails);
router.use("/request", authMiddleware, RequestRoute);

router.put( '/approve-or-reject/:id', approveOrReject);
router.put('/revoke/:id', authMiddleware, revoke);

router.use('/email_templates', authMiddleware, emailTemplatesRoute);
router.use('/asset', assetRoute);

// Excel routes
router.post('/upload-excel', upload.single('excelFile'), ExcelController.uploadExcelFile);
router.get('/download-excel/:fileName', ExcelController.downloadExcelFile);
router.post('/create-excel',ExcelController.createExcelFile);

// Bulk upload route
router.post('/bulk-upload/:companyCode', upload.single('excelFile'), CompanyController.getEmployeeinBulk);


module.exports = router;