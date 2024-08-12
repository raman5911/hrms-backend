const mongoose = require('mongoose');

const EmployeeIdToNameMappingSchema = new mongoose.Schema({
    employee_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    companyCode: { type: Number, required: true },
  });
  
  const EmployeeIdToNameMapping = mongoose.model('EmployeeIdToNameMapping', EmployeeIdToNameMappingSchema);
  
  module.exports = EmployeeIdToNameMapping;