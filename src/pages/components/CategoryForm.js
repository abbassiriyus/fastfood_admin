import { useEffect, useState } from 'react';
import styles from './styles/CategoryForm.module.css';
import axios from 'axios';
import url from '../../host/host';
import Modal from 'react-modal';

const CategoryForm = () => {
  const [category, setCategory] = useState([]);
  const [select_id, setSelect_id] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState('');

  const getData = () => {
    axios.get(`${url}/categories`)
      .then(res => {
        const a = res.data
          .filter(item => item.fastfood_id === JSON.parse(localStorage.getItem('user')).id)
          .sort((x, y) => x.orders - y.orders);
        setCategory(a);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const DeleteData = (id) => {
    axios.delete(`${url}/categories/${id}`).then(res => {
      getData();
    });
  };

  const postData = () => {
    const formData = new FormData();
    formData.append('name', document.querySelector('#nomi').value);
    formData.append('orders', document.querySelector('#order').value);
    formData.append('fastfood_id', (JSON.parse(localStorage.getItem('user'))).id);
    axios.post(`${url}/categories`, formData).then(res => {
      getData();
    }).catch(err => {
      console.error(err);
    });
  };

  const EditData = (id) => {
    const itemToEdit = category.find(item => item.id === id);
    setEditName(itemToEdit.name);
    setEditOrder(itemToEdit.orders);
    setSelect_id(id);
    setModalIsOpen(true);
  };

  const handleEditSubmit = () => {
    const updatedData = {
      name: editName,
      orders: editOrder,
    };
    axios.put(`${url}/categories/fastfood/${select_id}`, updatedData).then(res => {
      getData();
      setModalIsOpen(false);
    }).catch(err => {
      console.error(err);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.formContainer}>
      <form>
        <input id='nomi' className={styles.input} type="text" placeholder="Kategoriya nomi" />
        <input id='order' className={styles.input} type="number" placeholder="Tartib raqami" />
        <button className={styles.button} onClick={postData} type="button">Qo'shish</button>
      </form>
      <ul className={styles.list}>
        {category.map(item => (
          <li className={styles.listItem} key={item.id}>
            No: {item.orders} <h4>{item.name}</h4>
            <button className={styles.deleteButton_edit} onClick={() => EditData(item.id)}>Taxrirlash</button>
            <button className={styles.deleteButton} onClick={() => DeleteData(item.id)}>O'chirish</button>
          </li>
        ))}
      </ul>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2 className={styles.modalTitle}>Edit Category</h2>
        <input
          className={styles.modalInput}
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Kategoriya nomi"
        />
        <input
          className={styles.modalInput}
          value={editOrder}
          onChange={e => setEditOrder(e.target.value)}
          type="number"
          placeholder="Tartib raqami"
        />
        <button className={styles.modalButton} onClick={handleEditSubmit}>Saqlash</button>
        <button className={`${styles.modalButton} ${styles.closeButton}`} onClick={() => setModalIsOpen(false)}>Yopish</button>
      </Modal>
    </div>
  );
};

export default CategoryForm;