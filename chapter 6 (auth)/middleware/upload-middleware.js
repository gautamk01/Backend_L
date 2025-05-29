// multipart/form-data, which is primarily used for file uploads.
//multer will helps the process and store that file on the server

const multer = require("multer");
const path = require("path");

//set our multer storage
//Disk Storage ->  will save the uploaded file directly to your server's file system (disk)

const storage = multer.diskStorage({
  //destination will direct you to where to store the file
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  //what the filename function usually do is to what the name is given to the
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//file filter function (controls which files are accepted )
const checkFIleFIlter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image! please upload my middleware "));
  }
};

//multer middleware

module.exports = multer({
  storage: storage,
  fileFilter: checkFIleFIlter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
