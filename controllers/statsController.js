const Expense = require("../models/Expense")

exports.getExpenseStats = async (req, res) => {
    try {
        const match = { userId: req.user._id }

        const stats = await Expense.aggregate(
            [
                {
                    $match: match
                },
                {
                    $group: {
                        _id: "$category",
                        totalAmount: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $project: {
                        category: "$_id",
                        totalAmount: 1,
                        _id: 0
                    }
                }
            ]
        )

        return res.status(200).json(
            {
                success: true,
                data: stats
            }
        )
    } catch (err) {
        console.error("Error generating stats: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}