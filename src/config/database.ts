import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    host: process.env["DB_HOST"],
    port: Number(process.env["DB_PORT"]),
    database: process.env["DB_NAME"],
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
});

pool.connect()
    .then(client => {
        console.log('PostgreSQL подключён');
        client.release();
    })
    .catch(err => {
        console.error('Ошибка подключения к PostgreSQL:', err.message);
        process.exit(1);
    });