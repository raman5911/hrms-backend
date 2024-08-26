const Request = require("../models/RequestModel");
const Company = require("../models/CompanyModel");
const Group = require("../models/GroupModel");
const Template = require("../models/TemplateModel");
const EmployeeIdToNameMapping = require("../models/EmployeeIdToNameMapping");

const { sendMailToUser } = require("../util/SendMail");
const { encrypt, decrypt } = require("../util/EncryptDecrypt");

module.exports.employeeLeave = async (req, res, next) => {
  try {
    const requestor_employee_id = req.cookies.employee_id;
    const requestor_company_code = req.cookies.companyCode;

    const { start_date, end_date, leave_type, number_of_days, reason } =
      req.body;

    // Parse dates directly from ISO format
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    // Check if the dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // find approvers from template applied to requestor
    const company = await Company.findOne({
      company_code: requestor_company_code,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === requestor_employee_id
    );

    // console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Member not found" });
    }

    // find group id
    const group_id = employee.group_id.toString();
    console.log(group_id);

    // find group
    const group = await Group.findById(group_id);
    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // find template id
    const leave_template_id = group.leave_template_id.toString();

    // find template
    const template = await Template.findById(leave_template_id);

    if (!template) {
      return res.json({
        message: "Can't apply for request, template not found.",
      });
    }

    const approvers_list = template.approvers;
    // console.log(approvers_list);

    // Create a new request
    const new_request = new Request({
      requestor_id: requestor_employee_id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      request_type: "Leave",
      leave_type: leave_type,
      number_of_days: number_of_days,
      reason: reason,
      list_of_approvers: approvers_list,
      reminder_days: template.reminder_days,
      current_approver_id: approvers_list[0].employee_id,
      completed_or_not: false,
      current_level: 1,
    });
    // console.log(new_request);

    const result = await new_request.save();

    // fetch name from emp id
    const employee_data = await EmployeeIdToNameMapping.findOne({
      employee_id: requestor_employee_id,
    });

    const current_approver_data = await EmployeeIdToNameMapping.findOne({
      employee_id: approvers_list[0].employee_id,
    });

    console.log(result);
    // generating dynamic url with hash value
    const encrypt_id = await encrypt(
      `${result._id.toString()}_${result.current_level}`
    );
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(result._id, " ", encrypt_id);

    // sending mail to first approver
    await sendMailToUser(
      {
        request_type: "Leave Request",
        requested_by: `${employee_data.name} ( ${requestor_employee_id} )`,
        requested_to: `${current_approver_data.name} ( ${approvers_list[0].employee_id} )`,
        requested_on: new Date(),
        reciever_email_id: approvers_list[0].email_id,
        request_data: new_request,
        request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
      },
      "request"
    );

    // Send a success response
    res.status(201).json({
      message: "Request created successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating request", error);
    res.status(500).json({
      message: "Error creating request",
      error: error.message,
    });
  }
};
module.exports.WorkFromHome = async (req, res, next) => {
  try {
    const requestor_employee_id = req.cookies.employee_id;
    const requestor_company_code = req.cookies.companyCode;

    const { start_date, end_date, number_of_days, reason } = req.body;

    // Parse dates directly from ISO format
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    // Check if the dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // find approvers from template applied to requestor
    const company = await Company.findOne({
      company_code: requestor_company_code,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === requestor_employee_id
    );

    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Member not found" });
    }

    // find group id
    const group_id = employee.group_id.toString();
    console.log(group_id);

    // find group
    const group = await Group.findById(group_id);
    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // find template id
    const wfh_template_id = group.wfh_template_id;

    // find template
    const template = await Template.findById(wfh_template_id);

    if (!template) {
      return res.json({
        message: "Can't apply for request, template not found.",
      });
    }

    const approvers_list = template.approvers;
    console.log(approvers_list);

    // Create a new request
    const new_request = new Request({
      requestor_id: requestor_employee_id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      request_type: "WFH",
      number_of_days: number_of_days,
      reason: reason,
      list_of_approvers: approvers_list,
      reminder_days: template.reminder_days,
      current_approver_id: approvers_list[0].employee_id,
      completed_or_not: false,
      current_level: 1,
    });
    console.log(new_request);

    // Save the new leave record to the database
    const result = await new_request.save();

    // fetch name from emp id
    const employee_data = await EmployeeIdToNameMapping.findOne({
      employee_id: requestor_employee_id,
    });

    const current_approver_data = await EmployeeIdToNameMapping.findOne({
      employee_id: approvers_list[0].employee_id,
    });

    // generating dynamic url with hash value
    const encrypt_id = await encrypt(
      `${result._id.toString()}_${result.current_level}`
    );
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(result._id, " ", encrypt_id);

    // sending mail to first approver
    await sendMailToUser(
      {
        request_type: "WFH Request",
        requested_by: `${employee_data.name} ( ${requestor_employee_id} )`,
        requested_to: `${current_approver_data.name} ( ${approvers_list[0].employee_id} )`,
        requested_on: new Date(),
        reciever_email_id: approvers_list[0].email_id,
        request_data: new_request,
        request_link: `${process.env.CLIENT_URL}/${encoded_hash}`,
      },
      "request"
    );

    // Send a success response
    res.status(201).json({
      message: "Request created successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating request", error);
    res.status(500).json({
      message: "Error creating request",
      error: error.message,
    });
  }
};
module.exports.newAsset = async (req, res, next) => {
  try {
    const requestor_employee_id = req.cookies.employee_id;
    const requestor_company_code = req.cookies.companyCode;

    const { asset_type, reason } = req.body;

    // find approvers from template applied to requestor
    const company = await Company.findOne({
      company_code: requestor_company_code,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === requestor_employee_id
    );

    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Member not found" });
    }

    // find group id
    const group_id = employee.group_id.toString();
    console.log(group_id);

    // find group
    const group = await Group.findById(group_id);
    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // find template id
    const new_asset_template_id = group.new_asset_template_id;

    // find template
    const template = await Template.findById(new_asset_template_id);

    if (!template) {
      return res.json({
        message: "Can't apply for request, template not found.",
      });
    }

    const approvers_list = template.approvers;
    console.log(approvers_list);

    // Create a new request instance
    const new_request = new Request({
      requestor_id: requestor_employee_id,
      request_type: "New Asset",
      new_asset_type: asset_type,
      reason: reason,
      list_of_approvers: approvers_list,
      reminder_days: template.reminder_days,
      current_approver_id: approvers_list[0].employee_id,
      completed_or_not: false,
      current_level: 1,
    });
    console.log(new_request);

    // Save the new request record to the database
    const result = await new_request.save();

    // fetch name from emp id
    const employee_data = await EmployeeIdToNameMapping.findOne({
      employee_id: requestor_employee_id,
    });

    const current_approver_data = await EmployeeIdToNameMapping.findOne({
      employee_id: approvers_list[0].employee_id,
    });

    // generating dynamic url with hash value
    const encrypt_id = await encrypt(
      `${result._id.toString()}_${result.current_level}`
    );
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(result._id, " ", encrypt_id);

    // sending mail to first approver
    await sendMailToUser(
      {
        request_type: "New Asset Request",
        requested_by: `${employee_data.name} ( ${requestor_employee_id} )`,
        requested_to: `${current_approver_data.name} ( ${approvers_list[0].employee_id} )`,
        requested_on: new Date(),
        reciever_email_id: approvers_list[0].email_id,
        request_data: new_request,
        request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
      },
      "request"
    );

    // Send a success response
    res.status(201).json({
      message: "Request created successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating request", error);
    res.status(500).json({
      message: "Error creating request",
      error: error.message,
    });
  }
};
module.exports.repairAsset = async (req, res, next) => {
  try {
    const requestor_employee_id = req.cookies.employee_id;
    const requestor_company_code = req.cookies.companyCode;

    const { selected_asset, reason } = req.body;

    // find approvers from template applied to requestor
    const company = await Company.findOne({
      company_code: requestor_company_code,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === requestor_employee_id
    );

    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Member not found" });
    }

    // find group id
    const group_id = employee.group_id.toString();
    console.log(group_id);

    // find group
    const group = await Group.findById(group_id);
    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // find template id
    const repair_asset_template_id = group.repair_asset_template_id;

    // find template
    const template = await Template.findById(repair_asset_template_id);

    if (!template) {
      return res.json({
        message: "Can't apply for request, template not found.",
      });
    }

    const approvers_list = template.approvers;
    console.log(approvers_list);

    // Create a new request instance
    const new_request = new Request({
      requestor_id: requestor_employee_id,
      request_type: "Asset Repair",
      repair_asset: {
        brand_name: selected_asset.brand_name,
        model_number: selected_asset.model_number,
        asset_id: selected_asset._id,
        completed_or_not: false,
        current_level: 1,
      },
      reason: reason,
      list_of_approvers: approvers_list,
      reminder_days: template.reminder_days,
      current_approver_id: approvers_list[0].employee_id,
    });
    console.log(new_request);

    // Save the new request to the database
    const result = await new_request.save();

    // fetch name from emp id
    const employee_data = await EmployeeIdToNameMapping.findOne({
      employee_id: requestor_employee_id,
    });

    const current_approver_data = await EmployeeIdToNameMapping.findOne({
      employee_id: approvers_list[0].employee_id,
    });

    // generating dynamic url with hash value
    const encrypt_id = await encrypt(
      `${result._id.toString()}_${result.current_level}`
    );
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(result._id, " ", encrypt_id);

    // sending mail to first approver
    await sendMailToUser(
      {
        request_type: "Repair Asset Request",
        requested_by: `${employee_data.name} ( ${requestor_employee_id} )`,
        requested_to: `${current_approver_data.name} ( ${approvers_list[0].employee_id} )`,
        requested_on: new Date(),
        reciever_email_id: approvers_list[0].email_id,
        request_data: new_request,
        request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
      },
      "request"
    );

    // Send a success response
    res.status(201).json({
      message: "Request created successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating request", error);
    res.status(500).json({
      message: "Error creating request",
      error: error.message,
    });
  }
};
module.exports.requestToHR = async (req, res, next) => {
  try {
    const requestor_employee_id = req.cookies.employee_id;
    const requestor_company_code = req.cookies.companyCode;

    const { subject, reason } = req.body;

    // find approvers from template applied to requestor
    const company = await Company.findOne({
      company_code: requestor_company_code,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the employee within the company's employees array
    const employee = company.employees.find(
      (employee) => employee.employee_id === requestor_employee_id
    );

    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Member not found" });
    }

    // find group id
    const group_id = employee.group_id.toString();
    console.log(group_id);

    // find group
    const group = await Group.findById(group_id);
    console.log(group);

    if (!group) {
      return res.json({
        message: "Invalid group id. Group doesn't exist",
      });
    }

    // find template id
    const hr_template_id = group.hr_template_id;

    // find template
    const template = await Template.findById(hr_template_id);

    if (!template) {
      return res.json({
        message: "Can't apply for request, template not found.",
      });
    }

    const approvers_list = template.approvers;
    console.log(approvers_list);

    // Create a new request instance
    const new_request = new Request({
      requestor_id: requestor_employee_id,
      request_type: "HR",
      subject: subject,
      reason: reason,
      list_of_approvers: approvers_list,
      reminder_days: template.reminder_days,
      current_approver_id: approvers_list[0].employee_id,
      completed_or_not: false,
      current_level: 1,
    });
    console.log(new_request);

    // Save the new leave record to the database
    const result = await new_request.save();

    // fetch name from emp id
    const employee_data = await EmployeeIdToNameMapping.findOne({
      employee_id: requestor_employee_id,
    });

    const current_approver_data = await EmployeeIdToNameMapping.findOne({
      employee_id: approvers_list[0].employee_id,
    });

    // generating dynamic url with hash value
    const encrypt_id = await encrypt(
      `${result._id.toString()}_${result.current_level}`
    );
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(result._id, " ", encrypt_id);

    // sending mail to first approver
    await sendMailToUser(
      {
        request_type: "New HR Request",
        requested_by: `${employee_data.name} ( ${requestor_employee_id} )`,
        requested_to: `${current_approver_data.name} ( ${approvers_list[0].employee_id} )`,
        requested_on: new Date(),
        reciever_email_id: approvers_list[0].email_id,
        request_data: new_request,
        request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
      },
      "request"
    );

    // Send a success response
    res.status(201).json({
      message: "Request created successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating request", error);
    res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
  }
};

module.exports.getRequestDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const decrypt_id = await decrypt(id);
    console.log(decrypt_id);

    const obj_id = decrypt_id.split("_");
    console.log(obj_id);

    const request = await Request.findById(obj_id[0]);
    console.log(request);

    const accepted_array = request.accepted_array;
    const rejected_array = request.rejected_array;

    // adding data about status at every level
    const status_at_all_levels = [];

    // first pushing all approved entries
    for (let element of accepted_array) {
      status_at_all_levels.push(element);
    }

    // at last pushing rejected entry if any
    for (let element of rejected_array) {
      status_at_all_levels.push(element);
    }

    res.status(200).json({
      data: { request, status_at_all_levels: status_at_all_levels },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching request", error);
    res
      .status(500)
      .json({ message: "Error fetching request", error: error.message });
  }
};

module.exports.getAllRequestedByMe = async (req, res, next) => {
  try {
    const employee_id = req.cookies.employee_id;
    const company_code = req.cookies.companyCode;

    const data = await Request.find({ requestor_id: employee_id });
    console.log(data);

    res.status(200).json({
      data: data,
      success: true,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching requests", error);
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

module.exports.getDirectReporteesRequest = async (req, res, next) => {
  try {
    const employee_id = req.cookies.employee_id;

    const data = await Request.find({ current_approver_id: employee_id });
    res.status(200).json({
      data: data,
      success: true,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching requests", error);
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

// Send Remainder functionality
module.exports.sendReminders = async () => {
  try {
    // only getting those requests which are not rejected & are at intermediate level
    const pendingRequests = await Request.find({ completed_or_not: false });

    // for each pending request
    for (const request of pendingRequests) {
      // get date on which last action was taken for request
      const lastActionDate =
        request.accepted_array.length > 0
          ? request.accepted_array[request.accepted_array.length - 1]
              .action_date
          : request.raised_on;

      // getting days according to x days
      const xDaysAgo = new Date();
      xDaysAgo.setDate(xDaysAgo.getDate() - request.reminder_days);

      // comparing both dates
      if (lastActionDate <= xDaysAgo) {
        const approver = request.list_of_approvers.find(
          (approver) => approver.employee_id === request.current_approver_id
        );
        if (approver) {
          // sending mail
          let request_type_heading_placeholder;

          if (request.request_type === "Leave") {
            request_type_heading_placeholder = "Leave Request";
          } else if (request.request_type === "WFH") {
            request_type_heading_placeholder = "WFH Request";
          } else if (request.request_type === "New Asset") {
            request_type_heading_placeholder = "New Asset Request";
          } else if (request.request_type === "Asset Repair") {
            request_type_heading_placeholder = "Repair Asset Request";
          } else if (request.request_type === "HR") {
            request_type_heading_placeholder = "New HR Request";
          }

          // fetch name from emp id
          const employee_data = await EmployeeIdToNameMapping.findOne({
            employee_id: request.requestor_id,
          });

          const current = request.list_of_approvers[request.current_level];

          const encrypt_id = await encrypt(`${request._id.toString()}_${request.current_level}`);

          // await sendMailToUser(approver.email_id, request);
          await sendMailToUser(
            {
              request_type: request_type_heading_placeholder,
              requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
              requested_to: `${current.name} ( ${current.employee_id} )`,
              // requested_on: new Date(),
              approver_email_id: current.email_id,
              request_data: request,
              request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
              reciever_email_id: current.email_id,
            },
            "reminder"
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
