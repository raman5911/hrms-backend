require("dotenv").config();
const jwt = require("jsonwebtoken");

// creating secret unique token
module.exports.createSecretToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};