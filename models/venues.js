const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
  seatingCapacity: { type: Number, required: true },
  distFromGate: { type: Number },
  hallName: { type: String, required: true, unique: true },
  hasAC: { type: Boolean, required: true },
  carouselPics: [{ type: String }],
  isAvailable: { type: Boolean, required: true },
  imgUrl: { type: String },
  reservations: [],
  projectorAvailable: { type: Boolean, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4 },
  campus: { type: String, required: true },
  files: [
    {
      filename: { type: String }, // Name of the file
      fileId: { type: mongoose.Schema.Types.ObjectId }, // ID of the file stored in GridFS
      contentType: { type: String }, // Content type of the file
    },
  ],
});

const VenueModel = mongoose.model("venues", VenueSchema);

module.exports = VenueModel;
