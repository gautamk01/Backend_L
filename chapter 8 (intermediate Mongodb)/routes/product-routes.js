const express = require("express");
const {
  insertSampleProduct,
  getProductsStats,
} = require("../controller/product-controller");

const router = express.Router();

router.post("/add", insertSampleProduct);
router.get("/stats", getProductsStats);
module.exports = router;
