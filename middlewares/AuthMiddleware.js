const User = require("../models/UserModel");
const Employee = require('../models/new_usermodel1');
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token;

    // if token is not present return false
    if (!token) {
        return res.json({ status: false })
    }

    // else verify token
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id)
            
            if (user) 
            {
                // return res.json({ status: true, user: user.username });

                return res.json({ status: true });
            } 

            else 
                return res.json({ status: false })
        }
    })
}

module.exports.authMiddleware = async (req, res, next) => {
    try {
      // Get the token from the request cookies
      const token = req.cookies.token;

      console.log(req);

      console.log('token value : ');
      console.log(token);
  
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

      console.log('jwt verify');
      console.log(decoded);
  
      // Find the employee based on the decoded ID
      const employee = await Employee.find({ Employee_Id: decoded.id.Employee_Id });
  
      if (!employee) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // Attach the employee to the request object
      req.employee = employee;

      console.log(req);
  
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  