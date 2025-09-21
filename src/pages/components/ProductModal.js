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
            document.querySelector('#productModal').style.display = 'flex';
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
            setOrders(data.orders || '');
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
                onClose();
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
        
        {/* Modal sarlavhasi */}
        <h4 className={styles.modal__title}>Mahsulotni tahrirlash</h4>

        <form className={styles.modal__form} onSubmit={handleSubmit1}>
            {/* Mahsulot Nomi */}
            <h3 className={styles.inputLabel}>Mahsulot Nomi</h3>
            <input
                className={styles.modal__input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Mahsulot Nomi"
                required
            />

            {/* Kategoriya */}
            <h3 className={styles.inputLabel}>Kategoriya</h3>
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

            {/* Rasm yuklash */}
            <h3 className={styles.inputLabel}>Rasm yuklash</h3>
            <div>
                <input
                    type="checkbox"
                    checked={typeFile1}
                    onChange={(e) => setTypeFile1(e.target.checked)}
                /> Rasm yuklash
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

            {/* Ta'rif */}
            <h3 className={styles.inputLabel}>Ta'rif</h3>
            <textarea
                className={styles.modal__textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Taʼrif"
                required
            />

            {/* Tartib raqami */}
            <h3 className={styles.inputLabel}>Tartib raqami (orders)</h3>
            <input
                className={styles.modal__input}
                value={orders}
                onChange={(e) => setOrders(e.target.value)}
                type="number"
                placeholder="Tartib raqami (orders)"
                required
            />

            {/* Narxi */}
            <h3 className={styles.inputLabel}>Narxi</h3>
            <input
                className={styles.modal__input}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Narxi"
                required
            />

            {/* Saqlash tugmasi */}
            <button className={styles.modal__button} type="submit">Saqlash</button>
        </form>
    </div>
</div>


    );
};

export default ProductModal;
