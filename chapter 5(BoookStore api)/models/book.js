const mongoose = require("mongoose");

//creating a schema for books
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    maxLenght: [100, "Book title cannot be more than 100 charachter "],
  },
  author: {
    type: String,
    required: [true, "author is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Year of publication is required"],
    min: [1000, "year must be atleast 1000"],
    max: [new Date().getFullYear(), "Year cannot be in the future "],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Here we are just exporting the schema of the book
//we model is like a shema generater and defining a name
module.exports = mongoose.model("Book", BookSchema);
