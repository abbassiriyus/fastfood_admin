'use client';

import React, { useEffect, useState } from 'react';
import LayoutComponent from '../../components/Layout';
import axios from 'axios';
import url from '../../host/host';
import styles from '../../styles/UsersTable.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openSalaryId, setOpenSalaryId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/users`);
        const filteredUsers = response.data.filter(user => user.type === 1);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Foydalanuvchilarni olishda xatolik:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleSalaryRow = (userId) => {
    setOpenSalaryId(prevId => (prevId === userId ? null : userId));
  };

const handlePaySalary = async (userId, price) => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('price', price*1);

    // 1. PUT - count_seen ni 0 qilish
    await axios.put(`${url}/users/${userId}/reset-count`, { count_seen: 0 });

    // 2. POST - tarixoylik jadvaliga yozish
    await axios.post(`${url}/tarixoylik`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Frontend holatini yangilash
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, count_seen: 0 } : user
      )
    );
  } catch (error) {
    console.error('Oylikni berishda xatolik:', error);
  }
};


  return (
    <LayoutComponent>
      <div className={styles.container}>
        <h2>Foydalanuvchilar ro'yxati</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number || 'Noma’lum'}</td>
                  <td>{user.is_active ? 'Faol' : 'Nofaol'}</td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => toggleSalaryRow(user.id)}
                    >
                      {openSalaryId === user.id ? "Yopish" : "Oylikni ko‘rsat"}
                    </button>

                  </td>
                </tr>
                {openSalaryId === user.id && (
                  <tr className={styles.salaryRow}>
                    <td colSpan="6" style={{ backgroundColor: '#f9f9f9' }}>
                      <strong>Oylik:</strong> {user.count_seen ? `${user.count_seen} so'm` : 'Mavjud emas'}
                      {user.count_seen > 0 && (
                        <button
                          className={`${styles.button} ${styles['button--secondary']}`}
                          onClick={() => handlePaySalary(user.id,user.count_seen*user.prosent/100)}
                          style={{ marginLeft: '20px' }}
                        >
                          Oylikni berish
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutComponent>
  );
}
