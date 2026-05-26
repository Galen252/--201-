// Читаем токен из URL-хэша (если пришли с порта 3000)
const hash = window.location.hash.substring(1);
if (hash) {
    const params = new URLSearchParams(hash);
    if (params.get('token')) {
        localStorage.setItem('token', params.get('token'));
        localStorage.setItem('client', params.get('client'));
        history.replaceState(null, '', window.location.pathname);
    }
}

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'http://localhost:3000/titul.html';
}

const client = JSON.parse(localStorage.getItem('client') || '{}');
const userNameEl = document.getElementById('user-name');
if (userNameEl && client.first_name) {
    userNameEl.textContent = client.first_name + ' ' + client.last_name;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    window.location.href = 'http://localhost:3000/titul.html';
}

function buildQuery() {
    const params = new URLSearchParams();
    const yearFrom  = document.getElementById('f-yearFrom').value;
    const yearTo    = document.getElementById('f-yearTo').value;
    const priceFrom = document.getElementById('f-priceFrom').value;
    const priceTo   = document.getElementById('f-priceTo').value;
    const sortBy    = document.getElementById('f-sortBy').value;
    const sortOrder = document.getElementById('f-sortOrder').value;

    if (yearFrom)  params.set('yearFrom',  yearFrom);
    if (yearTo)    params.set('yearTo',    yearTo);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo)   params.set('priceTo',   priceTo);
    params.set('sortBy',    sortBy);
    params.set('sortOrder', sortOrder);

    return params.toString();
}

function loadCars() {
    const query = buildQuery();
    fetch(`http://localhost:3001/api/cars?${query}`)
        .then(r => r.json())
        .then(response => {
            const cars = Array.isArray(response) ? response : (response.data || []);

            const carList = document.getElementById('car-list');
            const carsContainer = document.getElementById('cars-container');

            carList.innerHTML = '';
            carsContainer.innerHTML = '';

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
                        <p>Цена: ${car.price ? Number(car.price).toLocaleString('ru-RU') + ' ₽' : '—'}</p>
                        <p>Пробег: ${car.mileage ? car.mileage + ' км' : '—'}</p>
                    </div>
                `;
                carsContainer.appendChild(tab);
            });

            if (cars.length > 0) openTab('car-' + cars[0].id);
        })
        .catch(err => {
            document.getElementById('car-list').innerHTML = '<p style="color:red;">Сервер недоступен</p>';
            console.error('Ошибка загрузки машин:', err);
        });
}

function applyFilters() { loadCars(); }

function resetFilters() {
    document.getElementById('f-yearFrom').value  = '';
    document.getElementById('f-yearTo').value    = '';
    document.getElementById('f-priceFrom').value = '';
    document.getElementById('f-priceTo').value   = '';
    document.getElementById('f-sortBy').value    = 'price';
    document.getElementById('f-sortOrder').value = 'ASC';
    loadCars();
}

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    const el = document.getElementById(tabId);
    if (el) el.style.display = 'block';
}

function openInfoTab(infoId) {
    document.querySelectorAll('.car-info').forEach(t => t.style.display = 'none');
    const el = document.getElementById(infoId);
    if (el) el.style.display = 'block';
}

loadCars();
