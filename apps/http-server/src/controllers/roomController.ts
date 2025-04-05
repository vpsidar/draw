import { prisma } from "@repo/db/client";
import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { body, validationResult } from "express-validator";

export default class RoomController {
    private readonly router = Router();
    registerRoute(): Router {
        this.router.post('/', authenticate, this.creatRoomSchemaValidation(), this.validate, this.createRoom)
        return this.router;
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

    private readonly validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json(errors);
    }
}