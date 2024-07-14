const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// user schema
const userSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: new Date(),
    },
    name: {
        type: "String"
    },
    role: {
        type: "String"
    },
    designation: {
        type: "String"
    },
    req_dept: {
        type: "String"
    },
    req_subject: {
        type: "String"
    },
    req_desc: {
        type: "String"
    },
    req_status: {
        type: "String"
    },
    others_req: {
        type: "String"    
    }
});

// hashing the password before saving in db
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);