require("dotenv").config(); // This will help in loading the .env file to the project
const express = require("express");
const connectDB = require("./database/db");
const bookRoutes = require("./routes/book-routes");

const app = express();
const PORT = process.env.PORT || 3000;

//connect to our database
connectDB();

//middleware -> express.json
app.use(express.json()); //parse the json file

//routes here
app.use("/api/books", bookRoutes);

//listening the server
app.listen(PORT, () => {
  console.log("the server is running successfully in ", PORT);
});
