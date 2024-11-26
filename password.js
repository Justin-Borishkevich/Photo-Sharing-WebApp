"use strict";
const crypto = require("crypto");

/**
 * Return a salted and hashed password entry from a clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry where passwordEntry is an object with two
 * string properties:
 *    salt - The salt used for the password.
 *    hash - The sha1 hash of the password and salt.
 */
function makePasswordEntry(clearTextPassword) {
  const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
  const hash = crypto
    .createHmac("sha1", salt)
    .update(clearTextPassword)
    .digest("hex"); // Hash the password with the salt
  return { salt, hash };
}

/**
 * Return true if the specified clear text password and salt generates the
 * specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function verifyPassword(hash, salt, clearTextPassword) {
  const hashToCompare = crypto
    .createHmac("sha1", salt)
    .update(clearTextPassword)
    .digest("hex");
  return hash === hashToCompare;
}

module.exports = { makePasswordEntry, verifyPassword };
