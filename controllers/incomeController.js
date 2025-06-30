const Income = require("../models/Income")

exports.createIncome = async (req, res) => {
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
        const newIncome = new Income({
            userId: req.user._id,
            date: date ? new Date(date) : Date.now(),
            amount,
            category,
            account,
            notes,
            isRecurring,
            description
        })

        await newIncome.save()

        return res.status(201).json(
            {
                success: true,
                message: "Income created",
                data: newIncome
            }
        )
    } catch (err) {
        console.error("Error creating income: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({
            userId: req.user._id
        }).sort({
            date: -1
        })

        return res.status(200).json(
            {
                success: true,
                data: incomes
            }
        )
    } catch (err) {
        console.error("Error fetching incomes: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.updateIncome = async (req, res) => {
    const { id } = req.params

    try {
        const updatedIncome = await Income.findOneAndUpdate(
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

        if (!updatedIncome) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Income not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Income updated",
                data: updatedIncome
            }
        )
    } catch (err) {
        console.error("Error updating income: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.deleteIncome = async (req, res) => {
    const { id } = req.params

    try {
        const deletedIncome = await Income.findOneAndDelete(
            {
                _id: id,
                userId: req.user._id
            }
        )

        if (!deletedIncome) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Income not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Income deleted"
            }
        )
    } catch (err) {
        console.error("Error deleting income: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}