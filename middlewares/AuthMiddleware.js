const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token;

    // if token is not present return false
    if (!token) {
        return res.json({ status: false })
    }

    // else verify token
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id)
            
            if (user) 
            {
                // return res.json({ status: true, user: user.username });

                return res.json({ status: true });
            } 

            else 
                return res.json({ status: false })
        }
    })
}