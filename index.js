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


app.get("/szolgaltatasok", (req, res) =>{
    try{
        const sql = "SELECT szolgaltatasok.id, megnevezes, alapar, munkaido_perc, aktiv, kategoriak.nev FROM `szolgaltatasok`, kategoriak WHERE(kategoria_id = kategoriak.id) ORDER BY alapar ASC"
        pool.query(sql, (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })

    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.get("/szolgaltatasok/elerheto", (req, res) =>{
    try{
        const sql = "SELECT id, kategoria_id, megnevezes, alapar, munkaido_perc, aktiv FROM `szolgaltatasok` WHERE(aktiv = 1 and munkaido_perc<=60)"
        pool.query(sql, (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })

    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})


app.get("/szolgaltatasok/kereses/:szoveg", (req, res) =>{
    try{
        const {szoveg} = req.params
        const sql = `SELECT id, kategoria_id, megnevezes, alapar, munkaido_perc, aktiv FROM szolgaltatasok WHERE(megnevezes like ?)`
        const searchPath = `%${szoveg}%`
        pool.query(sql, [searchPath], (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })

    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.get("/kategoriak/statisztika", (req, res) =>{
    try{
        const sql = `SELECT kategoria_id, COUNT(szolgaltatasok.id) as "szolgatatasok_szama", AVG(alapar) as "atlagos_alapar", kategoriak.nev  FROM szolgaltatasok , kategoriak WHERE(kategoria_id = kategoriak.id) GROUP BY kategoriak.nev`
        pool.query(sql, (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })

    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.get("/szolgatatasok/dragak", (req, res) =>{
    try{
        const sql = `SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE(alapar >= 25000) ORDER BY munkaido_perc DESC`
        pool.query(sql, (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })

    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server fut http://localhost:${PORT}`)
})


