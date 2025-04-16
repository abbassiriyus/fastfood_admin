import React from 'react'
import s from "./login.module.css"
export default function page() {
    return (
        <div>   <div className={s.loginContainer}>

            <form className={s.loginForm}>

                <h1 className={s.loginForm__title}>Login</h1>
                <h1 style={{ color: '#2b2e31' }} className={s.loginForm__title} id="time"></h1>

                <div className={s.loginForm__group}>
                    <label className={s.loginForm__label} for="username">Foydalanuvchi nomi:</label>
                    <input className={s.loginForm__input} type="text" id="username" name="username" required />
                </div>
                <div className={s.loginForm__group}>
                    <label className={s.loginForm__label} for="password">Parol:</label>
                    <input className={s.loginForm__input} type="password" id="password" name="password" required />
                </div>
                <button className={s.loginForm__button} type="submit">Kirish</button>
                <p className={s.loginMessage}>Hisobingiz yo'qmi? <a className={s.loginMessage__link} href="#">Ro'yxatdan o'ting</a></p>

            </form>
        </div></div>
    )
}
