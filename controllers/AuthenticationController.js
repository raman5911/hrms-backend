const Employee = require("../models/new_usermodel1");
const { createPrivateToken } = require("../util/PrivateToken");
const bcrypt = require("bcryptjs");
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const xss = require('xss');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Security to express apps by implementing multiple HTTP headers
const helmet = require('helmet');

// To control domains which can access API
const cors = require('cors');;

// Email validation function
const isValidEmail = (email) => {
    return email.includes('@');
};

// Password validation function
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
    return passwordRegex.test(password);
};

// Contact validation function
const isValidContact = (contact) => {
    return /^\d{10}$/.test(contact);
};
module.exports.signup=[limiter, helmet(), cors({origin: 'https://yourdomain.com',credentials: true}),
     async (req, res, next) =>{
     try { 
        // getting user input
         const { name,email, password,contact } = req.body;
         // if any field is empty
        if (!email || !password || !name || !contact) {
        return res.json({ message: 'All fields are required' })
        }
        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format. Email must contain @' });
        }
        // Password validation
        if (!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ 
                message: 'Invalid password. Password must be 8-12 characters long, contain at least one capital letter, and one special character.'
            });
        }
        // Contact validation
        if (!validator.isMobilePhone(contact, 'any', { strictMode: false })) {
            return res.status(400).json({ message: 'Invalid contact. Contact must be exactly 10 digits.' });
        }
        const sanitizedName = xss(name);
       // const employee_id = Date.now().toString();
        const newEmployee = {
            Employee_Id: "HR07",
            Employee_details:{
              name: sanitizedName,
              contact: contact,
              email: email.toLowerCase(),
            },
            password: password,
        };
          console.log(newEmployee);
        //finding if user already exists
        const ifExist = await Employee.findOne({ 'Employee_details.email': email.toLowerCase()});
        console.log(ifExist)
        // if exists, return error
        if (ifExist) {
        res.status(404).send("You are already signed in!");
        }
        // create new user
         const new_Employee = await Employee.create(newEmployee);
         console.log(new_Employee);
 
         // create new secret token
         const token = createPrivateToken(newEmployee);
 
         // creating and sending cookie to client's browser
         res.cookie("token", token, {
             withCredentials: true,
             httpOnly: false,
             
         });
 
         // sending response
         res
             .status(201)
             .json({ message: "Employee signed up successfully", success: true,
             Employee: {
                 email: newEmployee.email,
                 name: newEmployee.name, 
                 contact: newEmployee.contact,
                 } 
                });
         next();
 
     } catch (error) {
         console.error(error);
     }
 }];
 module.exports.signIN = async (req, res, next) => {
    try {
        // getting user input
        const { email, password } = req.body;

        // if any field is empty
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }

        // if user not found
        const ifUserExist = await Employee.findOne({ 'Employee_details.email': email});
        console.log(ifUserExist)

        if (!ifUserExist) {
            return res.json({ message: 'Incorrect password or email 1' })
        }

        console.log(ifUserExist.password);

        const isPasswordValid = await bcrypt.compare(password, ifUserExist.password)
        if (!isPasswordValid) {
            return res.json({ message: 'Incorrect password or email 2' })
        }

        const token = createPrivateToken(ifUserExist._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "Employee logged in successfully",
             success: true,
            Employee: { email: ifUserExist.Employee_details.email, 
            Employee_Id: ifUserExist.Employee_Id
             }
             });

        next();

    } catch (error) {
        console.error(error);
    }
}