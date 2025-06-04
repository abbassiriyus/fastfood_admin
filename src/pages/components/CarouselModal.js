import React, { useEffect, useState } from 'react';
import styles from './styles/CarouselModal.module.css';

const CarouselModal = ({ item, onClose, onSubmit, setImage }) => {
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (item) {
            setImageFile(null); // Modal ochilganda rasmni tozalash
        }
    }, [item]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImageFile(URL.createObjectURL(file)); // Rasmni ko'rsatish uchun
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>{item ? 'Carousel Tahrirlash' : 'Yangi Carousel Qo\'shish'}</h2>
                <form onSubmit={onSubmit}>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        required 
                    />
                    {imageFile && <img src={imageFile} alt="Preview" className={styles.previewImage} />}
                    <button className={styles.button} type="submit">Saqlash</button>
                </form>
            </div>
        </div>
    );
};

export default CarouselModal;