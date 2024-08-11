const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  utilities :{
    type: Number,
    required: true,
    default: 0,
  },
  total : {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  Description : {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Bank Transfer', 'Cash'],
  },
}, {
  timestamps: true,
});

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;
