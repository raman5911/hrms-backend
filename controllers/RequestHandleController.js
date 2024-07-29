const Employeedetails = require("../models/Employeedetails");                           // By Shivam
module.exports.employeeLeave = async (req, res, next) => {                              // for creating a new function and exporting
  try {                                                                                 // exception handling
    const { start_date, end_date, leave_type, number_of_days, reason } =                // the data we fetched from the schema
      req.body;
    console.log("Received request to create employee leave");

    // Create a new EmployeeLeave instance
    const newLeave = new Employeedetails({      
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      leave_type: leave_type,
      number_of_days: number_of_days,
      reason: reason,
    });
    console.log(newLeave);

    // Save the new leave record to the database
    const savedLeave = await newLeave.save();

  // Send a success response
    res.status(201).json({
      message: "Employee leave created successfully",
      leave: savedLeave,
    });
  } catch (error) {
     // Handle any errors
    console.error("Error creating employee leave:", error);
    res
      .status(500)
      .json({ message: "Error creating employee leave", error: error.message });
  }
};
module.exports.Workfromhome = async (req, res, next) => {
  try {
    const { start_date, end_date, leave_type, number_of_days, reason } =
      req.body;
    console.log("Received request to create Work from home leave");
    // Create a new EmployeeLeave instance
    const newLeave = new Employeedetails({
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      leave_type: leave_type,
      number_of_days: number_of_days,
      reason: reason,
    });
    console.log(newLeave);

    // Save the new leave record to the database
    const savedLeave = await newLeave.save();

    // Send a success response
    res.status(201).json({
      message: "Work from home leave created successfully",
      leave: savedLeave,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error creating Work from home leave:", error);
    res
      .status(500)
      .json({ message: "Error creating employee leave", error: error.message });
  }
};
module.exports.newAsset = async (req, res, next) => {
  try {
    const { asset, reason } = req.body;
    console.log("Received request for new asset");
    // Create a new EmployeeLeave instance
    const newLeave = new Employeedetails({
      asset: asset,
      reason: reason,
    });
    console.log(newLeave);

    // Save the new leave record to the database
    const savedLeave = await newLeave.save();

    // Send a success response
    res.status(201).json({
      message: "New asset registered successfully",
      leave: savedLeave,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error registering new asset:", error);
    res
      .status(500)
      .json({ message: "Error registering new asset", error: error.message });
  }
};
module.exports.requesttoHR = async (req, res, next) => {
  try {
    const { subject, reason } = req.body;
    console.log("Received request for HR");
    // Create a new EmployeeLeave instance
    const newLeave = new Employeedetails({
      subject: subject,
      reason: reason,
    });
    console.log(newLeave);

    // Save the new leave record to the database
    const savedLeave = await newLeave.save();

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
