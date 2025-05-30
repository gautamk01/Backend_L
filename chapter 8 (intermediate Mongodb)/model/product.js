const mongoos = require("mongoose");

const ProductSchema = new mongoos.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
  tags: [String],
});

module.exports = mongoos.model("Product", ProductSchema);
