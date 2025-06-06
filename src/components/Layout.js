// components/Layout.js
import React from 'react';
import { useRouter } from 'next/router';
import styles from './Layout.module.css'; // CSS faylini import qilish

const LayoutComponent = ({ children }) => {
    const router = useRouter();

    const handleMenuClick = (page) => {
        router.push(`/admin/${page}`);
    };

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div onClick={()=>window.location="/admin/"} className={styles.logo}>menu<span>go</span></div>
                <nav className={styles.nav}>
                    <button onClick={() => handleMenuClick('fastfood')}>Users</button>
                    <button onClick={() => handleMenuClick('dashboard')}>Daromat</button>
                    <button onClick={() => handleMenuClick('zakaz')}>Zakazlar</button>
                    <button onClick={() => handleMenuClick('users')}>Offitsant</button>
                </nav>
            </header>
            <main className={styles.content}>
                {children}
            </main>
            <footer className={styles.footer}>
                ©2025 Created by Your Name
            </footer>
        </div>
    );
};

export default LayoutComponent;