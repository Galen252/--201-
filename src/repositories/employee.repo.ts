import {pool} from '../config/database.js';

export async function findEmployeeByLogin(login: string) {
    const {rows} = await pool.query(
        `SELECT *
         FROM employees
         WHERE login = $1`,
        [login]
    );
    return rows[0] || null;
}