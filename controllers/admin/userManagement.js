// CRUD
const User = require("../../models/User")
const bcrypt = require("bcrypt")

// Create
exports.createUser = async (req, res) => {
    console.log("Received body:", req.body);
    const { username, email, password } = req.body
    // validation
    if (!username || !email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing field"
            }
        )
    }

    try {
        const existingUser = await User.findOne(
            {
                $or: [{ username: username }, { email: email }]
            }
        )

        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false, "msg": "User exists"
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10) // 10 salt/complexity jaty badayo tety complex hudaii janxa
        const newUser = new User(
            {
                username: username,
                email: email,
                password: hashedPassword,
            }
        )
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "msg": "User registered"
            }
        )
    } catch (e) {
        return res.status(500).json(
            {
                "success": false,
                "message": "Server error"
            }
        )
    }
}

// Read All
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(
            {
                "success": true,
                "message": "Data fetched",
                "data": users
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                "success": false,
                "message": "Server error"
            }
        )
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const _id = req.params.id // use mongo id
        const user = await User.findById(_id)
        return res.status(200).json(
            {
                "success": true,
                "message": "One user fetched",
                "data": user
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                "success": false,
                "message": "Server Error"
            }
        )
    }
}

// update
exports.updateOneUser = async (req, res) => {
    const { username, email, role } = req.body
    const _id = req.params.id
    try {
        const user = await User.updateOne(
            {
                "_id": _id
            },
            {
                $set: {
                    "username": username,
                    "email": email,
                    "role": role
                }
            }
        )

        return res.status(200).json(
            {
                "success": true,
                "message": "User data updated"
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                "success": false,
                "message": "Server Error"
            }
        )
    }
}

// Delete
exports.deleteOneUser = async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.deleteOne(
            {
                "_id": _id
            }
        )
        console.log(user)
        return res.status(200).json(
            {
                "success": true,
                "message": "User deleted"
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                "success": false,
                "message": "Server Error"
            }
        )
    }
}