const express = require("express");
const app = express();
const noteRouter = require("../routes/noteRoutes");
const userRouter = require("../routes/userRoutes"); 
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
    res.send("Notes API FromCheezyCode");
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;
