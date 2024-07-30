const router = require("express").Router(); // By Shivam
const { employeeLeave } = require("../controllers/RequestHandleController");
const { Workfromhome } =  require("../controllers/RequestHandleController");
const { newAsset } = require("../controllers/RequestHandleController");
const { requesttoHR } = require("../controllers/RequestHandleController");
router.post('/leave', employeeLeave );
router.post('/Workfromhome', Workfromhome );
router.post('/newAsset', newAsset );
router.post('/requesttoHR', requesttoHR );
module.exports = router;
