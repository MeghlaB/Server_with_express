import { pool } from "../../config/db"

const createUser = async(name:string, email:string, age:number, phn:number, address:string)=>{
     const result = await pool.query(
                `INSERT INTO users( name, email,age,phn,address) VALUES($1,$2,$3,$4,$5)RETURNING*`, [name, email, age, phn, address]
            )
         return result  
}

const getUser = async()=>{
  const result =  await pool.query(`SELECT * FROM users`)
  return result ;
}

const getSingleUser = async(id:string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    return result;
}


const getUserUpdated = async(name:string, email:string, age:number, phn:number, address:string,id:string)=>{
  const result = await pool.query(`UPDATE users SET name =$1 , email = $2 , age = $3 , phn=$4 , address= $5  WHERE id=$6 RETURNING*`, [name, email, age, phn, address, id])
  
  return result ;
  
}
const userDeleted = async (id:string)=>{
 const result =  await pool.query(`DELETE FROM users WHERE id = $1`, [id])
 return result;
}
export const userServices ={
    createUser,
    getUser,
    getSingleUser,
    getUserUpdated,
    userDeleted
}