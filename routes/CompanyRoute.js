const router = require("express").Router();
const { getAllEmployees, addNewEmployee, editEmployeeData, fetchEmployeesNames, getParticularEmployee, getCompanyPrefix, generateEmployeeID, addNewCompany } = require("../controllers/CompanyController");

router.get('/get_company_prefixes', getCompanyPrefix);

router.get('/:companyCode/employees', getAllEmployees);
router.get('/:companyCode/employees-names', fetchEmployeesNames);
router.get('/:companyCode/employee/:employeeId', getParticularEmployee);

router.post('/new', addNewCompany);
router.post('/:companyCode/generate-employee-id', generateEmployeeID);
router.post('/:companyCode/create-employee', addNewEmployee);
router.put('/:companyCode/edit-employee/:employeeId', editEmployeeData);

module.exports = router;