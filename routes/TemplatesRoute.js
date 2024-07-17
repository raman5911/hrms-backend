const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleware");
const { fetchAll, createNew, editTemplate, deleteTemplate } = require("../controllers/TemplateController");

router.get('/fetch_all', fetchAll);
router.post('/create', createNew);
router.put('/update/:id', editTemplate);
router.delete('/delete/:id', deleteTemplate);

module.exports = router;