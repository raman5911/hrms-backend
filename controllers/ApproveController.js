//MADE BY ANANDITA--------------------------------------------> 
//Made this API for updating the approval details of the employee...
const express = require('express');
const mongoose = require('mongoose');
const EmployeeDetails = require('../models/EmployeeModel');
//const Employee = require('../models/new_usermodel1');
const router = express.Router();
const app = express();



module.exports.approver = async (req, res, next) => { 

    try {
        const { Req_id, approver_name, approved_status, employee_id, Req_type, asset, start_date, end_date, reason, subject } = req.body;
        console.log("Request body:", req.body);
        let employeeDetail = await EmployeeDetails.findOne({ Req_id: Req_id }); //checking first if req_id is there or not

        if (!employeeDetail) {
            console.log("Creating new EmployeeDetails");
            // If not found, create a new one
            employeeDetail = new EmployeeDetails({
                Req_id: Req_id,
                employee_id: employee_id,
                Req_type: Req_type,
                asset: asset,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                reason: reason,
                subject: subject,
                approve_details: []
            });
        } 
        else {
            console.log("Updating existing EmployeeDetails");
            employeeDetail.employee_id = employee_id;
            employeeDetail.Req_type = Req_type;
            employeeDetail.asset = asset;
            employeeDetail.start_date = new Date(start_date);
            employeeDetail.end_date = new Date(end_date);
            employeeDetail.reason = reason;
            employeeDetail.subject = subject;
        }
        const updated_Employee = {  //updating the employee details in a new constant
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            reason: reason,
            asset: asset,
            subject: subject,
            Req_type: Req_type,
            Req_id: Req_id,
        }
        console.log(updated_Employee);
        await employeeDetail.save();


        employeeDetail.approve_details = employeeDetail.approve_details || [];
        employeeDetail.approve_details.push({
            approver_name,
            approved_status,
            approved_date: new Date()
        });  //pushing/updating the approval details
        console.log("Employee Details before save:", employeeDetail);


        const savedEmployeeDetail = await employeeDetail.save();
        console.log("Saved Employee Details:", savedEmployeeDetail);
        //if the employee details match then log: approval status updated 

        res.status(200).json({ message: "Approval status updated successfully" });
    } catch (error) {
        console.error("Error in approver function:", error);
        res.status(500).json({ message: "Server error" });
    } //otherwise log : Server error 
};



