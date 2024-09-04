const Company = require("../models/CompanyModel");
const EmailToCompanyCodeMapping = require("../models/EmailToCompanyCodeMapping");
const EmployeeIdToNameMapping = require("../models/EmployeeIdToNameMapping");
const CompanyPrefix = require("../models/CompanyPrefixModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer storage configuration
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(
      __dirname,
      `../company-assets/${req.nextCompanyCode}`
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder created: ${folderPath}`);
    } else {
      console.log(`Folder already exists: ${folderPath}`);
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, "logo.png"); // Adjust the file extension if necessary
  },
});

const uploadImage = multer({ storage: imageStorage });

// Route handler
module.exports.addNewCompany = async (req, res, next) => {
  try {
    // Fetch all companies in sorted order to calculate the next company code
    const allCompanies = await Company.find().sort({ company_code: 1 });
    console.log("All companies: ", allCompanies);

    // Get the last used company code
    const lastCompanyCode = allCompanies.at(-1)?.company_code || 0; // Use 0 if no companies exist
    console.log("Last company code: ", lastCompanyCode);

    // New company code will be lastCompanyCode + 1
    const nextCompanyCode = lastCompanyCode + 1;
    req.nextCompanyCode = nextCompanyCode;

    console.log("Next Company Code:", nextCompanyCode);

    uploadImage.single("image")(req, res, async function (err) {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error uploading image", error: err.message });
      }

      // Now the file is uploaded, proceed with the rest of your logic
      const nextCompanyCode = req.nextCompanyCode;
      console.log("Next Company Code:", nextCompanyCode);

      const companyCode = req.cookies.companyCode;
      const jsonData = req.body.data;
      console.log("Body: ", req.body);
      console.log("Data: ", jsonData);
      console.log("File: ", req.file);

      // Parse JSON data
      let data;
      try {
        data = JSON.parse(jsonData);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Invalid JSON data", error: parseError.message });
      }

      // check if user is a super admin or not
      if (companyCode != 0) {
        return res.status(403).json({
          message: "You can't create a new company. You are not a super admin.",
          error: true,
        });
      }

      if (!data) {
        return res.status(400).json({ message: "Please provide all details." });
      }

      // Formatting data
      const new_company = new Company({
        company_name: data.company_name,
        company_code: req.nextCompanyCode,
        company_address: data.company_address,
        GST_number: data.GST_number,
        bank_details: data.bank_details,
        branches: data.branches,
        logo_url: `/company-assets/${req.nextCompanyCode}/logo.png`,
        asset_folder_path: `/company-assets/${req.nextCompanyCode}`,
      });

      // Save the new company
      await new_company.save();

      // Insert new entry in company prefix table
      await CompanyPrefix.create({
        company_name: data.company_name,
        company_code: req.nextCompanyCode,
        company_prefix: data.company_prefix,
      });

      res.status(201).json({
        success: true,
        message: "Company created successfully",
        data: new_company,
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating new company", error: error.message });
  }
};

module.exports.getAllEmployees = async (req, res, next) => {
  try {
    const { companyCode } = req.params;

    const company = await Company.findOne({ company_code: companyCode });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ employees: company.employees, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

module.exports.addNewEmployee = async (req, res, next) => {
  try {
    const { companyCode } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.json({
        message: "Please provide employee details.",
      });
    }

    // Email validation
    if (!validator.isEmail(data.email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format. Email must contain @" });
    }
    // Password validation
    if (
      !validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        message:
          "Invalid password. Password must be 8-12 characters long, contain at least one capital letter, and one special character.",
      });
    }
    // Contact validation
    if (
      !validator.isMobilePhone(`${data.contact}`, "any", { strictMode: false })
    ) {
      return res.status(400).json({
        message: "Invalid contact. Contact must be exactly 10 digits.",
      });
    }

    // Check if company exists
    const company = await Company.findOne({ company_code: companyCode });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if an employee with the same email already exists
    const employeeEmailExists = company.employees.some(
      (employee) =>
        employee.employee_details.email.toLowerCase() ===
        data.email.toLowerCase()
    );
    if (employeeEmailExists) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Check if an employee with same employee id already exists or not
    const employeeIDExists = company.employees.some(
      (employee) => employee.employee_id === data.employee_id
    );

    if (employeeIDExists) {
      return res
        .status(400)
        .json({ message: "This employee id already exists" });
    }

    // formatting and arranging data in suitable format before submitting
    const new_employee = {
      employee_id: data.employee_id,
      group_id: data.group_id,
      employee_details: {
        name: data.name,
        gender: data.gender,
        contact: data.contact,
        email: data.email,
      },
      personal_details: {
        pan: data.pan,
        aadharcard: data.aadharcard,
        personal_email: data.personal_email,
        date_of_birth: data.date_of_birth,
      },
      temporary_address: {
        state: data.temporary_address.state,
        city: data.temporary_address.city,
        pin_code: data.temporary_address.pin_code,
        address_line_1: data.temporary_address.address_line_1,
        address_line_2: data.temporary_address.address_line_2,
      },
      permanent_address: {
        state: data.permanent_address.state,
        city: data.permanent_address.city,
        pin_code: data.permanent_address.pin_code,
        address_line_1: data.permanent_address.address_line_1,
        address_line_2: data.permanent_address.address_line_2,
      },
      other_details: {
        marital_status: data.marital_status,
        passport: data.passport,
        father_name: data.father_name,
        mother_name: data.mother_name,
        blood_group: data.blood_group,
      },
      official_details: {
        role: data.role,
        designation: data.designation,
        department: data.department,
        reporting_manager: data.reporting_manager,
        direct_reportees: data.direct_reportees,
        joining_date: data.joining_date,
        employee_status: data.employee_status,
        payroll_type: data.payroll_type,
      },
      account_details: {
        bank_details: {
          account_name: data.account_name,
          account_number: data.account_number,
          ifsc_code: data.ifsc_code,
        },
        esi_number: data.esi_number,
        pf_number: data.pf_number,
      },
    };

    //hashing the password
    if (data.password) {
      new_employee.password = await bcrypt.hash(data.password, 12);
    }

    // Add new employee to the company's employees array
    company.employees.push(new_employee);
    await company.save();

    // inserting new entry in mapping table
    await EmailToCompanyCodeMapping.create({
      email: new_employee.employee_details.email.toLowerCase(),
      companyCode: companyCode,
    });

    await EmployeeIdToNameMapping.create({
      employee_id: data.employee_id,
      name: data.name,
      email: data.email,
      companyCode: companyCode,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: company.employees.at(-1),
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating new employee" });
  }
};

module.exports.editEmployeeData = async (req, res, next) => {
  try {
    const { companyCode, employeeId } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.json({
        message: "Please provide employee details.",
      });
    }

    // Email validation
    if (!validator.isEmail(data.email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format. Email must contain @" });
    }
    // Password validation
    if (
      !validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        message:
          "Invalid password. Password must be 8-12 characters long, contain at least one capital letter, and one special character.",
      });
    }
    // Contact validation
    if (
      !validator.isMobilePhone(`${data.contact}`, "any", { strictMode: false })
    ) {
      return res.status(400).json({
        message: "Invalid contact. Contact must be exactly 10 digits.",
      });
    }

    // Check if company exists
    const company = await Company.findOne({ company_code: companyCode });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === employeeId
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // updating data
    employee.group_id = data.group_id;
    employee.employee_details.name = data.name;
    employee.employee_details.gender = data.gender;
    employee.employee_details.contact = data.contact;
    employee.employee_details.email = data.email;

    employee.personal_details.pan = data.pan;
    employee.personal_details.aadharcard = data.aadharcard;
    employee.personal_details.personal_email = data.personal_email;
    employee.personal_details.date_of_birth = data.date_of_birth;

    employee.temporary_address.state = data.temporary_address.state;
    employee.temporary_address.city = data.temporary_address.city;
    employee.temporary_address.pin_code = data.temporary_address.pin_code;
    employee.temporary_address.address_line_1 =
      data.temporary_address.address_line_1;
    employee.temporary_address.address_line_2 =
      data.temporary_address.address_line_2;

    employee.permanent_address.state = data.permanent_address.state;
    employee.permanent_address.city = data.permanent_address.city;
    employee.permanent_address.pin_code = data.permanent_address.pin_code;
    employee.permanent_address.address_line_1 =
      data.permanent_address.address_line_1;
    employee.permanent_address.address_line_2 =
      data.permanent_address.address_line_2;

    employee.other_details.marital_status = data.marital_status;
    employee.other_details.passport = data.passport;
    employee.other_details.father_name = data.father_name;
    employee.other_details.mother_name = data.mother_name;
    employee.other_details.blood_group = data.blood_group;

    employee.official_details.role = data.role;
    employee.official_details.designation = data.designation;
    employee.official_details.department = data.department;
    employee.official_details.reporting_manager = data.reporting_manager;
    employee.official_details.direct_reportees = data.direct_reportees;

    employee.official_details.joining_date = data.joining_date;
    employee.official_details.employee_status = data.employee_status;
    employee.official_details.payroll_type = data.payroll_type;

    employee.account_details.bank_details.account_name = data.account_name;
    employee.account_details.bank_details.account_number = data.account_number;
    employee.account_details.bank_details.ifsc_code = data.ifsc_code;
    employee.account_details.esi_number = data.esi_number;
    employee.account_details.pf_number = data.pf_number;

    // Save the updated company document
    await company.save();

    res.status(200).json({
      success: true,
      message: "Employee details updated successfully",
      employee,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating employee details" });
  }
};

module.exports.fetchEmployeesNames = async (req, res, next) => {
  try {
    const { companyCode } = req.params;

    // Find the company by companyCode
    const company = await Company.findOne({ company_code: companyCode });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Extract the employees
    const employeesList = company.employees.map((employee) => ({
      name: employee.employee_details.name,
      employee_id: employee.employee_id,
    }));

    res.status(200).json({
      message: "Employees names fetched successfully",
      success: true,
      data: employeesList,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching employees names" });
  }
};

module.exports.getParticularEmployee = async (req, res, next) => {
  try {
    const { companyCode, employeeId } = req.params;

    // Find the company by companyCode
    const company = await Company.findOne({ company_code: companyCode });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (emp) => emp.employee_id === employeeId
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Employee details fetched successfully",
      success: true,
      data: employee,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching employee details" });
  }
};

module.exports.getCompanyPrefix = async (req, res, next) => {
  try {
    const result = await CompanyPrefix.find({});

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching details" });
  }
};

module.exports.generateEmployeeID = async (req, res, next) => {
  try {
    const { companyCode } = req.params;

    // Find the company and its prefix
    const companyPrefixData = await CompanyPrefix.findOne({
      company_code: companyCode,
    });
    console.log(companyPrefixData);

    if (!companyPrefixData) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Find employees of company
    const company = await Company.findOne({ company_code: companyCode });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    const lastEmployeeID = company.employees.at(-1).employee_id;
    console.log(lastEmployeeID);

    const companyPrefixCode = companyPrefixData.company_prefix;
    const lastIdNum = parseInt(lastEmployeeID.split("-")[1], 10);

    const newId =
      companyPrefixCode + "-" + (lastIdNum + 1).toString().padStart(4, "0");

    res.status(200).json({ success: true, new_id: newId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating new id." });
  }
};

module.exports.getEmployeeinBulk = async (req, res, next) => {
  try {
    const { companyCode } = req.params;
    const filePath = req.file.path;
    // Read Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    // Find the company
    const company = await Company.findOne({ company_code: companyCode });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Get headers
    const headers = worksheet.getRow(1).values.slice(1);

    const newEmployees = [];
    const errors = [];

    // Process rows
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const employeeData = {};

      headers.forEach((header, index) => {
        employeeData[header.toLowerCase().replace(/\s+/g, "_")] = row.getCell(
          index + 1
        ).value;
      });

      // Validate employee data
      if (!validator.isEmail(employeeData.email)) {
        errors.push(`Row ${i}: Invalid email format`);
        continue;
      }

      if (
        !validator.isMobilePhone(`${employeeData.contact}`, "any", {
          strictMode: false,
        })
      ) {
        errors.push(`Row ${i}: Invalid contact number`);
        continue;
      }

      // Check if employee already exists
      const employeeExists = company.employees.some(
        (emp) =>
          emp.employee_details.email.toLowerCase() ===
            employeeData.email.toLowerCase() ||
          emp.employee_id === employeeData.employee_id
      );

      if (employeeExists) {
        errors.push(`Row ${i}: Employee with this email or ID already exists`);
        continue;
      }

      // Create new employee object
      const newEmployee = {
        employee_id: employeeData.employee_id,
        group_id: employeeData.group_id,
        employee_details: {
          name: employeeData.name,
          gender: employeeData.gender,
          contact: employeeData.contact,
          email: employeeData.email,
        },
        password: await bcrypt.hash(
          employeeData.password || "defaultPassword123",
          12
        ),
        personal_details: {
          pan: employeeData.pan,
          aadharcard: employeeData.aadharcard,
          personal_email: employeeData.personal_email,
          date_of_birth: employeeData.date_of_birth,
        },
        temporary_address: {
          state: employeeData.temp_state,
          city: employeeData.temp_city,
          pin_code: employeeData.temp_pin_code,
          address_line_1: employeeData.temp_address_line_1,
          address_line_2: employeeData.temp_address_line_2,
        },
        permanent_address: {
          state: employeeData.perm_state,
          city: employeeData.perm_city,
          pin_code: employeeData.perm_pin_code,
          address_line1: employeeData.perm_address_line_1,
          address_line2: employeeData.perm_address_line_2,
        },
        other_details: {
          marital_status: employeeData.marital_status,
          passport: employeeData.passport,
          father_name: employeeData.father_name,
          mother_name: employeeData.mother_name,
          blood_group: employeeData.blood_group,
        },
        official_details: {
          role: employeeData.role,
          designation: employeeData.designation,
          department: employeeData.department,
          reporting_manager: employeeData.reporting_manager,
          joining_date: employeeData.joining_date,
          employee_status: employeeData.employee_status,
          payroll_type: employeeData.payroll_type,
        },
        account_details: {
          bank_details: {
            account_name: employeeData.account_name,
            account_number: employeeData.account_number,
            ifsc_code: employeeData.ifsc_code,
          },
          esi_number: employeeData.esi_number,
          pf_number: employeeData.pf_number,
        },
        created_at: new Date(),
      };

      newEmployees.push(newEmployee);
    }

    company.employees.push(...newEmployees);
    await company.save();

    for (const employee of newEmployees) {
      await EmailToCompanyCodeMapping.create({
        email: employee.employee_details.email.toLowerCase(),
        companyCode: companyCode,
      });

      await EmployeeIdToNameMapping.create({
        employee_id: employee.employee_id,
        name: employee.employee_details.name,
        email: employee.employee_details.email,
        companyCode: companyCode,
      });
    }

    res.status(200).json({
      success: true,
      message: `${newEmployees.length} employees added successfully`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing employee data" });
  }
};
