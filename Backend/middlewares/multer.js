const multer = require("multer");

// Store files in memory as buffer instead of writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
