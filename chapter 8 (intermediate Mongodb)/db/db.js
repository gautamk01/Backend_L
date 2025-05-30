const mongoos = require("mongoose");

const connectDB = async () => {
  try {
    await mongoos.connect(process.env.MONGO_URI);
    console.log("Connected to Mongoos!!!");
  } catch (e) {
    console.log("Error : ", e);
  }
};

module.exports = connectDB;
