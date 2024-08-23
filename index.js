const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");

require("dotenv").config();
const { MONGO_URL, PORT, CLIENT_URL } = process.env;

const app = express();

// Connect to database
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(
    cors({
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", authRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});