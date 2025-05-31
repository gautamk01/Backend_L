const express = require("express");
const {
  createBook,
  createAuthor,
  getbooks,
} = require("../controller/book-controller");
const router = express.Router();

router.post("/author/add", createAuthor);
router.post("/book/add", createBook);
router.get("/get/:id", getbooks);

module.exports = router;
