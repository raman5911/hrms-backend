require("dotenv").config();
const jwt = require("jsonwebtoken");

// creating secret unique token
module.exports.createPrivateToken = (id) => {
    return jwt.sign({ id }, process.env.PRIVATE_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};