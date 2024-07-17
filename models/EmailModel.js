const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: [true, "Give this template a name for identification."]
    },
    category: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("MailTemplate", emailSchema);