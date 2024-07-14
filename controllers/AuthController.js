const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        // getting user input
        const { email, password, createdAt } = req.body;

        //finding if user already exists
        const existingUser = await User.findOne({ email });

        // if exists, return error
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        // create new user
        const user = await User.create({ email, password, createdAt });

        console.log(user);

        // create new secret token
        const token = createSecretToken(user._id);

        // creating and sending cookie to client's browser
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        // sending response
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user: { time: user.createdAt, desg: user.designation, email: user.email, name: user.name, role: user.role, userID: user.userID } });
        next();

    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        // getting user input
        const { email, password } = req.body;

        // if any field is empty
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }

        // if user not found
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }

        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User logged in successfully", success: true, user: { time: user.createdAt, desg: user.designation, email: user.email, name: user.name, role: user.role, userID: user.userID } });

        next();

    } catch (error) {
        console.error(error);
    }
}