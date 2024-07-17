const User = require("../models/UserModel");

module.exports.fetchUsersList = async (req, res, next) => {
    try {
        // only fetch name, userID of all the users excluding their obj id
        const data = await User.find({}, { name: 1, userID: 1, _id: 0 });
        
        res.status(200).json({ message: "Data fetched successfully", success: true, data: data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
}