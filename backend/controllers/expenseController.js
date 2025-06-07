const Expense = require('../models/Expense');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, notes, date, paymentMode } = req.body;
    
    const expense = new Expense({
      amount,
      category,
      notes,
      date: date || new Date(),
      paymentMode
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all expenses with optional filters
exports.getExpenses = async (req, res) => {
  try {
    const { dateRange, categories, paymentModes } = req.query;
    
    let filters = {};
    
    // Date range filter
    if (dateRange) {
      let startDate;
      const endDate = new Date();
      
      switch (dateRange) {
        case 'This month':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
          break;
        case 'Last 30 days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'Last 90 days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'All time':
        default:
          startDate = new Date(0);
          break;
      }
      
      filters.date = { $gte: startDate, $lte: endDate };
    }
    
    // Category filter
    if (categories) {
      const categoryArray = categories.split(',');
      filters.category = { $in: categoryArray };
    }
    
    // Payment mode filter
    if (paymentModes) {
      const paymentModeArray = paymentModes.split(',');
      filters.paymentMode = { $in: paymentModeArray };
    }
    
    const expenses = await Expense.find(filters).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics data for charts
exports.getAnalytics = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            category: "$category"
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year"
          },
          categories: {
            $push: {
              category: "$_id.category",
              amount: "$totalAmount"
            }
          },
          total: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};