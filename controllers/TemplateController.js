const Template = require("../models/TemplateModel");
const mongoose = require('mongoose');

module.exports.fetchAll = async (req, res, next) => {
    try {
        const data = await Template.find({}, {});

        res.status(200).json({ message: "Data fetched successfully", success: true, data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching template data' });
    }
};

module.exports.createNew = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, type, emailTemplate, remainderEmailTemplate, responseEmailTemplate, levelOfApproval, approvers, tableRows } = req.body;

        if (!name || !emailTemplate || !remainderEmailTemplate || !responseEmailTemplate || !levelOfApproval) {
            return res.json({ message: 'All fields are required except custom fields' });
        }

        const newTemplate = {
            name: name,
            type: type !== undefined ? type : -1,
            levelOfApproval: levelOfApproval,
            approvers: approvers !== undefined ? approvers : [],
            emailTemplate: new mongoose.Types.ObjectId(`${emailTemplate.id}`),
            remainderEmailTemplate: new mongoose.Types.ObjectId(`${remainderEmailTemplate.id}`),
            responseEmailTemplate: new mongoose.Types.ObjectId(`${responseEmailTemplate.id}`),
            tableRows: tableRows !== undefined ? tableRows : [],
        };

        const data = await Template.create(newTemplate);

        res.status(201).json({ message: "Template created successfully", success: true, data: data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating new template' });
    }
};

module.exports.editTemplate = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate Template Id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid template ID", success: false });
        }

        const { name, emailTemplate, remainderEmailTemplate, responseEmailTemplate, levelOfApproval, tableRows } = req.body;

        if (!name || !emailTemplate || !remainderEmailTemplate || !responseEmailTemplate || !levelOfApproval) {
            return res.json({ message: 'All fields are required except custom fields' });
        }

        // Validate each ObjectId field
        if (!mongoose.isValidObjectId(emailTemplate) || !mongoose.isValidObjectId(remainderEmailTemplate) || !mongoose.isValidObjectId(responseEmailTemplate)) {
            return res.status(400).json({ message: "Invalid ObjectId in templates", success: false });
        }

        const updatedTemplate = {
            name: name,
            levelOfApproval: levelOfApproval,
            emailTemplate: new mongoose.Types.ObjectId(emailTemplate),
            remainderEmailTemplate: new mongoose.Types.ObjectId(remainderEmailTemplate),
            responseEmailTemplate: new mongoose.Types.ObjectId(responseEmailTemplate),
            tableRows: tableRows
        };

        // will find and update the document and return updated document
        const data = await Template.findByIdAndUpdate(id, updatedTemplate, { new: true });

        if (!data) {
            return res.status(404).json({ message: "Template not found", success: false });
        }

        res.status(200).json({ message: "Template updated successfully", success: true, data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while updating the template' });
    }
};

module.exports.deleteTemplate = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.isValidObjectId(id)) {
            console.log(`Invalid ID format: ${id}`);
            return res.status(400).json({ message: "Invalid template ID", success: false });
        }

        // Perform delete operation
        const data = await Template.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: "Template not found", success: false });
        }

        res.status(200).json({ message: "Template deleted successfully", success: true, data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while deleting the template' });
    }
};