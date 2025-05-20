const express = require("express");
const {
  getAllBoooks,
  getSingleBookById,
  addNewBook,
  UpdateBook,
  DeleteBook,
} = require("../controller/book-controller");

//createing express router
const router = express.Router();

//all routes that are important for this book api

router.get("/get", getAllBoooks);
router.get("/get/:id", getSingleBookById);
router.post("/add", addNewBook);
router.put("/update/:id", UpdateBook);
router.delete("/delete/:id", DeleteBook);

//export
module.exports = router;
