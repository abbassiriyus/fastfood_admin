import React, { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../host/host';
import LayoutComponent from '../../components/Layout';
import styles from './FastFood.module.css'; // CSS fayli
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Icons

const FastFood = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [filterType, setFilterType] = useState(1); // Default filter type
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

   const fetchData = async () => {
    const response = await axios.get(`${url}/users`);
    const sortedData = response.data.sort((a, b) => (a.orders || 0) - (b.orders || 0));
    setData(sortedData);
};

    const handleAddEditUser = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    

        if (currentUser) {
            await axios.put(`${url}/users/${currentUser.id}`, formData);
        } else {
            await axios.post(`${url}/users/register`, formData);
        }
        setIsModalVisible(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${url}/users/${id}`);
        fetchData();
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

    // Filter data based on selected type
    const filteredData = data.filter(user => user.type === filterType);

    return (
        <LayoutComponent>
            <div className={styles.buttonGroup}>
                <button onClick={() => setFilterType(1)}>Offitsant</button>
                <button onClick={() => setFilterType(2)}>FastFood</button>
                <button onClick={() => setFilterType(3)}>Admin</button>
            </div>
            <button className={styles.addButton} onClick={() => handleOpenModal(null)}>Add User</button>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Phone Number</th>
                        <th>Type</th>
                        <th>order</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.phone_number}</td>
                            <td>{user.type}</td>
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
                            <select name="type" defaultValue={currentUser?.type || ''} required>
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