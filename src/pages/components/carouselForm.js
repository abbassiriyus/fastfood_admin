import { useEffect, useState } from 'react';
import axios from 'axios';
import url from "../../host/host";
import styles from './styles/CarouselForm.module.css';
import CarouselModal from './CarouselModal'; // Modal komponentini import qilish

const CarouselForm = () => {
    const [image, setImage] = useState(null);
    const [carouselItems, setCarouselItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const getCarouselItems = () => {
        axios.get(`${url}/carousel`)
            .then(res => setCarouselItems(res.data.filter(item=>item.fastfood_id==(JSON.parse(localStorage.getItem('user'))).id)))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        getCarouselItems();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('fastfood_id',(JSON.parse(localStorage.getItem('user'))).id)
        if (isModalOpen) {
            axios.put(`${url}/carousel/${currentItem.id}`, formData)
                .then(res => {
                    alert("Carousel yangilandi!");
                    setIsModalOpen(false);
                    setCurrentItem(null);
                    getCarouselItems();
                })
                .catch(err => console.error(err));
        } else {
            axios.post(`${url}/carousel`, formData)
                .then(res => {
                    alert("Carousel qo'shildi!");
                    getCarouselItems();
                })
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setImage(null); // Rasmni tozalash
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        axios.delete(`${url}/carousel/${id}`)
            .then(res => {
                alert("Carousel o'chirildi!");
                getCarouselItems();
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={styles.carouselContainer}>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    required 
                />
                <button className={styles.button} type="submit">
                    Qo'shish
                </button>
            </form>
            <ul className={styles.carouselList}>
                {carouselItems.map(item => (
                    <li key={item.id} className={styles.carouselItem}>
                        <img src={item.image} alt="Carousel" className={styles.carouselImage} />
                        <button onClick={() => handleEdit(item)} className={styles.editButton}>Tahrirlash</button>
                        <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>O'chirish</button>
                    </li>
                ))}
            </ul>
            {isModalOpen && (
                <CarouselModal 
                    item={currentItem} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleSubmit}
                    setImage={setImage}
                />
            )}
        </div>
    );
};

export default CarouselForm;