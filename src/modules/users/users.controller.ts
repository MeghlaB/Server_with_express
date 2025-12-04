import { Request, Response } from "express"
import { pool } from "../../config/db"
import { userServices } from "./user.services"

const createUser = async (req: Request, res: Response) => {
    const { name, email, age, phn, address } = req.body
    try {
        const result =  await userServices.createUser(name, email, age, phn, address )
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


}

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser()
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
}

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getSingleUser(req.params.id!)
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
}

const getUserUpdated = async (req: Request, res: Response) => {
    const { name, email, age, phn, address } = req.body
    try {
        const result = await userServices.getUserUpdated(name, email, age, phn, address,req.params.id as string)
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
}

const userDeleted = async (req: Request, res: Response) => {
    try {
        const result = await userServices.userDeleted(req.params.id!)
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
}


export const userControllers = {
    createUser,
    getUser,
    getSingleUser,
    getUserUpdated,
    userDeleted,
}