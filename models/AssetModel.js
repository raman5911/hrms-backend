const mongoose = require("mongoose");

const Asset_Schema = new mongoose.Schema({
    brand_name: {
        type: String
    },
    model_number: {
        type: String
    }
});

const Asset = mongoose.model("Asset", Asset_Schema);

module.exports = Asset;