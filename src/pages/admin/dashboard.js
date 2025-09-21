"use client";

import React, { useEffect, useState } from 'react';
import LayoutComponent from '../../components/Layout';
import axios from 'axios';
import url from '../../host/host';
import styles from './Dashboard.module.css';  // CSS module importi

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userEarnings, setUserEarnings] = useState({});
  const [zakazProducts, setZakazProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prosent, setProsent] = useState(10); // Default 10%

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchType2Users = async () => {
      try {
        const response = await axios.get(`${url}/users`);
        const filtered = response.data.filter(user => user.type === 2);
        setUsers(filtered);
      } catch (error) {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
      }
    };

    fetchType2Users();
  }, []);

  const handleOpenModal = async (userId) => {
    setSelectedUser(userId);

    const [productRes, zakazProductsRes, procentRes] = await Promise.all([
      axios.get(`${url}/products`),
      axios.get(`${url}/zakaz_products`),
      axios.get(`${url}/protsent`),
    ]);

    const productlar = productRes.data;
    const zakazProducts = zakazProductsRes.data.filter(zp => zp.fastfood_id == userId);
    const procentValue = procentRes.data[0]?.foiz || 10;
    setProsent(procentValue);

    for (let i = 0; i < zakazProducts.length; i++) {
      const product = productlar.find(p => p.id === zakazProducts[i].product_id);
      if (product) {
        zakazProducts[i].name = product.name;
      }
      zakazProducts[i].foizSum = (zakazProducts[i].price * zakazProducts[i].count * procentValue) / 100;
      zakazProducts[i].total = zakazProducts[i].price * zakazProducts[i].count;
      zakazProducts[i].totalWithFoiz = zakazProducts[i].total + zakazProducts[i].foizSum;
    }

    setZakazProducts(zakazProducts);
    setCurrentPage(1); // modal ochilganda doim 1-sahifadan boshlansin
    setShowModal(true);
  };

 const handleFilterByDate = async () => {
  if (!startDate || !endDate) {
    alert("Iltimos, sanalarni kiriting!");
    return;
  }

  try {
    const [productRes, zakazProductsRes, procentRes] = await Promise.all([
      axios.get(`${url}/products`),
      axios.get(`${url}/zakaz_products`),
      axios.get(`${url}/protsent`),
    ]);

    const productlar = productRes.data;
    const procentValue = procentRes.data[0]?.foiz || 10;

    const filteredZakaz = zakazProductsRes.data.filter((zp) => {
      const date = new Date(zp.created_at);
      return (
        zp.fastfood_id == selectedUser &&
        date >= new Date(startDate) &&
        date <= new Date(endDate)
      );
    });

    // Enrich with product name and foiz calculation
    for (let i = 0; i < filteredZakaz.length; i++) {
      const product = productlar.find(p => p.id === filteredZakaz[i].product_id);
      if (product) {
        filteredZakaz[i].name = product.name;
      }
      filteredZakaz[i].foizSum = (filteredZakaz[i].price * filteredZakaz[i].count * procentValue) / 100;
      filteredZakaz[i].total = filteredZakaz[i].price * filteredZakaz[i].count;
      filteredZakaz[i].totalWithFoiz = filteredZakaz[i].total + filteredZakaz[i].foizSum;
    }

    setProsent(procentValue);
    setZakazProducts(filteredZakaz);
    setCurrentPage(1);
  } catch (error) {
    console.error("Filtrlashda xatolik:", error);
    alert("Xatolik yuz berdi. Qayta urinib ko‘ring.");
  }
};


  const calculateEarnings = async (userId) => {
    try {
      const response = await axios.get(`${url}/zakaz_products`);
      const zakazProducts = response.data.filter(zp => zp.fastfood_id === userId);

      let total = 0;
      for (let i = 0; i < zakazProducts.length; i++) {
        const product = zakazProducts[i];
        total += product.price * product.count ;
      }

      setUserEarnings(prev => ({
        ...prev,
        [userId]: Math.round(total),
      }));
    } catch (error) {
      console.error("Hisoblashda xatolik:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const totalSum = zakazProducts.reduce((sum, item) => sum + item.total, 0);
  const totalFoiz = zakazProducts.reduce((sum, item) => sum + item.foizSum, 0);
  const totalWithFoiz = zakazProducts.reduce((sum, item) => sum + item.totalWithFoiz, 0);

  // ✅ Pagination hisoblash
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = zakazProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(zakazProducts.length / itemsPerPage);

  return (
    <LayoutComponent>
      <div className={styles.layout}>
        <div className={styles.tableContainer}>
          <h2>Foydalanuvchilar (FastFood)</h2>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>#</th>
                <th className={styles.tableHeaderCell}>Ism</th>
                <th className={styles.tableHeaderCell}>Telefon</th>
                <th className={styles.tableHeaderCell}>Faolmi</th>
                <th className={styles.tableHeaderCell}>Ishlab topgan</th>
                <th className={styles.tableHeaderCell}>Zakazlar</th>
                <th className={styles.tableHeaderCell}>Hisoblash</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{user.username}</td>
                  <td className={styles.tableCell}>{user.phone_number || "Nomaʼlum"}</td>
                  <td className={styles.tableCell}>{user.is_active ? '✅' : '❌'}</td>
                  <td className={styles.tableCell}>
                    {userEarnings[user.id] !== undefined
                      ? `${userEarnings[user.id].toLocaleString()} so'm`
                      : '-'}
                  </td>
                  <td className={styles.tableCell}>
                    <button onClick={() => handleOpenModal(user.id)} className={styles.tableCellButton}>
                      Zakazlar
                    </button>
                  </td>
                  <td className={styles.tableCell}>
                    <button onClick={() => calculateEarnings(user.id)} className={styles.tableCellButton}>
                      Hisoblash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && selectedUser && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalHeader}>Zakazlar va Productlar (User: {selectedUser})</h2>
              <button onClick={handleCloseModal} className={styles.modalCloseButton}>Yopish</button>

              <div className={styles.inputContainer}>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button onClick={handleFilterByDate} className={styles.button}>Filtrlash</button>
              </div>

              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Zakaz ID</th>
                    <th className={styles.tableHeaderCell}>Product ID</th>
                    <th className={styles.tableHeaderCell}>Nomi</th>
                    <th className={styles.tableHeaderCell}>Narxi</th>
                    <th className={styles.tableHeaderCell}>Miqdori</th>
                    <th className={styles.tableHeaderCell}>Jami</th>
                    <th className={styles.tableHeaderCell}>Foizdan</th>
                    <th className={styles.tableHeaderCell}>Jami + Foiz</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product, index) => (
                    <tr key={index} className={styles.tableRow}>
                      <td className={styles.tableCell}>{product.zakaz_id}</td>
                      <td className={styles.tableCell}>{product.product_id}</td>
                      <td className={styles.tableCell}>{product.name}</td>
                      <td className={styles.tableCell}>{product.price}</td>
                      <td className={styles.tableCell}>{product.count}</td>
                      <td className={styles.tableCell}>{product.total}</td>
                      <td className={styles.tableCell}>{product.foizSum.toFixed(2)}</td>
                      <td className={styles.tableCell}>{product.totalWithFoiz.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ Pagination controls */}
              <div className={styles.pagination}>
                <button
                  disabled={currentPage === 1}
                      className={styles.button}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  ⬅️ Oldingi
                </button>
                <span>Sahifa {currentPage} / {totalPages}</span>
                <button
                className={styles.button}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Keyingi ➡️
                </button>
              </div>

              <div className={styles.summaryBox}>
                <p><strong>Jami narx:</strong> {totalSum.toLocaleString()} so'm</p>
                <p><strong>Jami foiz:</strong> {totalFoiz.toLocaleString()} so'm</p>
                <p><strong>Jami yakuniy:</strong> {totalWithFoiz.toLocaleString()} so'm</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutComponent>
  );
}
