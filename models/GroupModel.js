const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    members: [{
        companyCode: {
            type: Number
        },
        employee_name: {
            type: String
        },
        employee_id: {
            type: String
        }
    }],
    leave_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    wfh_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    new_asset_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    repair_asset_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    hr_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
