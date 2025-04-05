import { verifyToken } from '@repo/backend-common/utils';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Missing or invalid token" });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token as string);
    (req as any).user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return
  }
};