const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 100
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['UPI', 'Credit Card', 'Net Banking', 'Cash']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);