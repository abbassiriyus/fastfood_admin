import React from 'react';
import styles from '../styles/footer.module.css'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <p>&copy; 2025 Sizning Kompaniya Nomingiz. Barcha huquqlar himoyalangan.</p>
                    <ul className={styles.footerLinks}>
                        <li><a href="#about">Biz Haqimizda</a></li>
                        <li><a href="#services">Xizmatlar</a></li>
                        <li><a href="#contact">Aloqa</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;