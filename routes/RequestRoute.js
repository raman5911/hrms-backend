const router = require("express").Router(); // By Shivam
const { employeeLeave, WorkFromHome, newAsset, repairAsset, requestToHR, getRequestDetails, getAllRequestedByMe, getDirectReporteesRequest} = require("../controllers/RequestHandleController");

router.post('/leave', employeeLeave );
router.post('/work_from_home', WorkFromHome );
router.post('/new_asset', newAsset );
router.post('/repair_asset', repairAsset );
router.post('/request_to_hr', requestToHR );

router.get('/get_all_requested_by_me', getAllRequestedByMe);
router.get('/get_direct_reportees_request', getDirectReporteesRequest);

// define dynamic routes in end

module.exports = router;
