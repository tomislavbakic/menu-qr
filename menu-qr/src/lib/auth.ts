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

type Admin = {
  id: string;
  username: string;
};

export function generateJwtToken(admin: Admin) {
  return jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
}


