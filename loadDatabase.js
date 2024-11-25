/**
 * This Node.js program loads the Project 7 model data into Mongoose
 * defined objects in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * Be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'project6'.
 * It loads into collections named User and Photos. The Comments are added in
 * the Photos of the comments. Any previous objects in those collections are
 * discarded.
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const crypto = require("crypto");

// Connect to the database
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load the models
const models = require("./modelData/photoApp.js").models;
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const versionString = "1.0";

// Helper function to hash passwords
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex"); // Hash the password
  return { salt, hash };
}

// Remove existing data
const removePromises = [
  User.deleteMany({}),
  Photo.deleteMany({}),
  SchemaInfo.deleteMany({}),
];

Promise.all(removePromises)
  .then(function () {
    console.log("Existing data cleared.");

    // Load users into the database
    const userModels = models.userListModel();
    const mapFakeId2RealId = {};
    const userPromises = userModels.map(function (user) {
      const { salt, hash } = hashPassword("weak"); // Hash the password

      return User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        login_name: user.last_name.toLowerCase(),
        password: hash, // Store hashed password
        salt, // Store the salt
      })
        .then(function (userObj) {
          userObj.save();
          mapFakeId2RealId[user._id] = userObj._id;
          user.objectID = userObj._id;
          console.log(
            `Added user: ${user.first_name} ${user.last_name} with ID ${user.objectID}`
          );
        })
        .catch(function (err) {
          console.error("Error creating user:", err);
        });
    });

    const allPromises = Promise.all(userPromises).then(function () {
      // Load photos into the database
      const photoModels = [];
      const userIDs = Object.keys(mapFakeId2RealId);
      userIDs.forEach(function (id) {
        photoModels.push(...models.photoOfUserModel(id));
      });

      const photoPromises = photoModels.map(function (photo) {
        return Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: mapFakeId2RealId[photo.user_id],
        })
          .then(function (photoObj) {
            photo.objectID = photoObj._id;
            if (photo.comments) {
              photo.comments.forEach(function (comment) {
                photoObj.comments = photoObj.comments.concat([
                  {
                    comment: comment.comment,
                    date_time: comment.date_time,
                    user_id: comment.user.objectID,
                  },
                ]);
                console.log(
                  `Adding comment of length ${comment.comment.length} by user ${comment.user.objectID} to photo ${photo.file_name}`
                );
              });
            }
            photoObj.save();
            console.log(
              `Added photo: ${photo.file_name} of user ID ${photoObj.user_id}`
            );
          })
          .catch(function (err) {
            console.error("Error creating photo:", err);
          });
      });

      return Promise.all(photoPromises).then(function () {
        // Create the SchemaInfo object
        return SchemaInfo.create({
          version: versionString,
        })
          .then(function (schemaInfo) {
            console.log(
              `SchemaInfo object created with version ${schemaInfo.version}`
            );
          })
          .catch(function (err) {
            console.error("Error creating schemaInfo:", err);
          });
      });
    });

    allPromises.then(function () {
      mongoose.disconnect().then(() => {
        console.log("loadDatabase Completed");
      });
    });
  })
  .catch(function (err) {
    console.error("Error clearing data or creating new entries:", err);
  });
