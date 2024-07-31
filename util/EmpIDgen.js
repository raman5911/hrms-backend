// MADE BY ANANDITA-------------------------------------------------> 
// Made this code for checking and then generating the employee IDs------------------->
// Object to store the ID counters  
const express = require('express'); 
const mongoose = require('mongoose');
const app = express();
const Employee = require("../models/new_usermodel1");

// Function to check if Employee ID exists
async function checkEmployeeIdExists(employeeId) {
    try {
        const employee = await Employee.findOne({ Employee_Id: employeeId });
        //console.log("hello");
        return employee;
    } catch (error) {
        console.error('Error checking employee ID:', error);
        throw error;
    }
}

module.exports.checkEmployeeIdExistsEndpoint = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const exists = await checkEmployeeIdExists(employeeId);
        res.json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking the employee ID' });
    }
};

// To generate a new unique Employee ID
module.exports.generateEmployeeId = async (req, res, next) => {
    try {
        const { prefix } = req.body;
        if (!prefix) {
            return res.status(400).json({ error: 'Prefix is required' });
        }

        let newId;
        let exists = true;
        let counter = 1;

        while (exists) {
            newId = `${prefix}-${counter.toString().padStart(3, '0')}`;
            exists = await checkEmployeeIdExists(newId);
            counter++;

        }

        res.json({ employeeId: newId });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while generating the employee ID' });
    }
}; 
