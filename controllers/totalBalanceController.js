const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getBalance = async (req, res) => {
  try {
    const incomeAgg = await Income.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]);

    const expenseAgg = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);

    const totalIncome = incomeAgg[0]?.totalIncome || 0;
    const totalExpense = expenseAgg[0]?.totalExpense || 0;
    const balance = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance
      }
    });
  } catch (err) {
    console.error("Error calculating balance:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
