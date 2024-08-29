const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Company = require('../models/CompanyModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch(err => cb(err));
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

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        employeeList.forEach(employee => {
            worksheet.addRow(Object.values(employee));
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = Math.min(maxLength + 2, 50);
        });

        console.log("Saving Excel file...");
        let fileName = `Company_${companyCode}_Employees_${Date.now()}.xlsx`;  

        let folderPath;
        if (companyCode === '1') {
            folderPath = path.join(__dirname, '..', 'company-assets', '1', 'reports');
        } else {
            folderPath = path.join(__dirname, '..', 'company-assets', 'reports', companyCode);
        }
        
        let filePath = path.join(folderPath, fileName);

        await fs.mkdir(folderPath, { recursive: true });
        await workbook.xlsx.writeFile(filePath);

        console.log("Wohoo! Excel file created successfully!");
        return fileName;

    } catch (err) {
        console.log("Oh no! Something went wrong:", err);
        return null;
    }
}

function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => 
        (current && current[key] !== undefined) ? current[key] : undefined, obj
    );
}

async function uploadExcelFile(req, res) {
    try {
        upload.single('excelFile')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "Multer error: " + err.message });
            } else if (err) {
                return res.status(500).json({ message: "Unknown error: " + err.message });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const filePath = req.file.path;
            const fileName = req.file.filename;

            try {
                await processExcelFile(filePath);
                res.status(200).json({ 
                    message: "File uploaded and processed successfully", 
                    fileName: fileName,
                    filePath: filePath,
                });
            } catch (processError) {
                res.status(400).json({ 
                    message: "File uploaded but processing failed", 
                    error: processError.message 
                });
            }
        });
    } catch (error) {
        console.error("Error in uploadExcelFile:", error);
        res.status(500).json({ message: "Server error during file upload" });
    }
}

async function downloadExcelFile(req, res) {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'public', 'exports', fileName);

    try {
        await fs.access(filePath);
        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    } catch (error) {
        res.status(404).send('File not found');
    }
}

async function processExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const jsonData = [];
    const headers = [];
    const errors = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            headers.push(...row.values.slice(1));
        } else {
            const rowData = {};
            row.eachCell((cell, colNumber) => {
                rowData[headers[colNumber - 1]] = cell.value;
            });
            jsonData.push(rowData);
        }
    });

    for (let [index, row] of jsonData.entries()) {
        try {
            await validateAndProcessRow(row, index + 2, errors);
        } catch (error) {
            errors.push(`Row ${index + 2}: ${error.message}`);
        }
    }

    if (errors.length > 0) {
        await writeErrorLog(errors);
        throw new Error("Errors occurred during processing. Check the error log for details.");
    }
}

async function validateAndProcessRow(row, rowNumber, errors) {
    const requiredFields = ['company_code', 'employee_id', 'name', 'contact', 'email'];
    for (let field of requiredFields) {
        if (!row[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    const company = await Company.findOne({ company_code: row.company_code });

    if (!company) {
        throw new Error(`No company exists with code: ${row.company_code}. Check spelling.`);
    }

    const existingEmployee = company.employees.find(emp => emp.employee_id === row.employee_id);
    if (existingEmployee) {
        throw new Error(`Employee with ID ${row.employee_id} already exists in the company.`);
    }

    const employeeData = {
        employee_id: row.employee_id,
        employee_details: {
            name: row.name,
            gender: row.gender,
            contact: row.contact,
            email: row.email,
        },
        personal_details: {
            pan: row.pan,
            aadharcard: row.aadharcard,
            personal_email: row.personal_email,
            date_of_birth: row.date_of_birth,
        },
        temporary_address: {
            state: row.temp_state,
            city: row.temp_city,
            pin_code: row.temp_pin_code,
            address_line_1: row.temp_address_line_1,
            address_line_2: row.temp_address_line_2,
        },
        permanent_address: {
            state: row.perm_state,
            city: row.perm_city,
            pin_code: row.perm_pin_code,
            address_line1: row.perm_address_line1,
            address_line2: row.perm_address_line2,
        },
        other_details: {
            marital_status: row.marital_status,
            passport: row.passport,
            father_name: row.father_name,
            mother_name: row.mother_name,
            blood_group: row.blood_group,
        },
        official_details: {
            role: row.role,
            designation: row.designation,
            department: row.department,
            reporting_manager: row.reporting_manager,
            joining_date: row.joining_date,
            employee_status: row.employee_status,
            payroll_type: row.payroll_type,
        },
        account_details: {
            bank_details: {
                account_name: row.account_name,
                account_number: row.account_number,
                ifsc_code: row.ifsc_code,
            },
            esi_number: row.esi_number,
            pf_number: row.pf_number,
        },
    };

    company.employees.push(employeeData);
    await company.save();
}

async function writeErrorLog(errors) {
    const logPath = path.join(__dirname, '..', 'logs', 'excel_import_errors.log');
    await fs.writeFile(logPath, errors.join('\n'));
}

module.exports = { createExcelFile, uploadExcelFile, downloadExcelFile };
