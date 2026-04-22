CREATE DATABASE ovner;   #создание базы данных 


CREATE TABLE car (model TEXT, price BIGINT, km INTEGER , year DATE);   #создаем таблицу с машинами и пишем условия для ячейки 
INSERT INTO car( model, price , km , year) VALUES ('Audi rs5', '6500000', '5000', '2018-02-22'), 
  ('Audi rs6', '6700000', '8000', '2020-02-22'), 
  ('Audi rs7', '8700000', '13000', '2022-02-22'), 
  ('Audi rs3', '4000000', '5600', '2024-02-22');
        #заполняем ячейки данными 
        
CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(50), date TIMESTAMP DEFAULT NOW());  #создаем таблицу с пользователями 
INSERT INTO users(name) VALUES ('Стив алмазов'), ('Bob Alma'), ('Piter Graf'), ('Maksim Inshin');   #заполняяем данными 

CREATE TABLE users (id SERIAL PRIMARY KEY,name VARCHAR(50), contract_number INT DEFAULT floor(random() * 9000 + 1000)::int); 
#бытка для номеров заказа 
