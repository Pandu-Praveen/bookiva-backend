const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventid: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: mongoose.Schema.Types.Date, required: true },
  time: { type: mongoose.Schema.Types.Date, required: true },
  eventname: { type: String, requried: true },
  mobilenumber: { type: Number, requied: true },
  comments: { type: String },
  rating: { type: Number },
});

const FeedbackModel = mongoose.model("feedback", FeedbackSchema);

module.exports = FeedbackModel;
