import express from "express"
import mysql2 from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = 3000
app.use(express.json())

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWROD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})

app.get("/", (req, res) =>{
    res.send("Müködik a szerver")
})




app.listen(PORT, ()=>{
    console.log(`Server fut http://localhost:${PORT}`)
})


