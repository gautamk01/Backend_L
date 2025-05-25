const Image = require("../model/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");

const uploadIMage = async (req, res) => {
  try {
    //check if the file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image ",
      });
    }

    //upload to cloudinary
    const { url, public_id } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with the uploaded user id
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();
    res.status(201).json({
      success: true,
      message: "Image is uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong ! ",
    });
  }
};
