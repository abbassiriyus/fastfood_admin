"use client"
import React, { useState } from 'react';
import axios from 'axios';
import s from '../styles/index.module.css';
import url from '../host/host';

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        axios.post(`${url}/users/login`, formData)
            .then((response) => {
                if (response.status === 200) {
                sessionStorage.setItem('token',response.data.token)
                localStorage.setItem("user",JSON.stringify(response.data.user))
                if(response.data.user.type==1){
                 window.location="/ofitsant"
                }else if(response.data.user.type==3){
                    window.location="/admin"
                }else if(response.data.user.type==2){
                    window.location="/fastfood"
                }else{
                    window.location="/"
                }
                    // Muvaffaqiyatli kirish (masalan, yo'naltirish yoki xabar ko'rsatish)
                    console.log('Login successful');
                }
            })
            .catch((error) => {
                // Xatolarni boshqarish (masalan, xato xabarini ko'rsatish)
                console.error('Login failed:', error.response ? error.response.data : error.message);
            });
    };

    return (
        <div>
            <div className={s.loginContainer}>
                <form className={s.loginForm} onSubmit={handleSubmit}>
                    <h1 className={s.loginForm__title}>Login</h1>
                    <h1 style={{ color: '#2b2e31' }} className={s.loginForm__title} id="time"></h1>

                    <div className={s.loginForm__group}>
                        <label className={s.loginForm__label} htmlFor="username">Foydalanuvchi nomi:</label>
                        <input
                            className={s.loginForm__input}
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={s.loginForm__group}>
                        <label className={s.loginForm__label} htmlFor="password">Parol:</label>
                        <input
                            className={s.loginForm__input}
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className={s.loginForm__button} type="submit">Kirish</button>
                    <p className={s.loginMessage}>Hisobingiz yo'qmi? <a className={s.loginMessage__link} href="#">Ro'yxatdan o'ting</a></p>
                </form>
            </div>
        </div>
    );
}