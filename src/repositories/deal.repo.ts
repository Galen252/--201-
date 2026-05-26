import {pool} from '../config/database.js';


export async function createDeal(client_name: string, employee_id: string, order_number: string, final_price: number) {
    const res = await pool.query(
        `INSERT INTO deals (client_name, employee_id, order_number, final_price)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [client_name, employee_id, order_number, final_price]
    );
    return res.rows[0];
}

export async function closeDeal(id: string, status: string) {
    const res = await pool.query(
        `UPDATE deals
         SET status = $1
         WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return res.rows[0] ?? null;
}

// Сделки сотрудника
export async function getEmployeeDeals(employee_id: string) {
    const res = await pool.query(
        `SELECT *
         FROM deals
         WHERE employee_id = $1
         ORDER BY created_at DESC`,
        [employee_id]
    );
    return res.rows;
}

// Удалить сделку
export async function deleteDeal(id: string) {
    const res = await pool.query(
        `DELETE
         FROM deals
         WHERE id = $1 RETURNING *`,
        [id]
    );
    return res.rows[0] ?? null;
}

// Сумма продаж сотрудника
export async function getEmployeeSalary(employee_id: string) {
    const res = await pool.query(
        `SELECT e.base_salary,
                e.bonus_percent,
                COALESCE(SUM(d.final_price), 0)                                         AS total_sales,
                e.base_salary + COALESCE(SUM(d.final_price), 0) * e.bonus_percent / 100 AS total
         FROM employees e
                  LEFT JOIN deals d ON d.employee_id = e.id AND d.status = 'success'
         WHERE e.id = $1
         GROUP BY e.id`,
        [employee_id]
    );
    return res.rows[0] || null;
}