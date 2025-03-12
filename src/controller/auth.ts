import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import jwt from "jsonwebtoken"
import config  from "../config.js";

interface CustomError extends Error{
    statusCode: number;
}

export const PostSignup = async (req:Request, res:Response, next:NextFunction): Promise<void>=>{
    const email:string = req.body.email;
    const name: string = req.body.name;
    const phone : number = req.body.phone;
    const password: string = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    

    try{

       const user = await User.create({email,phone, name, password: hashedPassword})
        res.json({success: true, user: user})
        return;
    }
    catch(err:unknown){
        const error = err as CustomError
        if(!error.statusCode){
            error.statusCode = 500
        }
       
        next(error);
    }
}


export const PostLogin = async (req: Request, res: Response, next: NextFunction): Promise<void>=>{
    
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
 
   
    try{
        const user = await User.findOne({where:{...(email?{email}:{phone})}})
        if(!user){
            const error = new Error("User not found") as CustomError;
            error.statusCode = 404;
            throw error;
        }
        //console.log("ksjgjk")
       const isMatchPassword = await bcrypt.compare(password, user.password)
       if(!isMatchPassword){
         res.status(400).json({message: "Password not matched"})
        return
       }
     
      
        const token = jwt.sign({id: user.id, ...(email?{email:user.email}:{phone:user.phone})},config.secret_key,{expiresIn: "1h"});
        res.status(200).json({success: true, token: token})
        return;
       
      
       
    }
    catch(err:unknown){
        const error = err as CustomError
        if(!error.statusCode){
            error.statusCode = 500
            console.log(error)
        }
       
        next(error);
    }
}

export const resetPassword = async (req:Request, res:Response, next:NextFunction)=>{

}

