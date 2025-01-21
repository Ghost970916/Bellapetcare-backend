const Product = require("../models/Product")
const ApiResponse = require("../utils/apiResponse")

exports.getAllProducts = async (req, res) => {
  try {
    const { species, category, page = 1, limit = 10, sort = "-createdAt" } = req.query
    const filter = { isActive: true }

    if (species) filter.species = species
    if (category) filter.categories = category

    const products = await Product.find(filter)
      .populate("species", "name")
      .populate("categories", "name")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Product.countDocuments(filter)

    return ApiResponse.success(res, {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    })
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("species", "name").populate("categories", "name")

    if (!product) {
      return ApiResponse.error(res, "Product not found", 404)
    }
    return ApiResponse.success(res, product)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    return ApiResponse.success(res, product, "Product created successfully", 201)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("species", "name")
      .populate("categories", "name")

    if (!product) {
      return ApiResponse.error(res, "Product not found", 404)
    }
    return ApiResponse.success(res, product, "Product updated successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!product) {
      return ApiResponse.error(res, "Product not found", 404)
    }
    return ApiResponse.success(res, null, "Product deleted successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.searchProducts = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query
    const searchRegex = new RegExp(query, "i")

    const products = await Product.find({
      isActive: true,
      $or: [{ name: searchRegex }, { description: searchRegex }, { brand: searchRegex }],
    })
      .populate("species", "name")
      .populate("categories", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Product.countDocuments({
      isActive: true,
      $or: [{ name: searchRegex }, { description: searchRegex }, { brand: searchRegex }],
    })

    return ApiResponse.success(res, {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    })
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

