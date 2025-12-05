// higher order function return  korbe function k

import { NextFunction, Request, Response } from "express";
import jwt from"jsonwebtoken"
import config from "../config";
const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        console.log("Auth Token:", token);
        if(!token){
            return res.status(500).json({
                message:"You are not allowed"
            })
            
        }
        const decoded = jwt.verify(token,config.jwtSecret as string)
        console.log(decoded)
        next();
    };
};

export default auth;