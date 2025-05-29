const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  fetchImageContoller,
} = require("../controller/image-controller");
const router = express.Router();

//2 endpoint
// 1. one is to upload the image
// 2. to get the uploaded image

//each and everytime when a middleware is called the next function is also called
//First we needed to protect the middleware check the auth middleware
//now lets understand multer

//single image upload
router.post(
  "/upload",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImageController
);

router.get("/get", authMiddleware, fetchImageContoller);
//CHeck the user is loged in -> is adminUser or not -> upload a singleimage -> store it in the mongodb
module.exports = router;
