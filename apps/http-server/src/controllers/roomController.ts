import { prisma } from "@repo/db/client";
import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { body, validationResult } from "express-validator";

export default class RoomController {
    private readonly router = Router();
    registerRoute(): Router {
        this.router.post('/', authenticate, this.creatRoomSchemaValidation(), this.validate, this.createRoom);
        this.router.post('/chats', authenticate, this.createChatSchemaValidation(), this.validate, this.createChat);
        this.router.get('/:roomId/chats', authenticate, this.getRoomChats);
        this.router.get('/:slug', authenticate, this.getRoomBySlug);
        return this.router;
    }
    private readonly getRoomBySlug = async (req:Request, res:Response, next:NextFunction) => {
        const slug = req.params.slug as string;
        try {
            const room = await prisma.room.findFirst({
                where:{
                    name:slug
                }
            })
            if(!room){
                res.status(412).json('Invalid slug');
                return;
            }
            res.json({message:'Success', room});
        } catch (error) {
            next(error)
        }
    }
    private readonly getRoomChats = async (req:Request, res:Response, next:NextFunction) => {
        const roomId:string = req.params.roomId as string;
        try {
            const room = await prisma.room.findFirst({
                where:{
                    id: roomId
                }
            })
            if(!room){
                res.status(412).json({
                    message: 'Invalid room id'
                })
                return
            }
            const chats = await prisma.chat.findMany({
                where: {
                    roomId: roomId
                },
                orderBy:{
                    id: 'desc'
                },
                take:50
            })
            res.json({messages:chats});
            return
        } catch (error) {
            next(error)
            return
        }
        

    }
    private readonly createRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const user = await prisma.user.findFirst({
                where: {
                    id: data.userId as string
                }
            })
            if (!user) {
                res.json(400).json({ message: 'Invalid userid' });
                return
            }
            const room = await prisma.room.create({
                data: {
                    name: data.name,
                    adminId: data.userId
                }
            })
            res.status(200).json({ message: 'Room created successfully', roomId: room.id })
        } catch (error) {
            next(error)
        }
    }
    private creatRoomSchemaValidation() {
        return [
            body('name').exists().withMessage('name is required'),
            body('userId').exists().withMessage('userId is required')
        ]
    }
    private createChatSchemaValidation() {
        return [
            body('userId').exists().withMessage('userId is required'),
            body('message').exists().withMessage('message is required'),
            body('roomId').exists().withMessage('roomId is required')
        ]
    }
    private readonly createChat = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const {message, roomId, userId} = req.body;
            const room = await prisma.room.findFirst({
                where: {
                    id: roomId
                }
            })
            if(!room){
                res.status(412).json({message: 'Invalid room id'});
                return
            }
            
            const chat = await prisma.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })
            res.json({message:'Chat saved successfully'})
        } catch (error) {
            next(error)
        }
    }
    private readonly validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json(errors);
    }
}