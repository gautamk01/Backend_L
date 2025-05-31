require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const productRoutes = require("./routes/product-routes");
const bookRoutes = require("./routes/book-routes");

const app = express();

connectDB();
app.use(express.json()); // middleware to conver to json
app.use("/product", productRoutes);
app.use("/refbook", bookRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is now Listening in port", process.env.PORT);
});
