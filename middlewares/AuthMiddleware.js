const jwt = require('jsonwebtoken');
const Company = require('../models/CompanyModel');

module.exports.authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    if (!decoded || !decoded.id || !decoded.companyCode) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the company based on the company code
    const company = await Company.findOne({ company_code: decoded.companyCode });

    if (!company) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the employee based on the decoded ID within the specific company
    const employee = company.employees.find(emp => emp._id.toString() === decoded.id);

    if (!employee) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the employee to the request object
    req.employee = employee;
    req.company = company;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
