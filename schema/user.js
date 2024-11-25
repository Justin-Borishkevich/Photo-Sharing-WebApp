"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  login_name: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  salt: { type: String, required: true }, // Salt for password hashing
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
