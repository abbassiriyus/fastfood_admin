"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import url from "../../host/host";
import LayoutComponent from "../../components/Layout";
import styles from "./zakaz.module.css";

export default function ZakazPage() {
    const [zakazlar, setZakazlar] = useState([]);
    const [zakazProducts, setZakazProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [fastfoods, setFastfoods] = useState([]);
    const [expandedZakazId, setExpandedZakazId] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Filter state'lar
    const [filterStol, setFilterStol] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterUser, setFilterUser] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Har sahifada 10 ta zakaz
    const [protsent, setProtsent] = useState(10)

    useEffect(() => {
        const fetchData = async () => {
            const [zakazRes, zakazProductsRes, usersRes, productsRes, protsentRes] = await Promise.all([
                axios.get(`${url}/zakaz`),
                axios.get(`${url}/zakaz_products`),
                axios.get(`${url}/users`),
                axios.get(`${url}/products`),
                axios.get(`${url}/protsent`)
            ]);

            if (protsentRes.data.length > 0) {
                setProtsent(protsentRes.data[0].foiz); // yoki .percent yoki .value, qanday kelishiga qarab tekshirasiz
            }
            const allUsers = usersRes.data;
            setUsers(allUsers.filter(u => u.type === 1));
            setFastfoods(allUsers.filter(u => u.type === 2));

            setZakazlar(zakazRes.data);
            setZakazProducts(zakazProductsRes.data);
            setProducts(productsRes.data);
        };

        fetchData();
    }, []);

    const toggleAccordion = (zakazId) => {
        setExpandedZakazId(expandedZakazId === zakazId ? null : zakazId);
    };

    const getUserName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.username : "Nomaʼlum";
    };

    const getProductName = (productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.name : "Nomaʼlum";
    };

    const getFastFoodName = (fastfoodId) => {
        const fastfood = fastfoods.find((f) => f.id === fastfoodId);
        return fastfood ? fastfood.username : "Nomaʼlum";
    };
    const getFilteredTotal = () => {
  let subtotal = 0;

  filteredZakazlar.forEach((zakaz) => {
    const zakazItems = zakazProducts.filter((zp) => zp.zakaz_id === zakaz.id);
    zakazItems.forEach((item) => {
      subtotal += item.price * item.count;
    });
  });

  const addedPercent = subtotal * protsent / 100;
  const final = subtotal + addedPercent;
  return { subtotal, addedPercent, final };
};
    const getZakazTotal = (zakazId) => {
        const items = zakazProducts.filter((zp) => zp.zakaz_id === zakazId);
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.count), 0);
        const addedPercent = subtotal * protsent / 100;
        const final = subtotal + addedPercent;
        return { subtotal, addedPercent, final };
    };
    const filteredZakazlar = zakazlar.filter((zakaz) => {
        const user = users.find((u) => u.id === zakaz.user_id);
        const username = user ? user.username.toLowerCase() : "";

        const createdDate = new Date(zakaz.created_at);
        const isAfterStart = !startDate || createdDate >= new Date(startDate);
        const isBeforeEnd = !endDate || createdDate <= new Date(endDate + "T23:59:59");


        return (
            (filterStol == "" || zakaz.number_stol.toString().includes(filterStol)) &&
            (filterStatus == "" || zakaz.status == filterStatus) &&
            (filterUser == "" || username.includes(filterUser.toLowerCase())) &&
            isAfterStart &&
            isBeforeEnd
        );
    });
    const totalPrice = zakazProducts.reduce((sum, item) => {
        return sum + (item.price * item.count);
    }, 0);

    const finalPrice = totalPrice + (totalPrice * protsent / 100);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentZakazlar = filteredZakazlar.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredZakazlar.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStol, filterStatus, filterUser, startDate, endDate]);
    return (
        <LayoutComponent>
            <div className={styles.container}>
                <h2 className={styles.title}>Barcha Zakazlar</h2>

                {/* Filter bar */}
                <div className={styles.filterBar}>
                    <input
                        type="text"
                        placeholder="Stol raqami..."
                        value={filterStol}
                        onChange={(e) => setFilterStol(e.target.value)}
                        className={styles.input}
                    />

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Barcha statuslar</option>
                        <option value="0">yangi</option>
                        <option value="1">bajarilmoqda</option>
                        <option value="2">tugadi</option>
                    </select>

                    <select
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Barcha foydalanuvchilar</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles.input}
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={styles.input}
                    />

                </div>

                {/* Table */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Foydalanuvchi</th>
                            <th>Stol raqami</th>
                            <th>Status</th>
                            <th>Vaqt</th>
                            <th>Mahsulotlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentZakazlar.map((zakaz, index) => (
                            <React.Fragment key={zakaz.id}>
                                <tr>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{getUserName(zakaz.user_id)}</td>
                                    <td>{zakaz.number_stol}</td>
                                    <td>{zakaz.status}</td>
                                    <td>{new Date(zakaz.created_at).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className={styles.toggleBtn}
                                            onClick={() => toggleAccordion(zakaz.id)}
                                        >
                                            {expandedZakazId === zakaz.id ? "Yopish" : "Ko‘rish"}
                                        </button>
                                    </td>
                                </tr>

                                {expandedZakazId === zakaz.id && (
                                    <tr>
                                        <td colSpan="6">
                                            <div className={styles.accordionContent}>
                                                <table className={styles.innerTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Product nomi</th>
                                                            <th>FastFood</th>
                                                            <th>Narxi</th>
                                                            <th>Soni</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {zakazProducts
                                                            .filter((zp) => zp.zakaz_id === zakaz.id)
                                                            .map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{getProductName(item.product_id)}</td>
                                                                    <td>{getFastFoodName(item.fastfood_id)}</td>
                                                                    <td>{item.price}</td>
                                                                    <td>{item.count}</td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                    {(() => {
                                                        const { subtotal, addedPercent, final } = getZakazTotal(zakaz.id);
                                                        return (
                                                            <div className={styles.innerTotalBox}>
                                                                <p>Zakaz summasi: <strong>{subtotal.toLocaleString()} so‘m</strong></p>
                                                                <p>Qo‘shilgan foiz ({protsent}%): <strong>{addedPercent.toLocaleString()} so‘m</strong></p>
                                                                <p>Yakuniy summa: <strong>{final.toLocaleString()} so‘m</strong></p>
                                                            </div>
                                                        );
                                                    })()}


                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &laquo; Oldingi
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? styles.activePage : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Keyingi &raquo;
                    </button>
                </div>
            {(() => {
  const { subtotal, addedPercent, final } = getFilteredTotal();
  return (
    <div className={styles.totalBox}>
      <p>Umumiy zakaz summasi: <strong>{subtotal.toLocaleString()} so‘m</strong></p>
      <p>Qo‘shilgan foiz ({protsent}%): <strong>{addedPercent.toLocaleString()} so‘m</strong></p>
      <p>Umumiy yakuniy summa: <strong>{final.toLocaleString()} so‘m</strong></p>
    </div>
  );
})()}

            </div>
        </LayoutComponent>
    );
}
