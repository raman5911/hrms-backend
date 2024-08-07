const router = require("express").Router();
const { getAllGroups, createGroup, editGroup, getGroupNameAndId, addNewMember, removeMember, getGroupMembers, getNonGroupMembers, addMembersInBulk } = require("../controllers/GroupController");

router.get("/get_all", getAllGroups);
router.get("/list", getGroupNameAndId);
router.get("/:groupId/view-members", getGroupMembers);
router.get("/get-non-group-members", getNonGroupMembers);

router.post("/create-new", createGroup);
router.put("/edit/:id", editGroup);
router.put("/:groupId/add-member", addNewMember);
router.delete("/:groupId/remove-member", removeMember);
router.put("/:id/add-members-in-bulk", addMembersInBulk);

module.exports = router;