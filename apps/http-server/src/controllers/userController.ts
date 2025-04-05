import { Router } from "express";

export default class UserController {
    private readonly router = Router();
    registerRoute():Router{
        this.router.get('/')
        return this.router;
    }
}