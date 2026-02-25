import dotenv from "dotenv";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

dotenv.config()
const app = express()




app.use(express.json())
const contacts = []
const authorizationCodes = {}
const refreshTokens = {}


app.get("/authorize", (req, res) => {
    const { client_id } = req.body
    if (!client_id) {
        return res.status(400).json({ message: "Client ID required" })
    }

    const authorizationCode = uuidv4()

    authorizationCodes[authorizationCode] = client_id

    res.json({ message: "Authorization Success", authorization_code: authorizationCode })
})


app.get("/token", (req, res) => {
    const { code, client_id } = req.body
    if (!authorizationCodes[code] || authorizationCodes[code] !== client_id) {
        res.status(400).json({ message: "Invalid Authendication code" })
    }
    const token = jwt.sign({ client_id }, "access-secrete", { expiresIn: "2m" })
    const refresh_token = jwt.sign({ client_id }, "refresh-secrete", { expiresIn: "5m" })

    refreshTokens[refresh_token] = client_id
    delete authorizationCodes[code]
    res.json({
        access_token: token,
        refresh_token: refresh_token
    })


})

app.get("/contact", (req, res) => {
    const authheadder = req.headers.authorization
    if (!authheadder) {
        return res.status(401).json("Missing Token")
    }
    const token = authheadder.split(" ")[1];
    try {

        jwt.verify(token, "access-secrete")
        res.json({ contacts })
    } catch (e) {
        res.status(401).json({ message: "Invalid or expired access token" })
    }


})


app.post('/contact', (req, res) => {
    const { name, email } = req.body
    if (!name || email) {
        return res.status(400).json({ message: "email and name are required" })
    }

    const newContact = {
        id: uuidv4(),
        name,
        email
    }
    contacts.push(newContact)
    res.json({
        message: "contact added SuccessFully",
        contacts: contacts

    })

})



app.get("/", (req, res) => {
    res.json({ message: "server Running" })
})

const port = 5001
app.listen(port, () => {
    console.log("server Runnig on port" + port)
})