const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Create a new expense
router.post('/', expenseController.createExpense);

// Get all expenses with optional filters
router.get('/', expenseController.getExpenses);

// Get analytics data
router.get('/analytics', expenseController.getAnalytics);

module.exports = router;