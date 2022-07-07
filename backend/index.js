const express = require("express");
const userRouter = require("./routes/users");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRouter);

const start = async () => {
    await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connect to database successfully");
            app.listen("8000", () => {
                console.log("localhost:8000");
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

start();
