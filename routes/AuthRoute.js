const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");

const emailTemplatesRoute = require("./EmailTemplateRoute");
const templatesRoute = require("./TemplatesRoute");
const RequestRoute = require("./RequestRoute");
const companyRoute = require("./CompanyRoute");
const groupRoute = require("./GroupRoute");
const assetRoute = require("./AssetRoute");

const { login } = require("../controllers/AuthenticationController");
const { createExcelFile, uploadExcelFile, downloadExcelFile } = require('../util/createExcel');

// Public routes
router.post('/login', login);

// Protected routes
router.use('/company', authMiddleware, companyRoute);
router.use('/group', authMiddleware, groupRoute);
router.use('/templates', authMiddleware, templatesRoute); 
router.use("/request", authMiddleware, RequestRoute);
router.use('/email_templates', authMiddleware, emailTemplatesRoute);
router.use('/asset', authMiddleware, assetRoute);

// Excel generation route
router.get("/create-excel", authMiddleware, async (req, res) => {
    try {
        console.log("Starting Excel file generation...");
        
        const companyCode = req.cookies.companyCode;
        if (!companyCode) {
            console.log("No company code found in cookies");
            return res.status(400).json({ message: 'Company code not found in cookies' });
        }

        const selectedFields = [
            'employee_id',
            'employee_details.name',
            'employee_details.email',
            'employee_details.gender',
            'employee_details.contact',
            'personal_details.pan',
            'personal_details.aadharcard',
            'personal_details.personal_email',
            'personal_details.date_of_birth'
        ];

        const headerMapping = {
            'employee_id': 'Employee ID',
            'employee_details.name': 'Name',
            'employee_details.email': 'Email',
            'employee_details.gender': 'Gender',
            'employee_details.contact': 'Contact',
            'personal_details.pan': 'PAN',
            'personal_details.aadharcard': 'Aadhar Card',
            'personal_details.personal_email': 'Personal Email',
            'personal_details.date_of_birth': 'Date of Birth'
        };

        const fileName = await createExcelFile(companyCode, selectedFields, headerMapping);
        if (!fileName) {
            return res.status(500).json({ message: "Couldn't create Excel file" });
        }

        res.json({
            message: 'Yay! Excel file generated successfully',
            fileName: fileName,
        });

    } catch (error) {
        console.error("Error in Excel route:", error);
        res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    }
});

// Excel upload route
router.post("/upload-excel", authMiddleware, uploadExcelFile);

// Excel download route
router.get("/download-excel/:fileName", authMiddleware, downloadExcelFile);

module.exports = router;