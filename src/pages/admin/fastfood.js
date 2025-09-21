import React, { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../host/host';
import LayoutComponent from '../../components/Layout';
import styles from './FastFood.module.css';

const FastFood = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterType, setFilterType] = useState(1);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/users`);
      const sortedData = response.data.sort((a, b) => (a.orders || 0) - (b.orders || 0));
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddEditUser = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const formObj = Object.fromEntries(form.entries());

    const payload = {
      username: formObj.username,
      phone_number: formObj.phone_number,
      type: Number(formObj.type),
      orders: Number(formObj.orders) || 0,
      description: formObj.description || '',
      prosent: Number(formObj.prosent) || 0,
      is_active: formObj.is_active === 'on',
    };

    if (!currentUser) {
      if (!formObj.password) {
        alert("Password is required when adding a new user.");
        return;
      }
      payload.password = formObj.password;
    }

    try {
      if (currentUser) {
        await axios.put(`${url}/users/${currentUser.id}`, payload);
      } else {
        await axios.post(`${url}/users/register`, payload);
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Foydalanuvchini saqlashda xatolik yuz berdi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/users/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenModal = (user) => {
    setCurrentUser(user);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    handleDelete(userToDelete.id);
    setIsDeleteModalVisible(false);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  // faqat ofitsantlar (type = 1)
  const waiters = data.filter(user => user.type === 1);
  const filteredData = data
    .filter(user => user.type === filterType)
    .filter(user => (showOnlyActive ? user.is_active : true));

  // diagramma ranglari
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  return (
    <LayoutComponent>
      <div className={styles.buttonGroup}>
        {[1, 2, 3].map(type => (
          <button
            key={type}
            className={filterType === type ? styles.activeFilter : ''}
            onClick={() => setFilterType(type)}
          >
            {type === 1 ? 'Offitsant' : type === 2 ? 'FastFood' : 'Admin'}
          </button>
        ))}

        <label className={styles.activeCheckbox}>
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={() => setShowOnlyActive(!showOnlyActive)}
          />
          Faqat faol
        </label>
      </div>

      <button className={styles.addButton} onClick={() => handleOpenModal(null)}>Add User</button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone Number</th>
            <th>Type</th>
            <th>Order</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.phone_number}</td>
              <td>{user.type === 1 ? 'Offitsant' : user.type === 2 ? 'FastFood' : 'Admin'}</td>
              <td>{user.orders}</td>
              <td>{user.is_active ? 'Yes' : 'No'}</td>
              <td style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleOpenModal(user)} className={styles.editButton}>Edit</button>
                <button onClick={() => openDeleteModal(user)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <div className={styles.modal}>
          <form onSubmit={handleAddEditUser} className={styles.modalForm}>
            <h2>{currentUser ? `Edit User: ${currentUser.username}` : "Add User"}</h2>

            <label>
              Username:
              <input name="username" defaultValue={currentUser?.username || ''} required />
            </label>

            <label>
              Phone Number:
              <input name="phone_number" defaultValue={currentUser?.phone_number || ''} required />
            </label>

            <label>
              Type:
              <select name="type" defaultValue={currentUser?.type || '1'} required>
                <option value="1">Offitsant</option>
                <option value="2">FastFood</option>
                <option value="3">Admin</option>
              </select>
            </label>

            <label>
              Orders:
              <input type="number" name="orders" defaultValue={currentUser?.orders || ''} />
            </label>

            <label>
              Description:
              <textarea name="description" defaultValue={currentUser?.description || ''}></textarea>
            </label>

            <label>
              Prosent:
              <input type="number" name="prosent" defaultValue={currentUser?.prosent || ''} />
            </label>

            {!currentUser && (
              <label>
                Password:
                <input type="password" name="password" required />
              </label>
            )}

            <label className={styles.checkboxLabel}>
              Is Active:
              <div className={styles.checkboxContainer}>
                <input type="checkbox" name="is_active" defaultChecked={currentUser?.is_active || false} />
                <span className={styles.checkboxCustom}></span>
              </div>
            </label>

            <div className={styles.modalButtons}>
              <button type="submit" className={styles.submitButton}>Submit</button>
              <button type="button" className={styles.cancelButton} onClick={() => setIsModalVisible(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className={styles.modal}>
          <div className={styles.deleteModalContent}>
            <h2>Siz rostab ham {userToDelete?.username}ni o'chirmoqchimisiz?</h2>
            <div className={styles.modalButtons}>
              <button className={styles.submitButton} onClick={confirmDelete}>Yes</button>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalVisible(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </LayoutComponent>
  );
};

export default FastFood;
