const API = 'http://localhost:3001';

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

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
};

function loadSalary() {
    fetch(`${API}/api/employee/salary`, { headers })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('salary-value');
            if (data && data.total) {
                el.textContent = Number(data.total).toLocaleString('ru-RU') + ' ₽';
            } else {
                el.textContent = '0 ₽';
            }
        })
        .catch(() => {
            document.getElementById('salary-value').textContent = 'Ошибка загрузки';
        });
}

function loadDeals() {
    fetch(`${API}/api/deals/my`, { headers })
        .then(r => r.json())
        .then(deals => {
            const tbody = document.getElementById('deals-body');
            tbody.innerHTML = '';

            if (!deals || deals.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Сделок нет</td></tr>';
                return;
            }

            deals.forEach(deal => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${deal.client_name}</td>
                    <td>${deal.phone || '—'}</td>
                    <td>${deal.order_number || '—'}</td>
                    <td>${Number(deal.final_price).toLocaleString('ru-RU')} ₽</td>
                    <td>${formatStatus(deal.status)}</td>
                    <td>${new Date(deal.created_at).toLocaleDateString('ru-RU')}</td>
                    <td>
                        <button class="action-btn" onclick="deleteDeal('${deal.id}')">Удалить</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(() => {
            document.getElementById('deals-body').innerHTML =
                '<tr><td colspan="7" style="color:red;">Сервер недоступен</td></tr>';
        });
}

function formatStatus(status) {
    if (status === 'success')   return 'Завершена';
    if (status === 'cancelled') return 'Отменена';
    return 'Открыта';
}

function deleteDeal(id) {
    if (!confirm('Удалить сделку?')) return;

    fetch(`${API}/api/deals/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(r => r.json())
    .then(data => {
        console.log('Ответ сервера:', data);
        loadDeals();
        loadSalary();
    })
    .catch(err => {
        console.error('Ошибка:', err);
        alert('Ошибка удаления');
    });
}

let editingId = null;

function openModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Новая сделка';
    document.getElementById('input-name').value  = '';
    document.getElementById('input-phone').value = '';
    document.getElementById('input-order').value = '';
    document.getElementById('input-price').value = '';
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function saveDeal() {
    const client_name  = document.getElementById('input-name').value.trim();
    const phone        = document.getElementById('input-phone').value.trim();
    const order_number = document.getElementById('input-order').value.trim();
    const final_price  = document.getElementById('input-price').value.trim();

    if (!client_name || !phone || !order_number || !final_price) {
        alert('Заполните все поля!');
        return;
    }

    fetch(`${API}/api/deals`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ client_name, phone, order_number, final_price: Number(final_price) })
    })
    .then(r => r.json().then(data => ({ ok: r.ok, data })))
    .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Ошибка сервера');
        closeModal();
        loadDeals();
        loadSalary();
    })
    .catch(err => alert('Ошибка: ' + err.message));
}


loadSalary();
loadDeals();