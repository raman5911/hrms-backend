const Request = require("../models/RequestModel");                  // By Shivam
module.exports.employeeLeave = async (req, res, next) => {       // for creating a new function and exporting
  try {                                                                                 // exception handling
    const { start_date, end_date, leave_type, number_of_days, reason, employee_id } = req.body;
    console.log("Received request to create employee leave");

    // Parse dates directly from ISO format
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    // Check if the dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Create a new EmployeeLeave instance
    const newLeave = new Request({
      employee_id: employee_id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      Req_type: "Leave",
      leave_type: leave_type,
      number_of_days: number_of_days,
      reason: reason,
    });
    console.log(newLeave);

    // Save the new leave record to the database
    const savedLeave = await newLeave.save();

    // Send a success response
    res.status(201).json({
      message: "Employee leave request created successfully",
      leave: savedLeave,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating employee leave request:", error);
    res
      .status(500)
      .json({ message: "Error creating employee leave request", error: error.message });
  }
};
module.exports.WorkFromHome = async (req, res, next) => {
  try {
    const { start_date, end_date, number_of_days, reason, employee_id } =
      req.body;
    console.log("Received request for Work from home");

    // Parse dates directly from ISO format
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    // Check if the dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Create a new WorkFromHome instance
    const newWorkFromHome = new Request({
      employee_id: employee_id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      number_of_days: number_of_days,
      reason: reason,
    });
    console.log(newWorkFromHome);

    // Save the new leave record to the database
    const savedReq = await newWorkFromHome.save();

    // Send a success response
    res.status(201).json({
      message: "Work from home request created successfully",
      data: savedReq,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating Work from home request:", error);
    res
      .status(500)
      .json({ message: "Error creating Work from home request", error: error.message });
  }
};
module.exports.newAsset = async (req, res, next) => {
  try {
    const { asset, reason, employee_id } = req.body;
    console.log("Received request for new asset");
    // Create a new request instance
    const newReq = new Request({
      employee_id: employee_id,
      asset: asset,
      reason: reason,
    });
    console.log(newReq);

    // Save the new request record to the database
    const savedLeave = await newReq.save();

    // Send a success response
    res.status(201).json({
      message: "New asset request registered successfully",
      data: newReq,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error registering new asset request:", error);
    res
      .status(500)
      .json({ message: "Error registering new asset request", error: error.message });
  }
};
module.exports.repairAsset = async (req, res, next) => {
  try {
    const { asset, reason, employee_id } = req.body;
    console.log("Received request for repair asset");
    // Create a new EmployeeLeave instance
    const newReq = new Request({
      employee_id: employee_id,
      asset: asset,
      reason: reason,
    });
    console.log(newReq);

    // Save the new request to the database
    const savedLeave = await newReq.save();

    // Send a success response
    res.status(201).json({
      message: "Repair asset request registered successfully",
      data: newReq,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error registering repair asset request:", error);
    res
      .status(500)
      .json({ message: "Error registering repair asset request", error: error.message });
  }
};
module.exports.requestToHR = async (req, res, next) => {
  try {
    const { subject, reason, employee_id } = req.body;
    console.log("Received request for HR");
    // Create a new request instance
    const newReq = new Request({
      employee_id: employee_id,
      subject: subject,
      reason: reason,
    });
    console.log(newReq);

    // Save the new leave record to the database
    const savedLeave = await newReq.save();

    // Send a success response
    res.status(201).json({
      message: "Request sent successfully to HR",
      leave: savedLeave,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error sending request to HR:", error);
    res
      .status(500)
      .json({ message: "Error sending request to HR", error: error.message });
  }
};
