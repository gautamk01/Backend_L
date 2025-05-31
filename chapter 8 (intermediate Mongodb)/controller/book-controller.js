const Author = require("../model/author");
const Book = require("../model/book");

const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();

    res.status(201).json({
      success: true,
      data: author,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has Occured in create Author section",
    });
  }
};
const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    // we have given model of the book like title and the author with a type reference to the author table
    //we must pass the tile and the author id for that specific book
    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has Occured in create Book section",
    });
  }
};

const getbooks = async (req, res) => {
  try {
    const book_id = req.params.id;
    const result = await Book.findById(book_id).populate("author"); // give the table name to the populate section
    res.status(201).json({
      success: true,
      message: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has Occured in the getting of the books",
    });
  }
};

module.exports = { createBook, createAuthor, getbooks };
