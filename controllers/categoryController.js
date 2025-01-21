const Category = require("../models/Category")
const ApiResponse = require("../utils/apiResponse")

exports.getAllCategories = async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.species) {
      filter.species = req.query.species
    }

    const categories = await Category.find(filter)
      .populate("species", "name")
      .populate("parentCategory", "name")
      .sort("order")

    return ApiResponse.success(res, categories)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("species", "name")
      .populate("parentCategory", "name")

    if (!category) {
      return ApiResponse.error(res, "Category not found", 404)
    }
    return ApiResponse.success(res, category)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body)
    await category.save()
    return ApiResponse.success(res, category, "Category created successfully", 201)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("species", "name")

    if (!category) {
      return ApiResponse.error(res, "Category not found", 404)
    }
    return ApiResponse.success(res, category, "Category updated successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!category) {
      return ApiResponse.error(res, "Category not found", 404)
    }
    return ApiResponse.success(res, null, "Category deleted successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.getCategoriesBySpecies = async (req, res) => {
  try {
    const categories = await Category.find({
      species: req.params.speciesId,
      isActive: true,
    }).sort("order")

    return ApiResponse.success(res, categories)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

