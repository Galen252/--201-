import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {createClient, findClientByLogin} from '../../repositories/client.repo.js';
import {findEmployeeByLogin} from '../../repositories/employee.repo.js';

const router = Router();
const JWT_SECRET = process.env["JWT_SECRET"] || 'change_me';

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {login, password, first_name, last_name, email, phone} = req.body;

        if (!login || !password || !first_name || !last_name) {
            return res.status(400).json({error: 'Заполните обязательные поля'});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const client = await createClient(login, passwordHash, first_name, last_name, email, phone);

        res.status(201).json({message: 'Регистрация успешна', client});
    } catch (err: any) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({error: 'Логин уже занят'});
        }
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const {login, password} = req.body;

        if (!login || !password) {
            return res.status(400).json({error: 'Укажите логин и пароль'});
        }

        const employee = await findEmployeeByLogin(login);
        if (employee) {
            const isValid = await bcrypt.compare(password, employee.password_hash);
            if (!isValid) {
                return res.status(401).json({error: 'Неверный логин или пароль'});
            }

            const token = jwt.sign(
                {id: employee.id, role: 'employee'},
                JWT_SECRET,
                {expiresIn: '24h'}
            );

            return res.json({
                token,
                client: {
                    id: employee.id,
                    login: employee.login,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                }
            });
        }

        const client = await findClientByLogin(login);
        if (!client) {
            return res.status(401).json({error: 'Неверный логин или пароль'});
        }

        const isValid = await bcrypt.compare(password, client.password_hash);
        if (!isValid) {
            return res.status(401).json({error: 'Неверный логин или пароль'});
        }

        const token = jwt.sign(
            {id: client.id, role: 'client'},
            JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.json({
            token,
            client: {
                id: client.id,
                login: client.login,
                first_name: client.first_name,
                last_name: client.last_name,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }
});

export default router;