require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");

const app = express();
const authRoutes = require("./router/auth-route");
const homeRouter = require("./router/home-routes ");
const adminRouter = require("./router/admin-route");
const uploadImageRouter = require("./router/image-route");
connectDB();

//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/image", uploadImageRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is now Listening in port", process.env.PORT);
});
