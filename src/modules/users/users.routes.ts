import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userControllers } from './users.controller'
import logger from '../../middleware/logger'
import auth from '../../middleware/auth'


const router = express.Router()

router.post('/',userControllers.createUser )

router.get("/",logger ,auth() , userControllers.getUser)
router.get("/:id",userControllers.getSingleUser)
router.put("/:id",userControllers.getUserUpdated)
router.delete("/:id",userControllers.userDeleted)

export const   UserRoutes= router