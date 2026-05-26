import dotenv from 'dotenv';

dotenv.config();

import expressApp from './src/express-app/app.js';
import {buildFastifyApp} from './src/fastify-app/app.js';

const EXPRESS_PORT = Number(process.env["EXPRESS_PORT"]) || 3000;
const FASTIFY_PORT = Number(process.env["FASTIFY_PORT"]) || 3001;

async function start() {
    expressApp.listen(EXPRESS_PORT, '0.0.0.0', () => {
        console.log(` Express запущен: http://localhost:${EXPRESS_PORT}`);
        console.log(`   Auth:    POST /auth/register`);
        console.log(`   Auth:    POST /auth/login`);
    });
    const fastify = await buildFastifyApp();
    await fastify.listen({port: FASTIFY_PORT, host: '0.0.0.0'});
    console.log(` Fastify запущен: http://localhost:${FASTIFY_PORT}`);
    console.log(`   Авто:         GET  /api/cars`);
    console.log(`   Сделки:       POST /api/deals`);
}

start().catch(err => {
    console.error('Ошибка запуска:', err);
    process.exit(1);
});

