const mongoose = require("mongoose")

const employeeDetailsSchema = new mongoose.Schema({
    employee_id: {
        type: String
    },
    type: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    reason: {
        type: String
    },
    asset: {
        type: String
    },
    subject: {
        type: String
    },

    approve_details: [
        {
            approver_name: {
                type: String
            },
            approved_status: {
                type: String
            },
            approved_date: {
                type: Date,
                default: Date.now  // This sets the default value to the current date/time
            }
        }
    ]


})
const EmployeeDetails = mongoose.model('EmployeeDetails', employeeDetailsSchema);

module.exports = EmployeeDetails;