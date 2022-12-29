require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

//routers
const authRouter = require("./routes/auth");
const coursesRouter = require("./routes/course");
const attendanceRouter = require("./routes/attendance");
const profileRouter = require("./routes/profile");
const studentsRouter = require("./routes/student");

const connectDB = async () => {
  const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.arykmnd.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

//route middlewares
app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/profile", profileRouter);
app.use("/api/students", studentsRouter);

app.listen(process.env.PORT || 5000, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
