const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: [true, "Employee ID is required"],
        // unique: true,
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    employee_details: {
        name: {
            type: String,
            required: [true, "Your name is required"],
        },
        gender: {
            type: String,
            // required: [true, "Your gender is required"],
        },
        contact: {
            type: Number,
            required: [true, "Your contact is required"],
        },
        email: {
            type: String,
            required: [true, "Your email is required"],
            unique: true
        },
    },
    password: {
        type: String,
    },
    personal_details: {
        pan: {
            type: String,
        },
        aadharcard: {
            type: Number,
        },
        personal_email: {
            type: String,
        },
        date_of_birth: {
            type: Date,
        },

    },
    temporary_address: {
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        pin_code: {
            type: Number,
        },
        address_line_1: {
            type: String,
        },
        address_line_2: {
            type: String,
        },
    },
    permanent_address: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pin_code: {
            type: Number,
        },
        address_line1: {
            type: String,
        },
        address_line2: {
            type: String,
        },
    },
    other_details: {
        marital_status: {
            type: String,
        },
        passport: {
            type: String,
        },

        father_name: {
            type: String,
        },
        mother_name: {
            type: String,
        },
        blood_group: {
            type: String,
        }
    },
    official_details: {
        role: {
            // List of roles
            type: String,
        },
        designation: {
            // List of designations
            type: String,
        },
        department: {
            // List of departments
            type: String,
        },
        reporting_manager: {
            // list of managers
            type: String,
        },
        direct_reportees: [{
            reportees_id: {
                type: String
            },
            reportees_name: {
                type: String,
            }
        }
        ],
        joining_date: {
            type: Date,
        },
        employee_status: {
            type: String,
        },
        payroll_type: {
            type: String,
        },
    },
    account_details: {
        bank_details: {
            account_name: {
                type: String,
            },
            account_number: {
                type: String,
            },
            ifsc_code: {
                type: String,
            },
        },
        esi_number: {
            type: Number,
        },
        pf_number: {
            type: Number,
        },
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
});

const CompanySchema = new mongoose.Schema({
    company_name: {
        type: String,
    },
    company_code: {
        type: Number,
    },
    employees: [EmployeeSchema],
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;