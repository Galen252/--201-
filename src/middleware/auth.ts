import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import pool from '../database';

interface DecodedToken {
    id: number;
    iat?: number;
    exp?: number;
}

interface UserFromDB {
    id: number;
    name: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserFromDB;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        // Проверяем наличие JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }

        // Верифицируем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        // Валидируем decoded данные
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token structure'
            });
        }

        // Получаем пользователя из БД
        const result = await pool.query<UserFromDB>(
            'SELECT id, name FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        // Добавляем пользователя в объект запроса
        req.user = result.rows[0];
        next();

    } catch (error) {
        // Обработка специфичных ошибок JWT
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Общая ошибка
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token validation failed'
        });
    }
};