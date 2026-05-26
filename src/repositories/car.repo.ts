import { pool } from '../config/database.js';
import { Car, CarFilter } from '../types';

const ALLOWED_SORT = new Set(['price', 'year', 'mileage', 'brand']);

export async function findAvailableCars(f: CarFilter): Promise<{ data: Car[]; total: number }> {
    const sortBy    = ALLOWED_SORT.has(f.sortBy ?? '') ? f.sortBy! : 'price';
    const sortOrder = f.sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const { rows } = await pool.query(
        `SELECT id, brand, model, year, color, price, mileage, status, description
         FROM cars
         WHERE status = 'available'
           AND ($1::varchar IS NULL OR brand ILIKE '%' || $1 || '%')
           AND ($2::int     IS NULL OR year  >= $2)
           AND ($3::int     IS NULL OR year  <= $3)
           AND ($4::numeric IS NULL OR price >= $4)
           AND ($5::numeric IS NULL OR price <= $5)
         ORDER BY ${sortBy} ${sortOrder}
         LIMIT $6 OFFSET $7`,
        [
            f.brand     ?? null,
            f.yearFrom  ?? null,
            f.yearTo    ?? null,
            f.priceFrom ?? null,
            f.priceTo   ?? null,
            f.limit     ?? 20,
            f.offset    ?? 0,
        ]
    );

    const { rows: countRows } = await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM cars
         WHERE status = 'available'
           AND ($1::varchar IS NULL OR brand ILIKE '%' || $1 || '%')
           AND ($2::int     IS NULL OR year  >= $2)
           AND ($3::int     IS NULL OR year  <= $3)
           AND ($4::numeric IS NULL OR price >= $4)
           AND ($5::numeric IS NULL OR price <= $5)`,
        [
            f.brand     ?? null,
            f.yearFrom  ?? null,
            f.yearTo    ?? null,
            f.priceFrom ?? null,
            f.priceTo   ?? null,
        ]
    );

    return { data: rows, total: countRows[0].total };
}
export async function findCarById(id: string): Promise<Car | null> {
    const { rows } = await pool.query(
        `SELECT id, brand, model, year, color, vin, price, mileage, status, description, created_at
         FROM cars WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}

// Зафиксировать просмотр
export async function logCarView(clientId: string | null, carId: string): Promise<void> {
    await pool.query(
        `INSERT INTO car_catalog_views (client_id, car_id) VALUES ($1, $2)`,
        [clientId, carId]
    );
}

// Обновить статус авто (used internal — при сделках)
export async function updateCarStatus(
    carId: string,
    status: 'available' | 'reserved' | 'sold'
): Promise<void> {
    await pool.query(`UPDATE cars SET status = $2 WHERE id = $1`, [carId, status]);
}
