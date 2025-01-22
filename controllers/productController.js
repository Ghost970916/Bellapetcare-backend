const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, search, species } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (species) {
      query.species = species;
    }

    const sortOption = {};
    if (sort) {
      const [field, order] = sort.split(',');
      sortOption[field] = order === 'asc' ? 1 : -1;
    } else {
      sortOption.createdAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    return ApiResponse.success(res, {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, product);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return ApiResponse.success(res, product, 'Product created successfully', 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, product, 'Product updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, null, 'Product deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'No file uploaded', 400);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true, runValidators: true }
    );

    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    return ApiResponse.success(res, product, 'Product image uploaded successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};