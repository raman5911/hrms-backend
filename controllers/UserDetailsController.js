const User = require("../models/UserModel");
const Employee = require("../models/new_usermodel1");
module.exports.fetchUsersList = async (req, res, next) => {
  try {
    // only fetch name, userID of all the users excluding their obj id
    const data = await User.find({}, { name: 1, userID: 1, _id: 0 });

    res
      .status(200)
      .json({
        message: "Data fetched successfully",
        success: true,
        data: data,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};
module.exports.fetchEmployee = async (req, res, next) => {
  try {
    // only fetch name, employeeID of all the users excluding their obj id
    const data = await Employee.find();

    res
      .status(200)
      .json({
        message: "Data fetched successfully",
        success: true,
        data: data,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};
module.exports.postEmployee = async (req, res, next) => {
  try {
    const { name, employee_id, gender, contact, email, password } = req.body;
    if (!name || !employee_id || !password) {
      return res.json({
        message: "All fields are required except custom fields",
      });
    }
    const new_id = {
      Employee_Id: employee_id,
      Employee_details: {
        name: name,
        gender: gender,
        contact: contact,
        email: email,
      },
      password: password,
    };
    console.log(new_id);

    const data = await Employee.create(new_id);

    res
      .status(201)
      .json({ message: "Id created successfully", success: true, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating new Id" });
  }
};
module.exports.putemployee = async (req, res) => {
  try {
    console.log("Received request body");
    const { employeeId, updateData } = req.body;
    console.log("employeeId:", employeeId);
    console.log("updateData:", updateData);
    const update = {
      Employee_details: {
        name: updateData.name,
        gender: updateData.gender,
        contact: updateData.contact,
        email: updateData.email,
      }
      };

    const updatedEmployee = await Employee.findOneAndUpdate(
      { 
        Employee_Id: employeeId
       },
      update,
      { new: true, runValidators: true }
    )
    console.log("data : " + updatedEmployee);
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
    message: "Employee updated successfully",
    Employee_Id: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

