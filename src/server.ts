import express, { Request, Response } from "express"
import dotenv from "dotenv"
import { Pool } from "pg"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), '.env') })
const app = express()
const port = 5000

// parser
app.use(express.json())

// DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`

})

const initDB = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            age INT,
            phn VARCHAR(15),
            address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )`
    );
    await pool.query(
        `CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(150)  NOT NULL,
            description TEXT,
            completed BOOLEAN  DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )`
    )
};

initDB();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

//--------------- Users CRUD ------------------

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
        }else {
            res.status(200).json({
                 success:true,
                 message:"users fetched",
                 data:result.rows[0]
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
        const result = await pool.query(`UPDATE users SET name =$1 , email = $2 , age = $3 , phn=$4 , address= $5  WHERE id=$6 RETURNING*`, [name, email, age, phn, address ,req.params.id])
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "users not found",

            })
        }else {
            res.status(200).json({
                 success:true,
                 message:"users successfully updated",
                 data:result.rows[0]
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
        }else {
            res.status(200).json({
                 success:true,
                 message:"users Successfully Deleted",
                 data:result.rows
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
