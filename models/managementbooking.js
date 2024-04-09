const mongoose = require("mongoose");

const ManagementbookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  purpose: { type: String, required: true },
  hallname: { type: String, requied: true },
  date: { type: Array, required: true },
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
    enum: ["prebooking", "pending", "accepted", "denied"],
  },
  refreshmentfor: { type: String, required: true },
  refreshmenttype: { type: String, required: true },
  food: { type: Array, required: true },
  file: {
    name: { type: String }, // Name of the file
    data: { type: Buffer }, // Binary data of the file
    contenttype: { type: String }, // Content type of the file
  },
});

const ManagementbookingModel = mongoose.model(
  "managementbooking",
  ManagementbookingSchema
);

module.exports = ManagementbookingModel;
