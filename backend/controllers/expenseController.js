const Expense = require("../models/Expense");
const User = require("../models/User");

// Add Expense
const addExpense = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAmount = Number(req.body.amount);

    if (!newAmount || newAmount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid expense amount",
      });
    }

    const expenseDate = req.body.date
      ? new Date(req.body.date)
      : new Date();

    const startOfMonth = new Date(
      expenseDate.getFullYear(),
      expenseDate.getMonth(),
      1
    );

    const endOfMonth = new Date(
      expenseDate.getFullYear(),
      expenseDate.getMonth() + 1,
      1
    );

    const expenses = await Expense.find({
      user: user._id,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    const totalSpent = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const remainingBudget = user.monthlyBudget - totalSpent;

    console.log("========== BUDGET CHECK ==========");
    console.log("Monthly Budget:", user.monthlyBudget);
    console.log("Total Spent:", totalSpent);
    console.log("Remaining:", remainingBudget);
    console.log("New Expense:", newAmount);
    console.log("===================================");

    if (totalSpent + newAmount > user.monthlyBudget) {
      console.log("❌ EXPENSE BLOCKED");

      return res.status(400).json({
        message: "Monthly budget exceeded",
        budget: user.monthlyBudget,
        spent: totalSpent,
        remaining: remainingBudget,
        attempted: newAmount,
      });
    }

    console.log("✅ EXPENSE ALLOWED");

    const expense = await Expense.create({
      ...req.body,
      amount: newAmount,
      user: req.user.id,
    });

    res.status(201).json(expense);

  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-in User Expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};