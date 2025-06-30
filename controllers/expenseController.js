const Expense = require("../models/Expense")

exports.createExpense = async (req, res) => {
    const { date, amount, category, account, notes, isRecurring, description } = req.body

    if (!amount || !category || !account) {
        return res.status(400).json(
            {
                success: false,
                message: "Missing required field(s)"
            }
        )
    }

    try {
        const newExpense = new Expense({
            userId: req.user._id,
            date: date ? new Date(date) : Date.now(),
            amount,
            category,
            account,
            notes,
            isRecurring,
            description
        })

        await newExpense.save()

        return res.status(201).json(
            {
                success: true,
                message: "Expense created",
                data: newExpense
            }
        )
    } catch (err) {
        console.error("Error creating expense: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user._id
        }).sort({
            date: -1
        })

        return res.status(200).json(
            {
                success: true,
                data: expenses
            }
        )
    } catch (err) {
        console.error("Error fetching expenses: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.updateExpense = async (req, res) => {
    const { id } = req.params

    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { 
                _id: id, 
                userId: req.user._id 
            },
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedExpense) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Expense not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Expense updated",
                data: updatedExpense
            }
        )
    } catch (err) {
        console.error("Error updating expense: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.deleteExpense = async (req, res) => {
    const { id } = req.params

    try {
        const deletedExpense = await Expense.findOneAndDelete(
            {
                _id: id,
                userId: req.user._id
            }
        )

        if (!deletedExpense) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Expense not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Expense deleted"
            }
        )
    } catch (err) {
        console.error("Error deleting expense: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}