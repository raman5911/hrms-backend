// code not completed yet

const cron = require('node-cron');
const Attendance = require("../models/AttendanceModel");
const Company = require("../models/CompanyModel");

// Schedule the cron job to run everyday at 2 AM for marking absent
cron.schedule('0 2 * * *', async () => {
    console.log('Running reminder job everyday at 2AM ...');

    try {
        const companies = await Company.find({});
        var new_entries = [];

        companies.forEach(async (company) => {
            const employees = company.employees;

            employees.forEach(async (employee) => {
                const entry = Attendance.findOne({ Employee_Id: employee.employee_id, date: "" });

                if(!entry) {
                    new_entries.push({
                        "Employee_Id": employee.employee_id,
                        "company_code": company.company_code,
                        "date": "",
                        "opened": false,
                        "punch_in_time": null,
                        "punch_out_time": null,
                        "status": "Absent"
                    });
                }
            });
        });

        await Attendance.create(new_entries);
    
    } catch (error) {
        throw new Error(error);
    }
});

// Schedule the cron job to run everyday at 2 AM for marking miss punch out
cron.schedule('0 2 * * *', async () => {
    console.log('Running reminder job everyday at 2AM ...');

    try {
        const companies = await Company.find({});

        companies.forEach(async (company) => {
            const employees = company.employees;

            employees.forEach(async (employee) => {
                const entry = Attendance.findOne({ Employee_Id: employee.employee_id, date: "" });

                if(!entry) {
                    new_entries.push({
                        "Employee_Id": employee.employee_id,
                        "company_code": company.company_code,
                        "date": "",
                        "opened": false,
                        "punch_in_time": null,
                        "punch_out_time": null,
                        "status": "Absent"
                    });
                }
            });
        });

        await Attendance.create(new_entries);
    
    } catch (error) {
        throw new Error(error);
    }
});

