const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },// Add blocked field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
