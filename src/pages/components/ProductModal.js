import { useEffect, useState } from 'react';
import styles from './styles/ProductModal.module.css';
import axios from 'axios';
import url from '../../host/host';

const ProductModal = ({ isOpen, onClose, data }) => {
    const [categories1, setCategories1] = useState([]);
    const [typeFile1, setTypeFile1] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [orders, setOrders] = useState('');
    useEffect(() => {
        if (isOpen) {
            document.querySelector('#productModal').style.display = 'block';
        } else {
            document.querySelector('#productModal').style.display = 'none';
        }
    }, [isOpen]);
   useEffect(() => {
    if (data && isOpen) {
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        setCategoryId(data.category_id || '');
        setImageInput(data.image || '');
        setOrders(data.orders || ''); // <-- Qo‘shildi
        setTypeFile1(false);
    }
}, [data, isOpen]);

 const handleSubmit1 = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('orders', orders);

    if (typeFile1) {
        const file = document.querySelector('#fileInput').files[0];
        formData.append('image', file);
    } else {
        formData.append('image', imageInput);
    }

    axios.put(`${url}/products/fastfood/${data.id}`, formData)
        .then(res => {
            alert("Mahsulot o'zgartirildi!");
            onClose(); // Modalni yopish
        })
        .catch(err => {
            alert("Xatolik yuz berdi: " + err.message);
        });
};



    const getData1 = () => {
        axios.get(`${url}/categories`).then(res1 => {
            const my_fastfood = JSON.parse(localStorage.getItem('user'));
            const mycategory = res1.data.filter(item => item.fastfood_id === my_fastfood.id);
            setCategories1(mycategory);
        }).catch(err => {
            console.error(err);
        });
    };

    useEffect(() => {
        getData1();
    }, []);

    return (
        <div id="productModal" className={styles.modal}>
            <div className={styles.modal__content}>
                <span className={styles.modal__close} onClick={onClose}>&times;</span>
                <h2 className={styles.modal__title}>Mahsulot Ma'lumotlari</h2>
                <form className={styles.modal__form} onSubmit={handleSubmit1}>
                    <input
                        className={styles.modal__input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Mahsulot Nomi"
                        required
                    />

                    <select
                        className={styles.modal__input}
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Tanlang</option>
                        {categories1.map((item, key) => (
                            <option key={key} value={item.id}>{item.name}</option>
                        ))}
                    </select>

                    <div>
                        <input
                            type="checkbox"
                            checked={typeFile1}
                            onChange={(e) => setTypeFile1(e.target.checked)}
                        /> File
                    </div>

                    {typeFile1 ? (
                        <input
                            id="fileInput"
                            className={styles.modal__input}
                            type="file"
                            required
                        />
                    ) : (
                        <input
                            id="imageInput"
                            className={styles.modal__input}
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            type="text"
                            placeholder="Rasm URL"
                            required
                        />
                    )}

                    <textarea
                        className={styles.modal__textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Taʼrif"
                        required
                    />
<input
    className={styles.modal__input}
    value={orders}
    onChange={(e) => setOrders(e.target.value)}
    type="number"
    placeholder="Tartib raqami (orders)"
    required
/>

                    <input
                        className={styles.modal__input}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        placeholder="Narxi"
                        required
                    />

                    <button className={styles.modal__button} type="submit">Saqlash</button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;