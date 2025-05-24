//Database connection
const mongoos = require("mongoose");
const connectDB = async () => {
  try {
    await mongoos.connect(process.env.URL);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.log("There is an error in connection", e.message);
  }
};

module.exports = connectDB;
