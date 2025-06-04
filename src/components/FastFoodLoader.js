import React from 'react';
import styles from '../styles/FastFoodLoader.module.css';

const FastFoodLoader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader}>
                <div className={styles.burger}></div>
                <div className={styles.fries}></div>
                <div className={styles.drink}></div>
            </div>
            <p>Yuklanmoqda...</p>
        </div>
    );
};

export default FastFoodLoader;