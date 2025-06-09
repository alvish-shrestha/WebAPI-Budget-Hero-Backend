require("dotenv").config()

const express = require("express")
const app = express()

app.get("/", 
    (req, res) => {
        return res.status(200).send("Hello World")
})

const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running");
    }
)