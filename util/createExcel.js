const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Company = require('../models/CompanyModel');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

async function createExcelFile(companyCode, selectedFields, headerMapping) {
    try {
        console.log("Looking for company with code:", companyCode);
        let company = await Company.findOne({ company_code: companyCode });

        if (!company) {
            console.log("Oops! Company not found");
            return null;
        }

        console.log("Preparing employee data...");
        let employeeList = company.employees.map(emp => {
            let employeeData = {};
            selectedFields.forEach(field => {
                let value = getNestedProperty(emp, field);
                employeeData[headerMapping[field] || field] = value !== undefined ? value : 'N/A';
            });
            return employeeData;
        });

        console.log("Creating Excel workbook...");
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');

        const headers = selectedFields.map(field => headerMapping[field] || field);
        worksheet.addRow(headers);

        //making headings bold in excel sheet
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        //Add data
        employeeList.forEach(employee => {
            worksheet.addRow(Object.values(employee));
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength ) {
                    maxLength = columnLength;
                }
            });
            column.width = Math.min(maxLength + 2, 50); // +2 for padding, max 50
        });

        console.log("Saving Excel file...");
        let fileName = `Company_${companyCode}_Employees_${Date.now()}.xlsx`;  

        let folderPath;
        if (companyCode === '1') {
            folderPath = path.join(__dirname, '..', 'compamy-assets',  '1', 'reports');
        } else {
            folderPath = path.join(__dirname, '..', 'company-assets', 'reports', companyCode);
        }
        
        let filePath = path.join(folderPath, fileName);

        if (!fs.existsSync(folderPath)) {
            console.log("Creating folder for Excel files...");
            fs.mkdirSync(folderPath, { recursive:  true });
        }

        await workbook.xlsx.writeFile( filePath);

        console.log("Wohoo! Excel file created successfully!");
           return fileName;

    } catch (err) {
        console.log("Oh no! Something went wrong:", err);
             return null;
    }
}

// using helper function to get nested properties
function getNestedProperty(obj, path) {
    return  path.split('.').reduce((current, key) => 
          (current && current[key]  !==    undefined)?   current[key] : undefined, obj
    );
}

//Excel file upload
async function uploadExcelFile(req, res) {
    try {
        upload.single('excelFile')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "Multer error: " + err.message });
            }   
            else if (err) {
                 
                return res.status(500).json({ message: "Unknown error: " + err.message });
            }

            if (!req.file) {
                
                return res.status(400).json({ message: "No file uploaded" });
            }

              const filePath = req.file.path;
              const fileName = req.file.filename;

            res.status(200).json({ 
                message: "File uploaded successfully", 
                fileName: fileName,
                filePath: filePath, 

            });
        });
    } catch (error) { 

        console.error("Error in uploadExcelFile:", error);
        res.status(500).json({ message: "Server error during file upload" }); 

    }
}

function downloadExcelFile(req, res) { 

    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'public', 'exports', fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    } 
     else { 
        res.status(404).send('File not found');
    }
}

module.exports = { createExcelFile, uploadExcelFile, downloadExcelFile };