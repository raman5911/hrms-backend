const Request = require("../models/RequestModel");
const EmployeeIdToNameMapping = require("../models/EmployeeIdToNameMapping");
const { encrypt, decrypt } = require("../util/EncryptDecrypt");
const { sendMailToUser } = require("../util/SendMail");

module.exports.approveOrReject = async (req, res, next) => {
  try {
    // decrypting hash link
    const { id } = req.params;
    const decrypt_id = await decrypt(id);

    const obj_id = decrypt_id.split("_");

    const { action, remarks_message } = req.body;

    const request = await Request.findById(obj_id[0]);
    console.log(request);

    if (request.completed_or_not) {
      return res.status(500).json({
        message:
          "Request is already closed. In case of revoke, please revoke this request.",
      });
    }

    if (request.current_level != obj_id[1]) {
      return res.status(500).json({
        message:
          "You can't approve/reject this request. In case of revoke, please revoke this request.",
      });
    }

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
    console.log("employee data: " + employee_data);

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
            remarks: remarks_message,
            reciever_email_id: employee_data.email
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

        // move request to next level
        request.current_level += 1;

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
            remarks: remarks_message,
            reciever_email_id: employee_data.email
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
            reciever_email_id: current.email_id
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
          remarks: remarks_message,
          reciever_email_id: employee_data.email
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
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while approving/rejecting request" });
  }
};

module.exports.revoke = async (req, res, next) => {
  try {
    // action taker
    const revoke_request_by = req.cookies.employee_id;

    // decrypting hash link
    const { id } = req.params;
    const decrypt_id = await decrypt(id);

    const obj_id = decrypt_id.split("_");
    console.log(obj_id);

    const request = await Request.findById(obj_id[0]);
    console.log(request);

    let accepted_array = request.accepted_array;
    let rejected_array = request.rejected_array;
    const list_of_approvers = request.list_of_approvers;

    // finding level at which request is being revoked - if request at current level was rejected then same level index will be used otherwise if it was accepted then we will use previous level by minus 1
    const revoke_index = rejected_array.length > 0 ? request.current_level : request.current_level - 1;

    // in case of request already closed
    if (request.completed_or_not && rejected_array.length == 0) {
      return res.status(500).json({
        message: "Request is already closed. Can't revoke this request.",
      });
    }
    // in case request is at final stage
    else if (request.current_level === list_of_approvers.length) {
      return res.status(500).json({
        message: "Request is at final stage. Can't revoke this request.",
      });
    } 
    // to make ensure that only the previous level person wrt current level can revoke only
    else if (revoke_index != obj_id[1]) {
      return res.status(500).json({
        message: "You can't revoke this request.",
      });
    } else {
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
      console.log("employee data: " + employee_data);

      // const current_approver_data = await EmployeeIdToNameMapping.findOne({
      //   employee_id: current.employee_id,
      // });

      // in case of rejected at previous stage
      if (rejected_array.length > 0) {
        const current = list_of_approvers[request.current_level - 1];
        // const updated_level = list_of_approvers[request.current_level - 1];

        // delete array & set to empty
        rejected_array = [];
        request.rejected_array = rejected_array;

        // set completed_or_not to false again
        request.completed_or_not = false;

        // update request data
        const updated_request_data = await request.save();

        // send approve mail to new approver
        const new_encrypt_id = await encrypt(`${request._id.toString()}_${updated_request_data.current_level}`);

        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${updated_request_data.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: new Date(),
            approver_email_id: current.email_id,
            request_data: request,
            request_link: `${process.env.CLIENT_URL}/${new_encrypt_id}`,
            reciever_email_id: current.email_id
          },
          "request"
        );

        // send notify mail to requestor
        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: request.raised_on,
            action_date: new Date(),
            reciever_email_id: employee_data.email
          },
          "revoke"
        );

        res.status(201).json({ success: true, message: "Request revoked successfully", data: updated_request_data });
      }

      // in case approved at previous stage
      else {
        const current = list_of_approvers[request.current_level - 2];

        // delete last entry in accepted array
        await accepted_array.pop();
        request.accepted_array = accepted_array;

        // set current approver id to approver id of last stage
        request.current_approver_id = accepted_array.at(-1).approver_id;

        // decrement current level
        request.current_level -= 1;

        // update request data
        const updated_request_data = await request.save();

        // send notify mail to current approver
        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${updated_request_data.requestor_id} )`,
            requested_to: `${list_of_approvers[current_level - 1].name} ( ${list_of_approvers[current_level - 1].employee_id} )`,
            requested_on: updated_request_data.raised_on,
            action_date: new Date(),
            reciever_email_id: list_of_approvers[current_level - 1].email_id
          },
          "revoke"
        );

        // send approve mail to new approver
        const new_encrypt_id = await encrypt(`${result._id.toString()}_${updated_request_data.current_level}`);

        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${updated_request_data.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: new Date(),
            approver_email_id: current.email_id,
            request_data: request,
            request_link: `${process.env.CLIENT_URL}/${new_encrypt_id}`,
            reciever_email_id: current.email_id
          },
          "request"
        );

        // send notify mail to requestor
        await sendMailToUser(
          {
            request_type: request_type_heading_placeholder,
            requested_by: `${employee_data.name} ( ${request.requestor_id} )`,
            requested_to: `${current.name} ( ${current.employee_id} )`,
            requested_on: request.raised_on,
            action_date: new Date(),
            reciever_email_id: employee_data.email
          },
          "revoke"
        );

        res.status(201).json({ success: true, message: "Request revoked successfully", data: updated_request_data });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while revoking request" });
  }
};
