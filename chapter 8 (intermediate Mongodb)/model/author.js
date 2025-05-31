const mongoos = require("mongoose");

const AuthorSchema = new mongoos.Schema({
  name: String,
  bio: String,
});

module.exports = mongoos.model("Author", AuthorSchema);
