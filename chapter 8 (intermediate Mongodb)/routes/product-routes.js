const express = require("express");
const {
  insertSampleProduct,
  getProductsStats,
  getproductAnalysis,
} = require("../controller/product-controller");

const router = express.Router();

router.post("/add", insertSampleProduct);
router.get("/stats", getProductsStats);
router.get("/analysis", getproductAnalysis);

module.exports = router;
