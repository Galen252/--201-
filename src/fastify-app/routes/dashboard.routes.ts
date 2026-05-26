import { FastifyInstance } from 'fastify';
import { pool } from '../../config/database.js';
import { fastifyAuthMiddleware } from '../../middleware/auth.middleware.js';

export async function dashboardRoutes(app: FastifyInstance) {

    // GET /api/dashboard — аналитические данные для графиков
    app.get('/api/dashboard', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {

        // 1. Машины по маркам
        const { rows: carsByBrand } = await pool.query(`
            SELECT brand, COUNT(*)::int AS count
            FROM cars
            GROUP BY brand
            ORDER BY count DESC
        `);

        // 2. Сделки по статусам
        const { rows: dealsByStatus } = await pool.query(`
            SELECT status, COUNT(*)::int AS count
            FROM deals
            GROUP BY status
        `);

        // 3. Продажи по месяцам (последние 6 месяцев)
        const { rows: salesByMonth } = await pool.query(`
            SELECT TO_CHAR(created_at, 'MM.YYYY') AS month,
                   COUNT(*)::int                  AS count,
                   COALESCE(SUM(final_price), 0)::numeric AS total
            FROM deals
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY month
            ORDER BY month ASC
        `);

        return reply.send({ carsByBrand, dealsByStatus, salesByMonth });
    });
}
