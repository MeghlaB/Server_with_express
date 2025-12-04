import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userControllers } from './users.controller'


const router = express.Router()

router.post('/',userControllers.createUser )

router.get("/",userControllers.getUser)
router.get("/:id",userControllers.getSingleUser)
router.put("/:id",userControllers.getUserUpdated)
router.delete("/:id",userControllers.userDeleted)

export const   UserRoutes= router