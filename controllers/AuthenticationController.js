const Company = require("../models/CompanyModel");
const EmailToCompanyCodeMapping = require("../models/EmailToCompanyCodeMapping");
const bcrypt = require("bcryptjs");
const { createPrivateToken } = require("../util/PrivateToken");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const mapping = await EmailToCompanyCodeMapping.findOne({
      email: email.toLowerCase(),
    });
    if (!mapping) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const company = await Company.findOne({
      company_code: mapping.companyCode,
    });

    if (!company) {
      return res.json({ message: "Company not found" });
    }

    const employee = company.employees.find(
      (emp) => emp.employee_details.email.toLowerCase() === email.toLowerCase()
    );

    if (!employee) {
      return res.json({ message: "Incorrect email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.json({ message: "Incorrect email or password" });
    }

    const token = createPrivateToken(employee._id, mapping.companyCode);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours in milliseconds
    //   sameSite: "Strict",
    });

    res.cookie("employee_id", employee.employee_id, {
      maxAge: 72 * 60 * 60 * 1000, // 72 hours in milliseconds
      // secure: true,
    //   sameSite: "Strict",
    });
    res.cookie("companyCode", mapping.companyCode, {
      maxAge: 72 * 60 * 60 * 1000, // 72 hours in milliseconds
      // secure: true,
    //   sameSite: "Strict",
    });

    res.status(201).json({
      message: "Employee logged in successfully",
      success: true,
      employee: {
        email: employee.employee_details.email,
        employee_id: employee.employee_id,
        company_code: mapping.companyCode,
      },
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
