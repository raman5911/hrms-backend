const mongoose = require("mongoose"); // By anandita

const Request_Schema = new mongoose.Schema({
    requestor_id: {
        type: String ,
        required: true
    }, 
    request_id: { 
        type: String, 
        // required:true
    }, 
    request_type: {
        type: String
    },
    leave_type: {
      type: String
    },
    number_of_days: {
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

    accepted_array: [],
    rejected_array: [],
    
    completed_or_not: {
      type: Boolean
    },
    current_approver_id: {
      type: String
    }
});

const EmployeeDetails = mongoose.model('Request', Request_Schema);

module.exports = EmployeeDetails; 
