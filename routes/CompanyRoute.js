const router = require("express").Router();
const { getAllEmployees, addNewEmployee, editEmployeeData, fetchEmployeesNames, getParticularEmployee } = require("../controllers/CompanyController");

router.get('/:companyCode/employees', getAllEmployees);
router.get('/:companyCode/employees-names', fetchEmployeesNames);
router.get('/:companyCode/employee/:employeeId', getParticularEmployee);

router.post('/:companyCode/create-employee', addNewEmployee);
router.put('/:companyCode/edit-employee/:employeeId', editEmployeeData);

module.exports = router;