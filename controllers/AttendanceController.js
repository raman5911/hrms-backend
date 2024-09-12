const geolib = require("geolib");
const Attendance = require("../models/AttendanceModel");
const Company = require("../models/CompanyModel");
const Policy = require("../models/PolicyModel");

// comparing user's location coordinates with office location coordinates
const isCoordinateWithinRadius = async (position, coordinates, radius_area) => {
  const dist = await geolib.getDistance(
    { latitude: position.latitude, longitude: position.longitude },
    { latitude: coordinates[0], longitude: coordinates[1] }
  );
  console.log(dist);

  return dist <= radius_area;
};

// Helper function to extract hours and minutes from a Date object
const getTimeInMinutes = (date) => {
  console.log(date);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return (hours * 60) + minutes;
};

module.exports.punchIn = async (req, res, next) => {
  try {
    const { data } = req.body;
    const employeeId = req.cookies.employee_id;
    const companyCode = req.cookies.companyCode;

    const company = await Company.findOne({ company_code: companyCode });

    const withinRadiusOrNot = await isCoordinateWithinRadius(data, company.location.coordinates, company.radius_area);
    console.log(withinRadiusOrNot);

    if (!withinRadiusOrNot) {
      return res.status(500).json({
        message: "You are not inside radius area.",
      });
    } else {
      const punch_in_time = new Date();
      const date = new Date();
      // date.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
      const new_entry = new Attendance({
        Employee_Id: employeeId,
        company_code: companyCode,
        punch_in_time: punch_in_time,
        date: date,
        opened: true
      });

      await new_entry.save();

      res.status(201).json({
        success: true,
        message: "Punched in successfully",
        data: {
          punched_in: true,
          punch_in_time: punch_in_time,
          employee_id: employeeId,
        },
      });
    }
  } catch (error) {
    console.error("Error punch in", error);
    res.status(500).json({
      message: "Error punch in",
    });
  }
};

module.exports.punchOut = async (req, res, next) => {
  try {
    const { data } = req.body;
    const employeeId = req.cookies.employee_id;
    const companyCode = req.cookies.companyCode;

    const company = await Company.findOne({ company_code: companyCode });

    // check if employee is within radius
    const withinRadiusOrNot = await isCoordinateWithinRadius(data, company.location.coordinates, company.radius_area);
    // console.log(withinRadiusOrNot);

    if (!withinRadiusOrNot) {
      return res.status(500).json({
        message: "You are not inside radius area.",
      });
    } else {
      const punch_out_time = new Date();
      const date = new Date();
      // date.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

      const entry = await Attendance.findOne({
        Employee_Id: employeeId,
        opened: true
      });
      // console.log(entry);

      const punch_in_time = new Date(entry.punch_in_time);
      // console.log('punch in time: ' + punch_in_time);      
      // console.log('punch out time: ' + punch_out_time);      
      
      const total_hours = (Math.abs(punch_out_time - punch_in_time)) / (1000 * 60 * 60);
      const hours = Math.floor(total_hours);
      const decimal_part = total_hours - hours;
      const minutes = Math.round(decimal_part * 60);
      
      const decimal_hours = hours + (minutes) / 60;
      // console.log(decimal_hours);

      // check if punched in late or not
      const policy = await Policy.findOne({ company_code: companyCode });
      console.log('policy: ' + policy);
      console.log(policy.punch_in_time);

      const punch_in_minutes = getTimeInMinutes(punch_in_time);
      const policy_punch_in_minutes = getTimeInMinutes(policy.punch_in_time);

      const on_time = punch_in_minutes <= policy_punch_in_minutes ? true : false;
      // console.log(on_time);

      // check if working hours completed or not
      const working_hours_completed = decimal_hours >= policy.working_hours ? true : false;

      entry.punch_out_time = punch_out_time;
      entry.opened = false;
      
      if(on_time == true && working_hours_completed == true) {
        entry.status = "Present";
      }
      else if(on_time == false || working_hours_completed == false) {
        entry.status = "Half Day";
      }

      await entry.save();
      
      // console.log('total hours: ' + total_hours);
      // console.log(`Time: ${hours} hours, ${minutes} minutes`);

      return res.status(200).json({ message: "Punched out successfully!" });
    }
  } catch (error) {
    console.error("Error punch out", error);
    res.status(500).json({
      message: "Error punch out",
    });
  }
};
