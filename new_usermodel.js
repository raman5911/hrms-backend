// db schema

// hr request schema
const hr_request_schema = new mongoose.Schema({
    id: {
        type: "String",                     // created at time of request creation
        required: [true, "ID is required"],
        unique: true
    },

    title: {
        type: "String"
    },
    description: {
        type: "string"
    },

    requested_by: {
        type: "String"
    },

    approvals: [{
        level: Number, // Level of approval (1 to 4)
        approverId: { 
            type: "String" 
        },
        status: {
            type: "String",
            default: null // Status at this level: null (if a level is pending then lvls higher than it cant be pending), 'Pending', 'Approved', 'Rejected'
        },
        response: {
            type: "String"
        },
        approved_at: {
            type: Date
        }
    }],

    created_at: {
        type: Date,
        default: Date.now,
    }
});

// leave request schema
const leave_request_schema = new mongoose.Schema({
    id: {
        type: "String",                     // created at time of request creation
        required: [true, "ID is required"],
        unique: true
    },
    num_of_days: {
        type: "Number"
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    reason: {
        type: "string"
    },
    leave_type: {
        type: "String"
    },
    
    requested_by: {
        type: "String"
    },

    approvals: [{
        level: Number, // Level of approval (1 to 4)
        approverId: { 
            type: "String" 
        },
        status: {
            type: "String",
            default: null // Status at this level: null (if a level is pending then lvls higher than it cant be pending), 'Pending', 'Approved', 'Rejected'
        },
        response: {
            type: "String"
        },
        approved_at: {
            type: Date
        }
    }],
    
    created_at: {
        type: Date,
        default: Date.now,
    }
});

//it equipment request schema
const it_equip_request_schema = new mongoose.Schema({
    id: {
        type: "String",                     // created at time of request creation
        required: [true, "ID is required"],
        unique: true
    },
    device_type: {
        type: "String"
    },
    name_modal_num: {
        type: "String"
    },
    problem: {
        type: "String"
    },
    
    requested_by: {
        type: "String"
    },

    approvals: [{
        level: Number, // Level of approval (1 to 4)
        approverId: { 
            type: "String" 
        },
        status: {
            type: "String",
            default: null // Status at this level: null (if a level is pending then lvls higher than it cant be pending), 'Pending', 'Approved', 'Rejected'
        },
        response: {
            type: "String"
        },
        approved_at: {
            type: Date
        }
    }],
    
    created_at: {
        type: Date,
        default: Date.now,
    }
});

// user schema
const user = new mongoose.Schema({
    userID: {
        type: "String",
        required: [true, "Employee ID is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    full_name: {
        type: "String"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    designation: {
        type: "String"
    },
    dept_tag: {
        type: "String"
    },
    employer_id: {
        type: "String",
        unique: true
    },
    hr_id: {
        type: "String",
        unique: true
    },
    it_dept_person_id: {
        type: "String",
        unique: true
    },
    employees_id: {
        type: [String]
    },
    
    // hr_requests: [hr_request_schema],               // array of hr requests
    // leave_requests: [leave_request_schema],         // array of leave requests
    // it_equip_requests: [it_equip_request_schema]    // array of it equip requests
});

// Create the models
const HRRequest = mongoose.model('HRRequest', hr_request_schema);
const LeaveRequest = mongoose.model('LeaveRequest', leave_request_schema);
const ITEquipRequest = mongoose.model('ITEquipRequest', it_equip_request_schema);
const User = mongoose.model('User', userSchema);


