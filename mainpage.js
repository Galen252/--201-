
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'titul.html';
}


const client = JSON.parse(localStorage.getItem('client') || '{}');
const userNameEl = document.getElementById('user-name');
if (userNameEl && client.first_name) {
    userNameEl.textContent = client.first_name + ' ' + client.last_name;
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    window.location.href = 'titul.html';
}


fetch('http://localhost:3001/api/cars')
    .then(r => r.json())
    .then(cars => {
        const carList = document.getElementById('car-list');
        const carsContainer = document.getElementById('cars-container');

        carList.innerHTML = '';

        if (!cars || cars.length === 0) {
            carList.innerHTML = '<p style="color:#000;">Машин нет</p>';
            return;
        }

        cars.forEach(car => {
            const carId = 'car-' + car.id;
            const name = car.brand + ' ' + car.model + ' ' + car.year;

            const menuItem = document.createElement('div');
            menuItem.textContent = name;
            menuItem.onclick = () => openTab(carId);
            carList.appendChild(menuItem);

            const tab = document.createElement('div');
            tab.id = carId;
            tab.className = 'tab-content';
            tab.innerHTML = `
                <h1>${name}</h1>
                <img class="rsphoto" src="${car.brand.toLowerCase()}${car.model.toLowerCase()}.png">
                <div class="inf">
                    <div onclick="openInfoTab('${carId}_opis')">Описание</div>
                    <div onclick="openInfoTab('${carId}_char')">Характеристика</div>
                </div>
                <div id="${carId}_opis" class="car-info">
                    <p>${car.description || 'Описание отсутствует'}</p>
                </div>
                <div id="${carId}_char" class="car-info">
                    <p>Год: ${car.year || '—'}</p>
                    <p>Цена: ${car.price ? car.price + ' ₽' : '—'}</p>
                    <p>Объём двигателя: ${car.engine_volume ? car.engine_volume + ' л' : '—'}</p>
                </div>
            `;
            carsContainer.appendChild(tab);
        });

        if (cars.length > 0) {
            openTab('car-' + cars[0].id);
        }
    })
    .catch(err => {
        document.getElementById('car-list').innerHTML = '<p style="color:red;">Сервер недоступен</p>';
        console.error('Ошибка загрузки машин:', err);
    });

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    const el = document.getElementById(tabId);
    if (el) el.style.display = 'block';
}

function openInfoTab(infoId) {
    document.querySelectorAll('.car-info').forEach(tab => {
        tab.style.display = 'none';
    });
    const el = document.getElementById(infoId);
    if (el) el.style.display = 'block';
}