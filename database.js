const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      require: true,
    },

    studentRoll: {
      type: String,
      require: true,
      unique: false,
    },

    dept: {
      type: String,
      require: true,
    },

    className: {
      type: String,
      require: true,
    },

    subject: {
      type: String,
      require: true,
    },

    isPresent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const geofencingSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  dept: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // GeoJSON type (Point)
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
  },
});

const attendance = mongoose.model("Attendance", attendanceSchema);

geofencingSchema.index({ location: "2dsphere" });

const geofencing = mongoose.model("Geofencing", geofencingSchema);
module.exports = { attendance, geofencing };
