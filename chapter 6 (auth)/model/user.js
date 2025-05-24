//MOdel file consiste of Schema of the Auth functionality
const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trime: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trime: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], //only allow user and admin rules
      default: "user",
    },
  },
  { timestamps: true }
);

//Exporting Schema
module.exports = mongoose.model("User", UserSchema);
