"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  login_name: { type: String, required: true, unique: true },
  password_digest: { type: String, required: true },
  salt: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
