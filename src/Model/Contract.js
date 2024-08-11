const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  status: {
    type: String,
     enum: ['Active', 'Terminated', 'Inactive'], // Added 'Inactive' as a valid enum value
    default: 'Active'
  }
}, {
  timestamps: true
});

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;
