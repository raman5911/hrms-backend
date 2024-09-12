const mongoose = require("mongoose");

const Policy_Schema = new mongoose.Schema({
    company_code: {
        type: Number
    },
    working_hours: {
        type: Number
    },
    punch_in_time: {
        type: Date
    }
});

const Policy = mongoose.model("Policy", Policy_Schema);

module.exports = Policy;