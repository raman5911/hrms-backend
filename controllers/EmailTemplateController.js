const MailTemplate = require("../models/EmailModel");

module.exports.fetchTemplateList = async (req, res, next) => {
    try {
        const data = await MailTemplate.find({},{});

        res.status(200).json({ message: "Data fetched successfully", success: true, data: data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching template lists' });
    }
}

module.exports.createNewTemplate = async (req, res, next) => {
    try {
        const { name, category } = req.body;

        const template = await MailTemplate.create({ name, category });

        console.log(template);

        res.status(201).json({ message: "Template created successfully", success: true, data: template });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating new template' });
    }
}