const mongoose = require("mongoose");

const Company_Prefix_Schema = new mongoose.Schema({
    company_name: {
        type: String,
    },
    company_code: {
        type: Number,
    },
    company_prefix: {
        type: String
    }
});

const CompanyPrefix = mongoose.model("CompanyPrefix", Company_Prefix_Schema);

module.exports = CompanyPrefix;