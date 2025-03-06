import { RequestHandler, Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export default class AuthController {
    private readonly router = Router();

    registerRoute():Router {
        this.router.post("/login",this.loginValidationRules(),this.validate, this.login())
        return this.router;
    }
    private login():RequestHandler {
        return async (req:Request,res:Response) => {
            
            res.status(200).json({message:'a'})
        }
    }
    private signUp():RequestHandler {
        return (req:Request, res:Response) => {
            const data = req.body;
            
            res.status(200).json({message: 'SignUp code'});
        }
    }
    private readonly loginValidationRules = () => {
        return [
            body('email').exists().withMessage('Email is required'),
            body('password').exists().withMessage('Password is required')
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