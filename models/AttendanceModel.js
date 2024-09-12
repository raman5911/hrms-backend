const mongoose = require("mongoose");

const Attendance_Schema = new mongoose.Schema({
    Employee_Id: {
        type: String
    },
    company_code: {
        type: Number
    },
    punch_in_time: {
        type: Date
    },
    punch_out_time: {
        type: Date
    },
    date: {
        type: Date
    },
    opened: {
        type: Boolean
    },
    status: {
        type: String
    }
});

const Attendance = mongoose.model("Attendance", Attendance_Schema);

module.exports = Attendance;