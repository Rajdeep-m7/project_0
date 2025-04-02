// const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const { attendance, geofencing } = require("./database.js");
let cors = require("cors");

const app = express();
const PORT = 3000;

// MIDDLEWARE->PLUGINS
// app.use(express.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   next();
// });
app.use(express.json());
app.use(cors());

// To get particular attendance of a student-working
app.get("/api/attendance/:subject/:studentRoll", async (req, res) => {
  try {
    const { subject, studentRoll } = req.params;
    const studentAttendance = await attendance.find({
      subject,
      studentRoll, // Convert to Number
    });
    res.send(studentAttendance);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//To get all the attendance of a particular subject- not working
// app.get("/api/attendance/:dept/:className/:subject", async (req, res) => {
//   try {
//     const { dept, className, subject } = req.params;
//     const attendanceData = await attendance.find({
//       dept,
//       className,
//       subject,
//     });
//     res.send(attendanceData);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });

// To get geospatial coordinates-working
app.get("/api/geofencing/:dept/:className", async (req, res) => {
  try {
    const { dept, className } = req.params;
    const geofenceData = await geofencing.findOne({ dept, className });
    if (!geofenceData) {
      res.status(404).json({ message: "Geofence data not found" });
    }
    res.send(geofenceData.location.coordinates);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// To store geospatial coordinates- working
app.post("/api/geofencing", async (req, res) => {
  try {
    const { className, dept, location } = req.body;
    const [longitude, latitude] = location.coordinates;
    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ error: "latitude and longitude are required" });
    }

    const newLocation = new geofencing({
      className,
      dept,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // Always [lng, lat]
      },
    });

    await newLocation.save();
    res
      .status(201)
      .json({ message: "Location added successfully", data: newLocation });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// to add attendance-working
app.post("/api/attendance", async (req, res) => {
  try {
    const { studentName, studentRoll, dept, className, subject, isPresent } =
      req.body;
    const attendanceData = await attendance.create({
      studentName,
      studentRoll,
      dept,
      className,
      subject,
      isPresent,
    });
    res.status(201).json(attendanceData);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://Rajdeepcr7:Rajdeepcr7@cluster0.ylidhnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
  })
  .catch(() => {
    console.log("Connection failed");
  });
