const mongoose = require("mongoose");
const employee_leave = new mongoose.Schema({
    start_date:{
        type: Date,
    },
    end_date:{
        type: Date,
    },
    leave_type:{
        type: String,
    },
    number_of_days:{
        type: Date,
    },
    reason:{
        type: String,
    },
    title:{
        type: String,
    },
    Asset_name:{
        type: String,
    }
}
)
module.exports = mongoose.model("Request", employee_leave);
