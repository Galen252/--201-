import Fastify from 'fastify';
import { carRoutes } from './routes/cars.routes.js';
import { dealRoutes } from './routes/deal.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import fastifyCors from "@fastify/cors";

export async function buildFastifyApp() {
    const app = Fastify({ logger: true });

    await app.register(fastifyCors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    });
    await app.register(carRoutes);
    await app.register(dealRoutes);
    await app.register(dashboardRoutes);

    app.get('/api/health', async () => ({ status: 'ok', server: 'fastify' }));

    return app;
}
