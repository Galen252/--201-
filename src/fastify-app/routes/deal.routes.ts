import {FastifyInstance} from 'fastify';
import {fastifyAuthMiddleware} from '../../middleware/auth.middleware.js';
import {createDeal, closeDeal, getEmployeeDeals, deleteDeal, getEmployeeSalary} from '../../repositories/deal.repo.js';

export async function dealRoutes(app: FastifyInstance) {

    app.post('/api/deals', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {
        const {client_name, phone, order_number, final_price} = req.body as any;
        const employeeId = (req as any).user.id;

        if (!client_name || !order_number || !final_price || !phone) {
            return reply.code(400).send({error: 'Укажите client_name, order_number, final_price'});
        }

        const deal = await createDeal(client_name, employeeId, order_number, final_price);
        return reply.code(201).send(deal);
    });

    app.patch<{ Params: { id: string } }>('/api/deals/:id/close', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {
        const {status} = req.body as any;

        if (!['success', 'cancelled'].includes(status)) {
            return reply.code(400).send({error: 'status должен быть success или cancelled'});
        }

        const deal = await closeDeal(req.params.id, status);
        if (!deal) return reply.code(404).send({error: 'Сделка не найдена'});

        return reply.send(deal);
    });

    app.get('/api/deals/my', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {
        const employeeId = (req as any).user.id;
        const deals = await getEmployeeDeals(employeeId);
        return reply.send(deals);
    });

    app.delete<{ Params: { id: string } }>('/api/deals/:id', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {
        const deleted = await deleteDeal(req.params.id);
        if (!deleted) return reply.code(404).send({error: 'Сделка не найдена'});
        return reply.send({message: 'Сделка удалена'});
    });

    app.get('/api/employee/salary', {
        preHandler: fastifyAuthMiddleware
    }, async (req, reply) => {
        const employeeId = (req as any).user.id;
        const salary = await getEmployeeSalary(employeeId);
        return reply.send(salary);
    });

}