const Product = require('../models/Product');
const Category = require('../models/Category');
const Species = require('../models/Species');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments({ isActive: true });
    const totalSpecies = await Species.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    const salesData = {
      labels: monthlySales.map(item => item._id),
      datasets: [{
        label: 'Monthly Sales',
        data: monthlySales.map(item => item.total),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }]
    };

    return ApiResponse.success(res, {
      totalProducts,
      totalCategories,
      totalSpecies,
      totalOrders,
      revenue: revenue[0]?.total || 0,
      salesData
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};