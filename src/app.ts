import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"

import path from "path"
import config from "./config"
import initDB, { pool } from "./config/db"
import logger from "./middleware/logger"
import { UserRoutes } from "./modules/users/users.routes"
import { todoRoutes } from "./modules/todos/todo.routes"
import { authRoutes } from "./modules/auth/auth.routes"



const app = express()


// parser
app.use(express.json())

//initialization DB
initDB();


//  --------------------- LOGGER Middleware -------------------





app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

//! --------------- Users CRUD ------------------

app.use("/users",UserRoutes)

// ! ----------------- TODOS CRUD -----------------
app.use("/todos", todoRoutes);

// ! --------------- AUTH ----------------
app.use("/auth/v1",authRoutes)









// ---------------- All users CRUD --------------------------


// ---------------- Single Users CRUD -----------------
// app.get("/users/:id", )

// --------------------- Updated user CRUD ------------
// app.put("/users/:id", )

// -------------------- Deleted User CRUD
// app.delete("/users/:id", )




// ! TODOS CRUD 
// app.post("/todos", async (req: Request, res: Response) => {
//     const { user_id, title } = req.body;

//     try {
//         const result = await pool.query(
//             `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
//             [user_id, title]
//         );
//         res.status(201).json({
//             success: true,
//             message: "Todo created",
//             data: result.rows[0],
//         });
//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// });

// --------------------- ALL todos CRUD --------------------------
// app.get('/todos', async (req: Request, res: Response) => {
//     try {
//         const result = await pool.query(`SELECT * FROM todos`)
//         console.log(result)
//         res.status(200).json({
//             success: true,
//             message: "All Todos",
//             data: result.rows,

//         })

//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message,

//         })
//     }
// })





// --------------------------- NOT FOUND ROUTE ------------------------------------
app.use((req , res)=>{
    res.status(404).json({
        success:false,
        message:"NOT FOUND ROUTE",
        path:req.path
    })
})

export default app