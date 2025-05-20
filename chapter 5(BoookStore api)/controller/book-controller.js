const Book = require("../models/book");

const getAllBoooks = async (req, res) => {
  try {
    const all_book = await Book.find();
    if (all_book.length > 0) {
      res.status(201).json({
        success: true,
        message: "List of Books fetched",
        data: all_book,
      });
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Could not add Book",
      data: e.message,
    });
  }
};
const getSingleBookById = async (req, res) => {
  try {
    const id_collection = req.params.id;
    const Book_specific = await Book.findById(id_collection);
    if (!Book_specific) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "The Book is found",
        data: Book_specific,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: e.message,
    });
  }
};
const addNewBook = async (req, res) => {
  try {
    const newbookFormData = req.body;
    const newlyCreatedBook = await Book.create(newbookFormData);
    if (newbookFormData) {
      res.status(201).json({
        success: true,
        message: "Book added",
        data: newlyCreatedBook,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "bad request",
      data: e.message,
    });
  }
};
const UpdateBook = async (req, res) => {
  try {
    const id_book = req.params.id;
    const update_value = req.body;
    const data = await Book.findByIdAndUpdate(id_book, update_value, {
      new: true, // it will give the updated Book back
    });
    if (data) {
      res.status(201).json({
        success: true,
        message: "Updated successfully",
        data: data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Book is not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      data: e.message,
    });
  }
};
const DeleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted_book = await Book.findByIdAndDelete(id);
    if (deleted_book) {
      res.status(200).json({
        success: true,
        message: "Successfully deleted the book",
        data: deleted_book,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Book is not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Bad request",
    });
  }
};

module.exports = {
  getAllBoooks,
  getSingleBookById,
  addNewBook,
  UpdateBook,
  DeleteBook,
};
