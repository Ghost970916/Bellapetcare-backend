const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');

exports.getHomepageData = async (req, res) => {
  try {
    const bestSellers = await Product.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(6)
      .select('name price image discount');

    const featuredProducts = await Product.find({ isActive: true, isFeatured: true })
      .limit(6)
      .select('name price image discount');

    return ApiResponse.success(res, {
      bestSellers,
      featuredProducts
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};