/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());
const processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedphoto"
);
const fs = require("fs");
const { time } = require("console");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
// const models = require("./modelData/photoApp.js").models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", async (req, res) => {
  console.log("/test called with param1 = ", req.params.p1);
  const param = req.params.p1 || "info";

  if (param === "info") {
    try {
      // Fetch the SchemaInfo with async/await
      const info = await SchemaInfo.find({});
      if (info.length === 0) {
        return res.status(500).send("Missing SchemaInfo");
      }
      res.status(200).json(info[0]);
    } catch (err) {
      console.error("Error in /test/info:", err);
      res.status(500).send(JSON.stringify(err));
    }
  } else if (param === "counts") {
    // Use Promise.all to count documents for all collections asynchronously
    try {
      const userCount = await User.countDocuments({});
      const photoCount = await Photo.countDocuments({});
      const schemaInfoCount = await SchemaInfo.countDocuments({});

      res.status(200).json({
        user: userCount,
        photo: photoCount,
        schemaInfo: schemaInfoCount,
      });
    } catch (err) {
      res.status(500).send(JSON.stringify(err));
    }
  } else {
    res.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching user list:", err);
    res.status(500).send("Error fetching user list");
  }
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).send("User not found");
    } else {
      res.status(200).json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
      });
    }
  } catch (err) {
    res.status(400).send("Invalid user ID");
  }
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", async (req, res) => {
  try {
    // Find the photos for the given user_id and populate user info in the comments' user_id field
    const photos = await Photo.find({ user_id: req.params.id }).populate({
      path: "comments.user_id", // Populate the user data in the comments' user_id field
      select: "_id first_name last_name", // Only select the necessary fields
    });

    if (!photos || photos.length === 0) {
      return res.status(400).send("No photos found for this user");
    }

    // Format the response and send it
    const formattedPhotos = photos.map((photo) => ({
      _id: photo._id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: photo.user_id,
      comments: photo.comments.map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: {
          _id: comment.user_id._id,
          first_name: comment.user_id.first_name,
          last_name: comment.user_id.last_name,
        },
      })),
    }));

    res.status(200).json(formattedPhotos);
  } catch (err) {
    console.error("Error fetching photos:", err); // Log the error to debug
    res.status(500).send("Error fetching photos");
  }
});

const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Use `authenticate` middleware for protected routes
app.get("/user/list", authenticate, async (req, res) => {
  // WIP
});

// Login Endpoint
app.post("/admin/login", async (req, res) => {
  const { login_name, password } = req.body;

  try {
    // Look up user by login_name and password
    const user = await User.findOne({ login_name, password });
    // if (!user) {
    //   return res.status(400).json({ message: {login_name, password} });
    // }

    // Store user info in session
    req.session.user = { id: user._id, first_name: user.first_name };
    res.status(200).json({ user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/admin/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ message: "No user is currently logged in" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

app.post("/images/upload", async (request, response) => {
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      console.log(`Error: ${err}`);
      return response.status(400).send("Error uploading file");
    }
    // request.file has the following properties of interest:
    //   fieldname    - Should be 'uploadedphoto' since that is what we sent
    //   originalname - The name of the file the user uploaded
    //   mimetype     - The mimetype of the image (e.g., 'image/jpeg',
    //                  'image/png')
    //   buffer       - A node Buffer containing the contents of the file
    //   size         - The size of the file in bytes

    // XXX - Do some validation here.
    if (request.file.fieldname !== "uploadedphoto") {
      console.log("Fieldname is not uploadedphoto");
      return response.status(400).send("Invalid fieldname");
    }
    if (request.file.size === 0) {
      console.log("File size is 0");
      return response.status(400).send("File size is 0");
    }

    if(request.session.user === undefined){
      return response.status(401).send("Unauthorized");
    }

    // We need to create the file in the directory "images" under a unique name.
    // We make the original file name unique by adding a unique prefix with a
    // timestamp.
    const timestamp = new Date().valueOf();
    const filename = "U" + String(timestamp) + request.file.originalname;

    fs.writeFile(
      "./images/" + filename,
      request.file.buffer,
      function (err) {
        if (err) {
          console.log(`Error writing file: ${err}`);
          return response.status(500).send("Error saving file");
        }
        Photo.create({
          file_name: filename,
          date_time: timestamp,
          user_id: request.session.user.id,
        })

      }
    );
  });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
