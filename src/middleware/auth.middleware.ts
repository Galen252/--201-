import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {FastifyRequest, FastifyReply} from 'fastify';
import {JwtPayload} from '../types';

const JWT_SECRET: string = process.env['JWT_SECRET'] || 'change_me';

export function expressAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({error: 'Токен не предоставлен'});
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({error: 'Токен не предоставлен'});
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({error: 'Токен недействителен или истёк'});
    }
}

export async function fastifyAuthMiddleware(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        reply.code(401).send({error: 'Токен не предоставлен'});
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        reply.code(401).send({error: 'Токен не предоставлен'});
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
        (req as any).user = payload;
    } catch {
        reply.code(401).send({error: 'Токен недействителен или истёк'});
    }
}