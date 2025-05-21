require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const app = express();
const authRoutes = require("./router/auth-route");

connectDB();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is now Listening in port", process.env.PORT);
});
