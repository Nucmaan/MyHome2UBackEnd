// model/Property.js

const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  houseType: {
    type: String,
    required: true,
    enum: ['Rent', 'Buy', 'Other'],
    trim: true
  },
  parking: {
    type: Number,
    default: 0
  },
  image: {
    public_id: String,
    url: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Pending', 'Sold', 'Rented']
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
