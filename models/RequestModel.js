const mongoose = require("mongoose"); // By anandita

const Request_Schema = new mongoose.Schema({
    requestor_id: {
        type: String ,
        required: true
    }, 
    request_type: {
        type: String
    },
    leave_type: {
      type: String
    },
    number_of_days: {
      type: Number
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
    new_asset_type: {
      type: String
    },
    repair_asset: {
        brand_name: {
          type: String
        },
        model_number: {
          type: String
        },
        asset_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Asset'
        }
    },
    subject: {
        type: String
    },
    reminder_days: {
      type: Number
    },

    list_of_approvers: [
      {
        employee_id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        email_id: {
          type: String,
          required: true
        }
      }
    ],

    accepted_array: [
      {
        approver_name: {
          type: String
        },
        approver_id: {
          type: String
        },
        action_date: {
          type: Date
        },
        remarks: {
          type: String
        }
      }
    ],
    rejected_array: [
      {
        approver_name: {
          type: String
        },
        approver_id: {
          type: String
        },
        action_date: {
          type: Date
        },
        remarks: {
          type: String
        }
      }
    ],
    
    completed_or_not: {
      type: Boolean
    },
    current_approver_id: {
      type: String
    },
    current_level: {
      type: Number
    },

    raised_on: {
      type: Date,
      default: new Date()
    }
});

const EmployeeDetails = mongoose.model('Request', Request_Schema);

module.exports = EmployeeDetails; 
