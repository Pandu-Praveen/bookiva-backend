const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["ADMIN", "USER", "MANAGEMENT"],
    default: "USER",
  },

  name: { type: String, required: true },

  dept: { type: String, required: true },

  college: { type: String, requied: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  blockStatus: { type: Boolean, required: true, default: false },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
