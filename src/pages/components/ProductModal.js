import { useEffect, useState } from 'react';
import styles from './styles/ProductModal.module.css';
import axios from 'axios';
import url from '../../host/host';

const ProductModal = ({ isOpen, onClose, data }) => {
    const [categories1, setCategories1] = useState([]);
    const [typeFile1, setTypeFile1] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.querySelector('#productModal').style.display = 'block';
        } else {
            document.querySelector('#productModal').style.display = 'none';
        }
    }, [isOpen]);

    const handleSubmit1 = (e) => {
        e.preventDefault();

        // FormData ob'ektini yaratamiz
        const formData = new FormData();
        formData.append('name', document.querySelector('#productName').value);
        formData.append('category_id', document.querySelector('#categorySelect').value);
        formData.append('description', document.querySelector('#description').value);
        formData.append('price', document.querySelector('#price').value);

        if (typeFile1) {
            const fileInput = document.querySelector('#fileInput').files[0];
            formData.append('image', fileInput);
        } else {
            formData.append('image', document.querySelector('#imageInput').value);
        }

        axios.put(`${url}/products/fastfood/${data.id}`, formData)
            .then(res => {
                alert("Mahsulot qo'shildi!");
                getData1();
                onClose();
            })
            .catch(err => {
                alert('Xatolik yuz berdi. Ma\'lumotlarni tekshiring');
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
                        id="productName"
                        className={styles.modal__input}
                        defaultValue={data && data.name}
                        type="text"
                        placeholder="Mahsulot Nomi"
                        required
                    />
                    <select
                        id="categorySelect"
                        defaultValue={data && data.category_id}
                        className={styles.modal__input}
                        required
                    >
                        <option value="">Tanlang</option>
                        {categories1.map((item, key) => (
                            <option key={key} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <div>
                        <input
                            onChange={(e) => setTypeFile1(e.target.checked)}
                            type="checkbox"
                            id="fileCheckbox"
                        /> File
                    </div>
                    <input
                        id={typeFile1 ? "fileInput" : "imageInput"}
                        className={styles.modal__input}
                        defaultValue={data && data.image}
                        type={typeFile1 ? "file" : "text"}
                        placeholder="Rasm URL"
                        required
                    />
                    <textarea
                        id="description"
                        defaultValue={data && data.description}
                        className={styles.modal__textarea}
                        placeholder="Ta'rif"
                        required
                    />
                    <input
                        id="price"
                        className={styles.modal__input}
                        defaultValue={data && data.price}
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