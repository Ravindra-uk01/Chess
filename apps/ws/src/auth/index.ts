import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const extractUserId = (token: string): string => {
    try {
        const decode = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
        return decode.userId || decode.id || '';
    } catch {
        return '';
    }
}