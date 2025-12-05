import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import config from "../../config";
const loginUser = async (email: string, password: string) => {
    // console.log(email)
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    if (result.rows.length === 0) {
        return null
    }
    // console.log(result)
    const user = result.rows[0]
    // console.log(user)
    const match = await bcrypt.compare(password, user.password)
    console.log(match)
    if (!match) {
        return false
    }
 
    const token = jwt.sign({name:user.name,email:user.email},config.jwtSecret as string,{
        expiresIn:"7d"
    })
    // console.log({token})
    return {token,user}
}


 export const authServices = {
    loginUser,
}