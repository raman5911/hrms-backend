const express = require('express');
const mongoose = require('mongoose');
const EmployeeDetails = require('../models/Employeedetails'); 


const app = express();
app.use(express.json());

app.post( async (req, res) => {
    
});

module.exports.approver = async (req, res, next) => {
    try {
        const { employee_id, approver_name, approved_status } = req.body;
        const employee = await EmployeeDetails.findOne({ employee_id: employee_id }); 
        console.log(employee_id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        employee.approve_details.push({
            approver_name: approver_name,
            approved_status: approved_status,
            approved_date: new Date()
        });

        await employee.save();

        res.status(200).json({ message:"Approval status updated successfully", employee: employee });
    } catch (error) { 

        console.error(error);
        res.status(500).json({ message: "Server error" });            

    }
} 
