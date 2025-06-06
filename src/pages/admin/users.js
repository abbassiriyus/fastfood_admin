import React, { useEffect, useState } from 'react';
import LayoutComponent from '../../components/Layout';
import axios from 'axios';
import url from '../../host/host';
import styles from '../../styles/UsersTable.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openSalaryId, setOpenSalaryId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [salaryHistoryOpen, setSalaryHistoryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalSalaryToBePaid, setTotalSalaryToBePaid] = useState(0);
  const zakazPerPage = 10;
  const [openOrderId, setOpenOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/users`);
      const filteredUsers = response.data.filter(user => user.type === 1);
      setUsers(filteredUsers);
      calculateTotalSalary(filteredUsers);
    } catch (error) {
      console.error('Foydalanuvchilarni olishda xatolik:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Zakazlarni olish
  const fetchUserOrders = async (userId, date) => {
    try {
      const [zakazRes, zakazProductsRes, productsRes] = await Promise.all([
        axios.get(`${url}/zakaz`),
        axios.get(`${url}/zakaz_products`),
        axios.get(`${url}/products`),
      ]);

      const zakazlar = zakazRes.data;
      const zakazProducts = zakazProductsRes.data;
      const allProducts = productsRes.data;

      const filteredOrders = zakazlar.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().slice(0, 10);
        return order.user_id === userId && orderDate === date;
      });

      const enrichedOrders = filteredOrders.map(order => {
        const relatedZakazProducts = zakazProducts
          .filter(zp => zp.zakaz_id === order.id)
          .map(zp => {
            const productInfo = allProducts.find(p => p.id === zp.product_id);
            return {
              ...zp,
              name: productInfo ? productInfo.name : 'Nomaʼlum mahsulot',
              image: productInfo ? productInfo.image : 'Nomaʼlum mahsulot',
            };
          });

        return {
          ...order,
          zakaz_products: relatedZakazProducts,
        };
      });

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Zakazlarni olishda xatolik:', error);
    }
  };
const [totalSeenCount, setTotalSeenCount] = useState(0);

  const toggleAccordion = (orderId) => {
    setOpenOrderId(prev => (prev === orderId ? null : orderId));
  };

  // Oyliklarni hisoblash
  const calculateTotalSalary = (users) => {
   let totalSeenCount = 0;
let totalSalary = 0;

users.forEach((user) => {
  if (user.count_seen > 0) {
    totalSalary += (user.count_seen * user.prosent) / 100;
    totalSeenCount += user.count_seen;
  }
});

setTotalSalaryToBePaid(totalSalary);
setTotalSeenCount(totalSeenCount);

  };

  // Tarixoylikni olish (user_id bo‘yicha filtrlash)
  const fetchSalaryHistory = async (userId) => {
    try {
      const response = await axios.get(`${url}/tarixoylik`);
      
      // Faqatgina tanlangan foydalanuvchiga tegishli tarixni filtrlash
      const filteredHistory = response.data.filter(item => item.user_id === userId);
      setSalaryHistory(filteredHistory);
      setSalaryHistoryOpen(true);
    } catch (error) {
      console.error('Tarixoylikni olishda xatolik:', error);
    }
  };

  // Oylik berish
  const handlePaySalary = async (userId, price) => {
    const confirmPay = window.confirm("Rostdan ham oylik bermoqchimisiz?");
    if (!confirmPay) return;

    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('price', price * 1);

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

  // Pagination logic for orders
  const paginatedOrders = orders.slice(currentPage * zakazPerPage, (currentPage + 1) * zakazPerPage);
  const totalPages = Math.ceil(orders.length / zakazPerPage);

  return (
    <LayoutComponent>
      <div className={styles.container}>
        <h2>Foydalanuvchilar ro'yxati</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Telefon</th>
              <th>foizi</th>
              <th>Status</th>
              <th>Oylik</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  
                  <td>{user.phone_number || 'Noma’lum'}</td>
                  <td>{user.prosent || 'Noma’lum'}</td>
                  <td>{user.is_active ? 'Faol' : 'Nofaol'}</td>
                  <td>
                    {user.count_seen
                      ? `${(user.count_seen * user.prosent) / 100} so‘m`
                      : 'Mavjud emas'}
                  </td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => fetchSalaryHistory(user.id)}
                    >
                      Oylik tarixi
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => {
                        setSelectedUser(user);
                        setModalOpen(true);
                        setSelectedDate('');
                        setOrders([]);
                      }}
                      style={{marginLeft:'10px'}}
                    >
                      Zakazlar
                    </button>
                    {user.count_seen > 0 && (
                      <button
                        className={`${styles.button} ${styles['button--secondary']}`}
                        onClick={() => handlePaySalary(user.id, user.count_seen * user.prosent / 100)}
                        style={{ marginLeft: '10px' }}
                      >
                        Oylikni berish
                      </button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
    
  <div className={styles.totalSalaryWrapper}>
    

          <h3>Tushan umumiy summa: </h3>

          <div className={styles.totalSalary}>
            <strong>{totalSeenCount} so‘m</strong>
          </div>
        </div>
        <div className={styles.totalSalaryWrapper}>
    

          <h3>Bugun berilishi kerak bo'lgan umumiy oylik: </h3>

          <div className={styles.totalSalary}>
            <strong>{totalSalaryToBePaid.toLocaleString()} so‘m</strong>
          </div>
        </div>
      </div>

      {modalOpen && selectedUser && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {selectedUser.username} — Zakazlar
            </h3>

            <label className={styles.label}>
              📅 Sana tanlang:
              <input
                type="date"
                value={selectedDate}
                className={styles.dateInput}
                onChange={(e) => {
                  const date = e.target.value;
                  setSelectedDate(date);
                  fetchUserOrders(selectedUser.id, date);
                }}
              />
            </label>

            {selectedDate && (
              <>
                <h4 className={styles.ordersTitle}>
                  {selectedDate} uchun zakazlar:
                </h4>
                <ul className={styles.orderList}>
                  {paginatedOrders.map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader} onClick={() => toggleAccordion(order.id)}>
                        🧾 Stol: {order.number_stol} — Sana: {order.created_at.slice(0, 10)} — Soat: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {openOrderId === order.id && (
                        <div className={styles.orderContent}>
                          <ul className={styles.productList}>
                            {order.zakaz_products.map(p => (
                              <li key={p.id} className={styles.productItem}>
                                <img src={p.image} className={styles.productImage} />
                                <span>{p.name} — {p.count} dona — {p.price.toLocaleString()} so‘m</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </ul>
              </>
            )}

            <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
              ❌ Yopish
            </button>
          </div>
        </div>
      )}

      {salaryHistoryOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Berilgan oyliklar tarixi</h3>
            <div className={styles.salaryHistoryWrapper}>
              {salaryHistory.length > 0 ? (
                <ul className={styles.orderList}>
                  {salaryHistory.map((item, index) => (
                    <li key={item.id} className={styles.salaryHistoryItem}>
                      <span>
                        <strong>{index + 1}.</strong>{' '}
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>{' '}
                      — <span>{item.price.toLocaleString()} so‘m</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Hali oylik berilmagan.</p>
              )}
            </div>
            <button className={styles.closeButton} onClick={() => setSalaryHistoryOpen(false)}>
              ❌ Yopish
            </button>
          </div>
        </div>
      )}
    </LayoutComponent>
  );
}
