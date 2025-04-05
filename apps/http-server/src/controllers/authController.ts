import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {prisma} from "@repo/db/client";
import {comparePassword, generateToken, hashPassowrd} from "@repo/backend-common/utils"
export default class AuthController {
    private readonly router = Router();

    registerRoute():Router {
        this.router.post("/login",this.loginValidationRules(),this.validate, this.login)
        this.router.post("/signup", this.singUpValidationRules(), this.validate, this.signUp)
        return this.router;
    }
    private readonly login = async (req:Request,res:Response, next:NextFunction) => { 
        try {
            let {email, password} = req.body;
            const user = await prisma.user.findFirst({
                where:{
                    email,

                }
            })
            if(!user){
                res.status(404).json({message:'User not found'});
                return
            }
            const isMatch = await comparePassword(password,user.password);
            if(!isMatch){
                res.status(401).json({message: 'Invalid credentials'})
                return
            }
            const token = generateToken({userId:user.id,email: user.email});
            res.status(200).json({message: 'Login successful', token})
        } catch (error) {
            
        }
    }
    private readonly signUp = async (req:Request, res: Response, next:NextFunction) => {
        // return res.status(200).json({message:'a'})
        try {
            const data = req.body;
            const user = await prisma.user.findFirst({
                where: {
                    email: data.email
                }
            })
            if(user){
              res.status(412).json({message: 'User already exists'});
              return
            }
            const hashedPassword = await hashPassowrd(data.password.trim());
            const newUser = await prisma.user.create({
                data: {
                    ...data,
                    password:hashedPassword
                }
            });
            const token = generateToken({userId:newUser.id, email:newUser.email});
            res.status(200).json({message: 'User created successfully', token})
        } catch (error) {
            next(error)
        }
    }
    private readonly loginValidationRules = () => {
        return [
            body('email').exists().withMessage('Email is required'),
            body('password').exists().withMessage('Password is required')
        ]
    }
    private readonly singUpValidationRules = () => {
        return [
            body('firstName').exists().withMessage('firstName is required'),
            body('lastName').exists().withMessage('lastName is required'),
            body('email').exists().withMessage('email is reuired'),
            body('password').exists().withMessage('password is required')
        ]
    }
    private readonly validate = (req:Request,res:Response, next:NextFunction) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        res.status(422).json(errors);
    }
}