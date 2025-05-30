const Product = require("../model/product");

//first filter the document instock is true and price is greater than 100
const getProductsStats = async (req, res) => {
  try {
    // here we aggregating multiple condition and creating one query
    //1.filter and 2.group
    const result = await Product.aggregate([
      //first condition stage 1
      {
        $match: {
          inStock: true,
          price: {
            $gte: 100,
          },
        },
      },
      //group our document
      //group by catagories
      {
        $group: {
          _id: "$category",
          avgPrice: {
            $avg: "$price",
          },
          count: {
            $sum: 1,
          },
          totalPrice: {
            $sum: "$price",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has been occured",
    });
  }
};

const getproductAnalysis = async (req, res) => {
  try {
    const result = await Product.aggregate([
      //Match -> grouping -> project
      {
        $match: {
          category: "Electronics",
        },
      },
      //grouping
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
          averagePrice: {
            $avg: "$price",
          },
          maxProductPrice: {
            $max: "$price",
          },
          minProductPrice: {
            $min: "$price",
          },
        },
      },
      //projecting it 0 for hidding ,1 for showing
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          averagePrice: 1,
          minProductPrice: 1,
          maxProductPrice: 1,
          priceRange: {
            $subtract: ["$maxProductPrice", "$minProductPrice"],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has been occured",
    });
  }
};
const insertSampleProduct = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Laptop",
        category: "Electronics",
        price: 999,
        inStock: true,
        tags: ["computer", "tech"],
      },
      {
        name: "Smartphone",
        category: "Electronics",
        price: 699,
        inStock: true,
        tags: ["mobile", "tech"],
      },
      {
        name: "Headphones",
        category: "Electronics",
        price: 199,
        inStock: false,
        tags: ["audio", "tech"],
      },
      {
        name: "Running Shoes",
        category: "Sports",
        price: 89,
        inStock: true,
        tags: ["footwear", "running"],
      },
      {
        name: "Novel",
        category: "Books",
        price: 15,
        inStock: true,
        tags: ["fiction", "bestseller"],
      },
    ];

    const result = await Product.insertMany(sampleProducts);
    res.status(200).json({
      success: true,
      data: `inserted ${result.length} sample post`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has been occured",
    });
  }
};

module.exports = { insertSampleProduct, getProductsStats, getproductAnalysis };
