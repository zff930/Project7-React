const multer = require("multer");
const path = require("path");

// Set storage location & filename
const storage = multer.diskStorage({
  // Saved to disk instead of memory
  destination: (req, file, callback) => {
    // first argument: whether received error, second argument: folder to save file
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

// Allowed mime types
const allowed = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "audio/mpeg", // allows mp3
  "video/mp4",
];

// Validation rules for mime types
const fileFilter = (req, file, callback) => {
  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Unsupported file type"), false);
  }
};

// req.body be form-data with a field named "image/audio/video"
module.exports = multer({ storage, fileFilter }).single("media");
