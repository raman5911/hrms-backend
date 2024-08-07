const mongoose = require('mongoose');

const EmailToCompanyCodeMappingSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  companyCode: { type: String, required: true },
});

const EmailToCompanyCodeMapping = mongoose.model('EmailToCompanyCodeMapping', EmailToCompanyCodeMappingSchema);

module.exports = EmailToCompanyCodeMapping;
