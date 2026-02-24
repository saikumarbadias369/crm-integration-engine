require("dotenv").config()
const express = require("express")
const app = express()

app.use(express.json())
app.get("/", (req, res) => {
    res.json({ message: "server Running" })
})

const port = 5001
app.listen(port, () => {
    console.log("server Runnig on port" + port)
})