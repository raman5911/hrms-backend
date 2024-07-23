const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Employee schema
const EmployeeSchema = new mongoose.Schema({
  Employee_Id: {
    type: "String",
    required: [true, "Employee ID is required"],
    unique: false,
  },
  Company: {
    type: String,
    // required: [true, "Your company is required"],
  },
  Employee_details: {
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
    },
  },
  Personal_details: {
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
    temporary_address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
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
  Permanent_address: {
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
    marital_status: {
      type: String,
    },
    passport: {
      type: String,
    },
    password: {
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
    },
  Official_details: {
    role: {
      // List of roles
      type: String,
    },
    designation: {
      // List of designation
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
    direct_reportees: [
      {
        type: String,
      },
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
      Ifsc_code: {
        type: Number,
      },
    },
    esi_number: {
      type: Number,
    },
    pf_number: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// hashing the password before saving in db
EmployeeSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});
// EmployeeSchema.index({ Employee_Id: 2 }, { unique: true });
module.exports = mongoose.model("Employee", EmployeeSchema);
