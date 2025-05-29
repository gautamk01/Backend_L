// controller/image-controller.js

const Image = require("../model/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const fs = require("fs");

const uploadImageController = async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image ",
      });
    }

    const { url, public_id } = await uploadToCloudinary(req.file.path);

    const newlyUploadedImage = new Image({
      url,
      public_id,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //delete the file from local storage (aka server after storing temperary for pass the req)
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "Image is uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//controller for fetching an image
const fetchImageContoller = async (req, res) => {
  try {
    const image = await Image.find({});
    if (image) {
      res.status(200).json({
        success: true,
        data: image,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      message: "something went wrong",
    });
  }
};
// ✅ Correct export
module.exports = { uploadImageController, fetchImageContoller };
