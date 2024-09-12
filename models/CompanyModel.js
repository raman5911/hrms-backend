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
    company_address: {
        type: String
    },
    GST_number: {
        type: String
    },
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
    branches: [
        {
            name: {
                type: String
            },
            GST_number: {
                type: String
            },
            address: {
                type: String
            },
            location: {
                type: {
                    type: String, 
                    enum: ['Point'], // Ensures that the 'type' is always 'Point'
                },
                coordinates: {
                    type: [Number], // Array of numbers: [longitude, latitude]
                }
            },
            admin_contact: {
                type: String
            },
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
            category: {
                type: String
            }
        }
    ],
    logo_url: {
        type : String
    },
    asset_folder_path: {
        type: String
    },
    reminder_days: {
        type: Number
    },
    main_office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    category: {
        type: String
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], // Ensures that the 'type' is always 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [latitude, longitude]
            required: true
        }
    },
    radius_area: {          // in meters
        type: Number
    },
    employees: [EmployeeSchema]
});

// Create a 2dsphere index to enable geospatial queries
CompanySchema.index({ location: '2dsphere' });

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;