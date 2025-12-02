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



app.post("/users", async (req, res) => {
    const {name, email, age,phn ,address} = req.body
    try {
        const result = await pool.query(
            `INSERT INTO users( name, email,age,phn,address) VALUES($1,$2,$3,$4,$5)RETURNING*`, [ name, email, age,phn ,address]
        )
       res.status(201).json({
            status: true,
            message: "data inserted successfully",
            data:result.rows[0]

        })
    } catch (err: any) {
        res.status(500).json({
            status: false,
            message: err.message,

        })
    }


})














app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
