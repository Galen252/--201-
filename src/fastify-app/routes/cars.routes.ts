import {FastifyInstance} from 'fastify';
import {findAvailableCars, findCarById} from '../../repositories/car.repo.js';
import path from 'path';
import {fileURLToPath} from "url";
import fastifyStatic from '@fastify/static';

const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

export async function carRoutes(app: FastifyInstance) {

    app.register(fastifyStatic, {
        root: path.join(dirname, '../../../public'),
        prefix: '/'
    });

    app.get('/api/cars', async (req, reply) => {
        const q = req.query as any;
        // @ts-ignore
        const cars = await findAvailableCars({
            brand:     q.brand,
            yearFrom:  q.yearFrom  ? Number(q.yearFrom)  : undefined,
            yearTo:    q.yearTo    ? Number(q.yearTo)    : undefined,
            priceFrom: q.priceFrom ? Number(q.priceFrom) : undefined,
            priceTo:   q.priceTo   ? Number(q.priceTo)   : undefined,
            sortBy:    q.sortBy,
            sortOrder: q.sortOrder === 'DESC' ? 'DESC' : 'ASC',
            limit:     q.limit  ? Number(q.limit)  : 20,
            offset:    q.offset ? Number(q.offset) : 0,
        });
        return reply.send(cars);
    });

    app.get<{ Params: { id: string } }>('/api/cars/:id', async (req, reply) => {
        const car = await findCarById(req.params.id);
        if (!car) return reply.code(404).send({error: 'Не найден'});
        return reply.send(car);
    });
}
