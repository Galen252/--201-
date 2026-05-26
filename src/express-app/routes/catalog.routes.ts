import {Router, Request, Response} from 'express';
import {findAvailableCars, findCarById, logCarView} from '../../repositories/car.repo.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const cars = await findAvailableCars({
            brand: req.query["brand"] as string | undefined,
            yearFrom: req.query["yearFrom"] ? Number(req["query"]["yearFrom"]) : undefined,
            yearTo: req.query["yearTo"] ? Number(req.query["yearTo"]) : undefined,
            priceFrom: req.query["priceFrom"] ? Number(req.query["priceFrom"]) : undefined,
            priceTo: req.query["priceTo"] ? Number(req.query["priceTo"]) : undefined,
            limit: req.query["limit"] ? Number(req.query["limit"]) : 20,
            offset: req.query["offset"] ? Number(req.query["offset"]) : 0,
        });
        res.json(cars);
    } catch {
        res.status(500).json({error: 'Ошибка загрузки каталога'});
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const car = await findCarById(req.params.id);
        if (!car) return res.status(404).json({error: 'Автомобиль не найден'});

        const clientId = (req as any).user?.id ?? null;
        await logCarView(clientId, car.id);

        res.json(car);
    } catch {
        res.status(500).json({error: 'Ошибка загрузки автомобиля'});
    }
});

export default router;