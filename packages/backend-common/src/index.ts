import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET ?? 'YOUR_SECRET';
const JWT_EXPIRES_IN = '4h';

export const hashPassowrd = async (plainPassword: string): Promise<string> => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hash);
};

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const verifyToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}
