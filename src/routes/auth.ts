import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database';

const router = express.Router();


interface UserPayload {
    id: number;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env["NODE_ENV"] !== 'production',
    sameSite: 'Strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000,
}

const generateToken = (id: number): string => {
    return jwt.sign({ id }, process.env["JWT_SECRET"] as string, {
        expiresIn: '30d'
    });
}

router.post("/register", async (req: Request, res: Response): Promise<Response> => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Email, username and password are required' });
    }

    try {
        
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        const token = generateToken(newUser.rows[0].id);

        res.cookie('token', token, cookieOptions);

        return res.status(201).json({ user: newUser.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/login", async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userData = user.rows[0];
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(userData.id);

        res.cookie('token', token, cookieOptions);

        return res.json({
            user: {
                id: userData.id,
                name: userData.username,
                email: userData.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/me',(req: Request, res: Response): Response => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.json({ user: req.user });
});

router.post('/logout', (req: Request, res: Response): Response => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
    return res.json({ message: 'Logged out' });
});

export default router;
