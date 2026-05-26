CREATE TABLE cars (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    brand       VARCHAR(100)  NOT NULL,
    model       VARCHAR(100)  NOT NULL,
    year        INT           NOT NULL CHECK (year >= 1900 AND year <= 2100),
    color       VARCHAR(50),
    vin         VARCHAR(17)   UNIQUE,
    price       NUMERIC(14,2) NOT NULL CHECK (price > 0),
    mileage     INT           NOT NULL DEFAULT 0 CHECK (mileage >= 0),
    description TEXT,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

ALTER TABLE cars ADD COLUMN hp integer NOT NULL DEFAULT 0;

INSERT INTO cars (brand, model, year, color, vin, price, mileage, description) 
VALUES 
    ('audi', 'rs3', 2020, 'grey', '457692991865', 3500000, 66000, 'не бита не крашена, обслужевалась каждые 5к пробега'),
    ('audi', 'rs5', 2021, 'blue', '853762965937', 8900000, 76000, 'не бита не крашена, обслужевалась каждые 5к пробега'),
    ('audi', 'rs6', 2020, 'black', '089437939223', 11000000, 11000, 'не бита не крашена, обслужевалась каждые 5к пробега'),
    ('audi', 'rs7', 2024, 'white', '38970537649', 17000000, 6000, 'не бита не крашена, обслужевалась каждые 5к пробега');


UPDATE cars SET hp = 400 WHERE model = 'rs3' AND brand = 'audi';
UPDATE cars SET hp = 450 WHERE model = 'rs5' AND brand = 'audi';
UPDATE cars SET hp = 600 WHERE model = 'rs6' AND brand = 'audi';
UPDATE cars SET hp = 600 WHERE model = 'rs7' AND brand = 'audi';
        #заполняем ячейки данными 
        
CREATE TABLE employees (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name     VARCHAR(100)  NOT NULL,
    last_name      VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    position       VARCHAR(100)  NOT NULL,
    base_salary    NUMERIC(12,2) NOT NULL DEFAULT 0,
    bonus_percent  NUMERIC(5,2)  NOT NULL DEFAULT 3.00,
    hired_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);
ALTER TABLE employees ADD COLUMN login VARCHAR(50) UNIQUE;
ALTER TABLE employees ADD COLUMN password_hash VARCHAR(255);
INSERT INTO employees (first_name, last_name, email, position, base_salary, bonus_percent, login, password_hash)
VALUES ('Admin', 'Admin', 'admin2@auto.ru', 'Менеджер', 50000, 5.00, 'admin','$2b$10$FMeMkyIEU/GEuQyyt/1DDedmsQrWqu.TrlZh0Apj81UOGzpkrqety' );

CREATE TABLE clients (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    login         VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE,
    phone         VARCHAR(20),
    
);

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    client_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    order_number VARCHAR(100),
    final_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
