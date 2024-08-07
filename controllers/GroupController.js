const Group = require("../models/GroupModel");
const Company = require("../models/CompanyModel");
const mongoose = require("mongoose");

// get all group records in the db - raman
module.exports.getAllGroups = async (req, res, next) => {
  try {
    const data = await Group.find({});

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching all groups data" });
  }
};

// get only group name and group id of all groups in db - raman
module.exports.getGroupNameAndId = async (req, res, next) => {
  try {
    const data = await Group.find({}, "name");

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching all groups data" });
  }
};

// get all the members of a particular group - raman
module.exports.getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Validate Group Id
    if (!mongoose.isValidObjectId(groupId)) {
      return res
        .status(400)
        .json({ message: "Invalid group ID", success: false });
    }

    const data = await Group.find({ _id: groupId }, "members");

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching all groups data" });
  }
};

// get all the members which are not part of any group - raman
module.exports.getNonGroupMembers = async (req, res, next) => {
  try {
    const companies = await Company.find({});

    // Filter employees with null group_id
    // flatmap is used to convert array of array into single array by merging it
    const employees_without_group = companies.flatMap((company) =>
      company.employees
        .filter((employee) => employee.group_id == null)
        .map((employee) => ({
          companyCode: company.company_code,
          employee_id: employee.employee_id,
          name: employee.employee_details.name,
        }))
    );

    console.log(employees_without_group);

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: employees_without_group,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching this data" });
  }
};

// create a new group - raman
module.exports.createGroup = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.json({
        message: "Please provide group details.",
      });
    }

    // Validate each ObjectId field
    if (
      !mongoose.isValidObjectId(data.leave_template_id) ||
      !mongoose.isValidObjectId(data.wfh_template_id) ||
      !mongoose.isValidObjectId(data.new_asset_template_id) ||
      !mongoose.isValidObjectId(data.repair_asset_template_id) ||
      !mongoose.isValidObjectId(data.hr_template_id)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid ObjectId in groups", success: false });
    }

    const newGroup = {
      name: data.name,
      description: data.description,
      leave_template_id: data.leave_template_id,
      wfh_template_id: data.wfh_template_id,
      new_asset_template_id: data.new_asset_template_id,
      repair_asset_template_id: data.repair_asset_template_id,
      hr_template_id: data.hr_template_id,
    };

    const result = await Group.create(newGroup);

    res.status(201).json({
      message: "Group created successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured while creating group" });
  }
};

// edit an existing group - raman
module.exports.editGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate Group Id
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid group ID", success: false });
    }

    const { data } = req.body;

    if (!data) {
      return res.json({
        message: "Please provide group details.",
      });
    }

    // Validate each ObjectId field
    if (
      !mongoose.isValidObjectId(data.leave_template_id) ||
      !mongoose.isValidObjectId(data.wfh_template_id) ||
      !mongoose.isValidObjectId(data.new_asset_template_id) ||
      !mongoose.isValidObjectId(data.repair_asset_template_id) ||
      !mongoose.isValidObjectId(data.hr_template_id)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid ObjectId in groups", success: false });
    }

    const updatedGroup = {
      name: data.name,
      description: data.description,
      leave_template_id: data.leave_template_id,
      wfh_template_id: data.wfh_template_id,
      new_asset_template_id: data.new_asset_template_id,
      repair_asset_template_id: data.repair_asset_template_id,
      hr_template_id: data.hr_template_id,
    };

    // will find and update the document and return updated document
    const result = await Group.findByIdAndUpdate(id, updatedGroup, {
      new: true,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    res.status(200).json({
      message: "Group updated successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while updating group details" });
  }
};

// add a new member in a group - raman
module.exports.addNewMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Validate Group Id
    if (!mongoose.isValidObjectId(groupId)) {
      return res
        .status(400)
        .json({ message: "Invalid group ID", success: false });
    }

    const { data } = req.body;

    if (
      !data ||
      !data.new_member ||
      !data.new_member.companyCode ||
      !data.new_member.employee_id ||
      !data.new_member.employee_name
    ) {
      return res.json({
        message: "Please provide new member details.",
      });
    }

    // if (!data.new_member.companyCode) {
    //   return res
    //     .status(400)
    //     .json({ message: "Company Code is missing", success: false });
    // }

    const group = await Group.findOne({ _id: groupId });

    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    const company = await Company.findOne({
      company_code: data.new_member.companyCode,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === data.new_member.employee_id
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // update group id of that member
    employee.group_id = groupId;
    await company.save();

    let group_members = group.members;

    console.log(group_members);

    // update group
    if (group_members.length == 0) {
      group_members[0] = data.new_member;
    } else {
      group_members.push(data.new_member);
    }

    await group.save();

    console.log(group_members);

    res
      .status(200)
      .json({ success: true, message: "Member added successfully", employee });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while adding new member." });
  }
};

// remove a member from a group - raman
module.exports.removeMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Validate Group Id
    if (!mongoose.isValidObjectId(groupId)) {
      return res
        .status(400)
        .json({ message: "Invalid group ID", success: false });
    }

    const { data } = req.body;

    if (
      !data ||
      !data.new_member ||
      !data.new_member.companyCode ||
      !data.new_member.employee_id ||
      !data.new_member.employee_name
    ) {
      return res.json({
        message: "Please provide new member details.",
      });
    }

    const company = await Company.findOne({
      company_code: data.new_member.companyCode,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === data.new_member.employee_id
    );

    if (!employee) {
        return res.status(404).json({ message: "Member not found" });
      }

    // reset group id of that member to null
    employee.group_id = null;
    await company.save();

    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // Filter out the member with the specified employeeId
    const updatedMembers = group.members.filter(member => member.employee_id !== data.new_member.employee_id);

    // Check if any member was actually removed
    if (updatedMembers.length === group.members.length) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update the group's members array
    group.members = updatedMembers;

    // Save the updated group document
    await group.save();

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while removing member." });
  }
};

// add members in bulk in an existing group - raman
module.exports.addMembersInBulk = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured while adding members." });
  }
};
