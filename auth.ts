const loginPanel = document.getElementById('panel-login');
const registerPanel = document.getElementById('panel-register');

const loginInputLogin = loginPanel?.querySelector('.login') as HTMLInputElement | null;
const passInputLogin = loginPanel?.querySelector('.pass') as HTMLInputElement | null;
const buttonLogin = loginPanel?.querySelector('.button') as HTMLButtonElement | null;

const loginInputReg = registerPanel?.querySelector('.login') as HTMLInputElement | null;
const passInputReg = registerPanel?.querySelector('.pass') as HTMLInputElement | null;
const firstNameInput = registerPanel?.querySelector('.firstname') as HTMLInputElement | null;
const lastNameInput = registerPanel?.querySelector('.lastname') as HTMLInputElement | null;
const emailInput = registerPanel?.querySelector('.email') as HTMLInputElement | null;
const numberInput = registerPanel?.querySelector('.number') as HTMLInputElement | null;
const buttonReg = registerPanel?.querySelector('.button') as HTMLButtonElement | null;

const API_BASE = 'http://localhost:3000';

interface LoginResponse {
    token: string;
    client: {
        id: string;
        login: string;
        first_name: string;
        last_name: string;
    };
}

interface RegisterResponse {
    message: string;
    client: {
        id: string;
        login: string;
        first_name: string;
        last_name: string;
        email: string;
        number: string;
        created_at: string;
    };
}

interface ErrorResponse {
    error: string;
}

if (buttonLogin) {
    buttonLogin.addEventListener('click', (): void => {
        const login: string = loginInputLogin?.value || '';
        const password: string = passInputLogin?.value || '';

        if (!login || !password) {
            alert('Заполните все поля!');
            return;
        }

        fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        })
        .then(async (response: Response): Promise<LoginResponse> => {
            const data: LoginResponse | ErrorResponse = await response.json();
            if (!response.ok) {
                throw new Error((data as ErrorResponse).error || 'Ошибка сервера');
            }
            return data as LoginResponse;
        })
        .then((data: LoginResponse): void => {
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.client) {
                localStorage.setItem('client', JSON.stringify(data.client));
            }
            if (data.client.login === 'admin') {
            window.location.href = 'PA.html';
            } else {
            window.location.href = 'mainpage.html';
            }
        })
        .catch((error: Error): void => {
            console.error('Ошибка входа:', error);
            alert('Ошибка: ' + error.message);
        });
    });
}

if (buttonReg) {
    buttonReg.addEventListener('click', (): void => {
        const login: string = loginInputReg?.value || '';
        const password: string = passInputReg?.value || '';
        const first_name: string = firstNameInput?.value || '';
        const last_name: string = lastNameInput?.value || '';
        const email: string = emailInput?.value || '';
        const number: string = numberInput?.value || '';

        if (!login || !password || !first_name || !last_name) {
            alert('Заполните все обязательные поля (логин, пароль, имя, фамилия)!');
            return;
        }

        if (password.length < 4) {
            alert('Пароль должен быть не менее 4 символов!');
            return;
        }

        fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password, first_name, last_name, email, number })
        })
        .then(async (response: Response): Promise<RegisterResponse> => {
            const data: RegisterResponse | ErrorResponse = await response.json();
            if (!response.ok) {
                throw new Error((data as ErrorResponse).error || 'Ошибка сервера');
            }
            return data as RegisterResponse;
        })
        .then((data: RegisterResponse): void => {
            alert('Регистрация прошла успешно! Теперь войдите.');
            const loginTab = document.querySelectorAll('.tab')[0] as HTMLButtonElement;
            loginTab?.click();
        })
        .catch((error: Error): void => {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка: ' + error.message);
        });
    });
}