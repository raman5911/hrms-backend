const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");

require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

// connect to database
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err));

// cors
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

// reminder cron
require('./crons/reminderCron');

// port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});