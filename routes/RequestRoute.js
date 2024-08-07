const router = require("express").Router(); // By Shivam
const { employeeLeave, WorkFromHome, newAsset, repairAsset, requestToHR} = require("../controllers/RequestHandleController");
router.post('/leave', employeeLeave );
router.post('/work_from_home', WorkFromHome );
router.post('/new_asset', newAsset );
router.post('/repair_asset', repairAsset );
router.post('/request_to_hr', requestToHR );
module.exports = router;
