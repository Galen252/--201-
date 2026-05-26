import {pool} from '../config/database.js';
import {Client} from '../types';

export async function createClient(
    login: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string
): Promise<Omit<Client, 'password_hash'>> {
    const {rows} = await pool.query(
        `INSERT INTO clients (login, password_hash, first_name, last_name, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, login, first_name, last_name, email, phone, created_at`,
        [login, passwordHash, firstName, lastName, email, phone]
    );
    return rows[0];
}

export async function findClientByLogin(login: string): Promise<Client | null> {
    const {rows} = await pool.query(
        `SELECT id,
                login,
                password_hash,
                first_name,
                last_name,
                email,
                phone,
                created_at
         FROM clients
         WHERE login = $1`,
        [login]
    );
    return rows[0] ?? null;
}

export async function findClientById(id: string): Promise<Omit<Client, 'password_hash'> | null> {
    const {rows} = await pool.query(
        `SELECT id, login, first_name, last_name, email, phone, created_at
         FROM clients
         WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}