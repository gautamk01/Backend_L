require("dotenv").config();

const mongoose = require("mongoose"); // importing the function mongoose for DB

//connection to DB
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Mongodb is connected ");
  } catch (e) {
    console.log("Connection face an issue", e);
    process.exit(1);
  }
};

module.exports = connectToDb;
