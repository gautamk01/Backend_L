const mongoos = require("mongoose");

const BookSchema = new mongoos.Schema({
  title: String,
  author: {
    type: mongoos.Schema.Types.ObjectId,
    ref: "Author",
  },
});

module.exports = mongoos.model("Book", BookSchema);
