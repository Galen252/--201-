const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'http://localhost:3000/titul.html';
}

const COLORS = ['#0b0f30','#216180','#4a90d9','#6cb4e4','#a8d5f5','#c8e6fa'];

fetch('http://localhost:3001/api/dashboard', {
    headers: { 'Authorization': 'Bearer ' + token }
})
.then(r => r.json())
.then(data => {
    renderBrandChart(data.carsByBrand);
    renderDealsChart(data.dealsByStatus);
    renderSalesChart(data.salesByMonth);
})
.catch(() => alert('Ошибка загрузки данных'));

function renderBrandChart(rows) {
    new Chart(document.getElementById('chartBrand'), {
        type: 'bar',
        data: {
            labels: rows.map(r => r.brand),
            datasets: [{
                label: 'Кол-во машин',
                data: rows.map(r => r.count),
                backgroundColor: COLORS,
                borderRadius: 4,
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function renderDealsChart(rows) {
    const statusMap = { open: 'Открыта', success: 'Завершена', cancelled: 'Отменена' };
    new Chart(document.getElementById('chartDeals'), {
        type: 'pie',
        data: {
            labels: rows.map(r => statusMap[r.status] || r.status),
            datasets: [{
                data: rows.map(r => r.count),
                backgroundColor: COLORS,
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function renderSalesChart(rows) {
    new Chart(document.getElementById('chartSales'), {
        type: 'line',
        data: {
            labels: rows.map(r => r.month),
            datasets: [{
                label: 'Сделок',
                data: rows.map(r => r.count),
                borderColor: '#0b0f30',
                backgroundColor: 'rgba(11,15,48,0.1)',
                tension: 0.3,
                fill: true,
                yAxisID: 'y',
            }, {
                label: 'Сумма (₽)',
                data: rows.map(r => Number(r.total)),
                borderColor: '#216180',
                backgroundColor: 'rgba(33,97,128,0.1)',
                tension: 0.3,
                fill: true,
                yAxisID: 'y1',
            }]
        },
        options: {
            scales: {
                y:  { beginAtZero: true, position: 'left',  title: { display: true, text: 'Сделок' } },
                y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Сумма ₽' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}
