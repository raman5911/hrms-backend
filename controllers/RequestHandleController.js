const User = require("../models/UserModel");

module.exports.createRequest = async (req, res, next) => {
    try {
        // getting user input
        const { department, subject, desc, user } = req.body;

        // if any field is empty
        if (!user || !department || !subject || !desc) {
            return res.json({ message: 'All fields are required' })
        }

        console.log(id, department, subject, desc, user);

        // if user not found
        const admin = await User.findOne({ department });

        if(admin) {
            const result = User.findOneAndUpdate({ userID: user.userID }, { req_dept: department, req_subject: subject, req_desc: desc, req_status: "pending" });
        }

    } catch (error) {
        console.log(error);
    }
}