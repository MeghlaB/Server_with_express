import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"

import path from "path"
import config from "./config"
import initDB, { pool } from "./config/db"
import logger from "./middleware/logger"



const app = express()
const port = config.port

// parser
app.use(express.json())

//initialization DB
initDB();


//  --------------------- LOGGER Middleware -------------------





app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

//! --------------- Users CRUD ------------------

app.post("/users", async (req: Request, res: Response) => {
    const { name, email, age, phn, address } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO users( name, email,age,phn,address) VALUES($1,$2,$3,$4,$5)RETURNING*`, [name, email, age, phn, address]
        )
        res.status(201).json({
            success: true,
            message: "data inserted successfully",
            data: result.rows[0]

        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }


})

// ---------------- All users CRUD --------------------------
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`)
        console.log(result)
        res.status(200).json({
            success: true,
            message: "All users",
            data: result.rows,

        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})

// ---------------- Single Users CRUD -----------------
app.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "users not found",

            })
        } else {
            res.status(200).json({
                success: true,
                message: "users fetched",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})

// --------------------- Updated user CRUD ------------
app.put("/users/:id", async (req: Request, res: Response) => {
    const { name, email, age, phn, address } = req.body
    try {
        const result = await pool.query(`UPDATE users SET name =$1 , email = $2 , age = $3 , phn=$4 , address= $5  WHERE id=$6 RETURNING*`, [name, email, age, phn, address, req.params.id])
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "users not found",

            })
        } else {
            res.status(200).json({
                success: true,
                message: "users successfully updated",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})

// -------------------- Deleted User CRUD
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id])
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "users not found",

            })
        } else {
            res.status(200).json({
                success: true,
                message: "users Successfully Deleted",
                data: result.rows
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})




// ! TODOS CRUD 
app.post("/todos", async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
            [user_id, title]
        );
        res.status(201).json({
            success: true,
            message: "Todo created",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// --------------------- ALL todos CRUD --------------------------
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`)
        console.log(result)
        res.status(200).json({
            success: true,
            message: "All Todos",
            data: result.rows,

        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})





// --------------------------- NOT FOUND ROUTE ------------------------------------
app.use((req , res)=>{
    res.status(404).json({
        success:false,
        message:"NOT FOUND ROUTE",
        path:req.path
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
