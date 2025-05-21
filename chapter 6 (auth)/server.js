require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const app = express();

connectDB();
app.listen(process.env.PORT || 3000, () => {
  console.log("server is now Listening in port", process.env.PORT);
});
