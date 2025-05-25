const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filepath) => {
  try {
    //assetid and public id is very important for update the resoucse like update the image
    //if you wanted to delete the asset from monogodb and cloudinary for that we required to these id

    const result = await cloudinary.uploader.upload(filepath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };

    //when ever we are uploading an image we needed to call the helper function we needed store the
    //url and public id to the mongodb
  } catch (error) {
    console.error("Error while uploading ", error);
    throw new Error("Error while uploading");
  }
};

module.exports = { uploadToCloudinary };
