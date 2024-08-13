const Request = require("../models/RequestModel");
const EmployeeIdToNameMapping = require("../models/EmployeeIdToNameMapping");
const { encrypt, decrypt } = require("../util/EncryptDecrypt");
const { sendMailToUser } = require("../util/SendMail");

module.exports.approveOrReject = async (req, res, next) => {
  try {
    // decrypting hash link
    const { id } = req.params;
    const decrypt_id = await decrypt(id);

    const { action, remarks_message } = req.body;

    const request = await Request.findById(decrypt_id);
    console.log(request);

    // arranging data

    const accepted_array = request.accepted_array;
    const rejected_array = request.rejected_array;
    const list_of_approvers = request.list_of_approvers;

    let updated_data;

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
    console.log('employee data: ' + employee_data);

    // const current_approver_data = await EmployeeIdToNameMapping.findOne({
    //   employee_id: current.employee_id,
    // });

    // generating dynamic url with hash value
    const encrypt_id = await encrypt(request._id.toString());
    console.log(encrypt_id);

    // const encoded_hash = encodeURIComponent(hash_obj_id);

    console.log(request._id, " ", encrypt_id);

    // main logic considering all cases

    if (action === "approve") {
      // checking if at last stage or not
      if (accepted_array.length + 1 === list_of_approvers.length) {
        const current = list_of_approvers[accepted_array.length];
        console.log(accepted_array.length, current);

        await accepted_array.push({
          approver_name: current.name,
          approver_id: current.employee_id,
          action_date: new Date(),
          remarks: remarks_message,
        });

        // close request
        request.completed_or_not = true;

        updated_data = await request.save();

        // -------- send response email here -------
        console.log(`${current.name} ( ${current.employee_id} )`);

        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            response: "approved",
            requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: request.raised_on,
            action_date: new Date(),
            remarks: remarks_message
          },
          "response"
        );
      } else {
        console.log(list_of_approvers);
        const current = list_of_approvers[accepted_array.length];
        console.log(accepted_array.length, current);

        await accepted_array.push({
          approver_name: current.name,
          approver_id: current.employee_id,
          action_date: new Date(),
          remarks: remarks_message,
        });

        // update current aapprover id for next approver
        request.current_approver_id =
          list_of_approvers[accepted_array.length].employee_id;

        updated_data = await request.save();

        // -------- send response email here -------
        console.log(`${current.approver_name} ( ${current.approver_id} )`);

        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            response: "approved",
            requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: request.raised_on,
            action_date: new Date(),
            remarks: remarks_message
          },
          "response"
        );

        // ------- send mail to next approver -------
        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: new Date(),
            approver_email_id: current.email_id,
            request_data: request,
            request_link: `${process.env.CLIENT_URL}/${encrypt_id}`,
          },
          "request"
        );
      }
    } else if (action === "reject") {
      // will use accepted array here not rejected array for finding index
      const current = list_of_approvers[accepted_array.length];
      console.log(current);

      await rejected_array.push({
        approver_name: current.name,
        approver_id: current.employee_id,
        action_date: new Date(),
        remarks: remarks_message,
      });

      // close request
      request.completed_or_not = true;

      updated_data = await request.save();

      // -------- send response email here -------
      console.log(`${current.name} ( ${current.employee_id} )`);

      await sendMailToUser(
        {
          request_type: request_type_heading_placeholder,
          response: "rejected",
          requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
          requested_to: `${current.name} ( ${current.employee_id} )`,
          requested_on: request.raised_on,
          action_date: new Date(),
          remarks: remarks_message
        },
        "response"
      );
    }

    res.status(201).json({
      data: updated_data,
      success: true,
      message: "Approval status updated successfully",
    });
  } catch (error) {
    console.error("Error in approver function:", error);
    res.status(500).json({ message: "Server error" });
  }
};
