const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  college: { type: String, requied: true },
  email: { type: String, required: true },
  purpose: { type: String, required: true },
  hallname: { type: String, requied: true },
  date: { type: mongoose.Schema.Types.Date, required: true },
  starttime: { type: mongoose.Schema.Types.Date, required: true },
  endtime: { type: mongoose.Schema.Types.Date, requried: true },
  eventname: { type: String, requried: true },
  chiefguest: { type: Array, requried: true },
  seating: { type: Number, requried: true },
  refreshment: { type: String, requried: true },
  status: {
    type: String,
    required: true,
    default: "prebooking",
    enum: [
      "prebooking",
      "pending",
      "accepted",
      "denied",
      "completed",
      "denied_temp",
    ],
  },
  mobilenumber: { type: String, requied: true },
  refreshmentfor: { type: String, required: true },
  refreshmenttype: { type: String, required: true },
  food: { type: Array, required: true },
  file: {
    filename: { type: String }, // Name of the file
    fileId: { type: mongoose.Schema.Types.ObjectId }, // ID of the file stored in GridFS
    contentType: { type: String }, // Content type of the file
  },
  feedback: { type: String },
  reason: { type: String },
});

const BookingModel = mongoose.model("booking", BookingSchema);

module.exports = BookingModel;
