const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  images: [{
    url: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specifications: {
    type: Map,
    of: String
  },
  brand: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  salesCount: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  },
  isFeatured: {
    type: Boolean,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

