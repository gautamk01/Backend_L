const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    //url of image
    url: {
      required: true,
      type: String,
    },
    //public id
    public_id: {
      type: String,
      required: true,
    },
    //know the user
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
