const mongoose = require("mongoose"); // By anandita

const Request_Schema = new mongoose.Schema({
    employee_id: {
        type: String ,
        required: true
    }, 
    Req_id: { 
        type: String, 
        required:true
    }, 
    Req_type: {
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
        type: String,
      },
      approved_status: {
        type: String,
      },
      approved_date: {
        type: Date,
        default: Date.now, // This sets the default value to the current date/time
      },
    },
  ],
});

const EmployeeDetails = mongoose.model('RequestModel', Request_Schema);

module.exports = EmployeeDetails; 
