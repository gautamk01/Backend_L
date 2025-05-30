// controller/image-controller.js

const Image = require("../model/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
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
    //pagination and sorting
    const page = parseInt(req.query.page) || 1; //number of pages
    const limit = parseInt(req.query.limit) || 5; //number of limit of image
    const skip = (page - 1) * limit; // how many Image needed to skip in a perticular pages

    const sortBy = req.query.sortBy || "createdAt"; // how the content must be sorted
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; //asc 1 dsc -1
    const totalImages = await Image.countDocuments(); // total number of document or here image
    const totalPages = Math.ceil(totalImages / limit); //total number of pages

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const image = await Image.find().sort(sortBy).skip(skip).limit(limit);

    if (image) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
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

//delete the Image deleteing controller
const deleteImageController = async (req, res) => {
  try {
    const getImageId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getImageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //check if the image is deleting by only user who has uploaded the image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "you cannot delete the image ",
      });
    }

    //delete this image , first from our cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    //delete the image from monogodb database
    await Image.findByIdAndDelete(getImageId);
    res.status(200).json({
      success: true,
      message: "Image is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Something is wrong with the delete Image controller ",
    });
  }
};
// ✅ Correct export
module.exports = {
  uploadImageController,
  deleteImageController,
  fetchImageContoller,
};
