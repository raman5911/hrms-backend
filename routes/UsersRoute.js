const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleware");
const { fetchUsersList } = require("../controllers/UserDetailsController");
const { fetchEmployee, postEmployee, putemployee } = require("../controllers/UserDetailsController");

router.get('/list', fetchUsersList);
router.get('/get_all', fetchEmployee);
router.post('/post', postEmployee );
router.put('/employees/employeeId', putemployee);
module.exports = router;