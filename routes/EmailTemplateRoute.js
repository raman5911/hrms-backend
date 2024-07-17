const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleware");
const { fetchTemplateList, createNewTemplate } = require("../controllers/EmailTemplateController");

router.get('/fetch_list', fetchTemplateList);
router.post('/create', createNewTemplate);

module.exports = router;