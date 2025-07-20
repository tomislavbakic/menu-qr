// src/lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // možeš da proveriš i rolu ako hoćeš
    } catch (err) {
        return null;
    }
}

export function generateJwtToken(admin: { id: number; username: string }) {
    return jwt.sign({
        id: admin.id.toString,
        username: admin.username
    }, JWT_SECRET, { expiresIn: '7d' });
}


