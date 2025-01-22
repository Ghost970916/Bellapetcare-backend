const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    return ApiResponse.success(res, users);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse.success(res, user);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    return ApiResponse.success(res, { ...user.toObject(), password: undefined }, 'User created successfully', 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const updateData = { username, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse.success(res, user, 'User updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse.success(res, null, 'User deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};