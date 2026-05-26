"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loginPanel = document.getElementById('panel-login');
const registerPanel = document.getElementById('panel-register');
const loginInputLogin = loginPanel === null || loginPanel === void 0 ? void 0 : loginPanel.querySelector('.login');
const passInputLogin = loginPanel === null || loginPanel === void 0 ? void 0 : loginPanel.querySelector('.pass');
const buttonLogin = loginPanel === null || loginPanel === void 0 ? void 0 : loginPanel.querySelector('.button');
const loginInputReg = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.login');
const passInputReg = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.pass');
const firstNameInput = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.firstname');
const lastNameInput = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.lastname');
const emailInput = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.email');
const numberInput = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.number');
const buttonReg = registerPanel === null || registerPanel === void 0 ? void 0 : registerPanel.querySelector('.button');
const API_BASE = 'http://localhost:3000';
if (buttonLogin) {
    buttonLogin.addEventListener('click', () => {
        const login = (loginInputLogin === null || loginInputLogin === void 0 ? void 0 : loginInputLogin.value) || '';
        const password = (passInputLogin === null || passInputLogin === void 0 ? void 0 : passInputLogin.value) || '';
        if (!login || !password) {
            alert('Заполните все поля!');
            return;
        }
        fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка сервера');
            }
            return data;
        }))
            .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.client) {
                localStorage.setItem('client', JSON.stringify(data.client));
            }
            if (data.client.login === 'admin') {
                window.location.href = 'PA.html';
            }
            else {
                window.location.href = 'http://localhost:3001/mainpage.html#token=' + data.token + '&client=' + encodeURIComponent(JSON.stringify(data.client));
            }
        })
            .catch((error) => {
            console.error('Ошибка входа:', error);
            alert('Ошибка: ' + error.message);
        });
    });
}
if (buttonReg) {
    buttonReg.addEventListener('click', () => {
        const login = (loginInputReg === null || loginInputReg === void 0 ? void 0 : loginInputReg.value) || '';
        const password = (passInputReg === null || passInputReg === void 0 ? void 0 : passInputReg.value) || '';
        const first_name = (firstNameInput === null || firstNameInput === void 0 ? void 0 : firstNameInput.value) || '';
        const last_name = (lastNameInput === null || lastNameInput === void 0 ? void 0 : lastNameInput.value) || '';
        const email = (emailInput === null || emailInput === void 0 ? void 0 : emailInput.value) || '';
        const number = (numberInput === null || numberInput === void 0 ? void 0 : numberInput.value) || '';
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
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка сервера');
            }
            return data;
        }))
            .then((data) => {
            alert('Регистрация прошла успешно! Теперь войдите.');
            const loginTab = document.querySelectorAll('.tab')[0];
            loginTab === null || loginTab === void 0 ? void 0 : loginTab.click();
        })
            .catch((error) => {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка: ' + error.message);
        });
    });
}