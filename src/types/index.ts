export interface Client {
    id: string;
    login: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: Date;
}

export interface Employee {
    id: string;
    login: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    base_salary: number;
    bonus_percent: number;
    hired_at: Date;
}

export interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    vin: string;
    price: number;
    status: 'available' | 'reserved' | 'sold';
    mileage: number;
    description: string;
    created_at: Date;
}

export interface Consultation {
    id: string;
    client_id: string;
    employee_id: string;
    car_id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    notes: string;
    scheduled_at: Date;
    created_at: Date;
}

export interface Deal {
    id: string;
    client_id: string;
    employee_id: string;
    car_id: string;
    final_price: number;
    status: 'open' | 'success' | 'cancelled';
    employee_bonus: number;
    created_at: Date;
    closed_at: Date | null;
}

export interface JwtPayload {
    id: string;
    role: 'client' | 'employee';
}

export interface CarFilter {
    brand?: any;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    limit: number;
    offset: number;
}