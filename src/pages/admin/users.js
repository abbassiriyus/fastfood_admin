import React, { useEffect, useState, useCallback } from "react";
import LayoutComponent from "../../components/Layout";
import axios from "axios";
import url from "../../host/host";
import styles from "../../styles/UsersTable.module.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [salaryHistoryOpen, setSalaryHistoryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalSalaryToBePaid, setTotalSalaryToBePaid] = useState(0);
  const [totalSeenCount, setTotalSeenCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [openOrderId, setOpenOrderId] = useState(null);

  // Pagination
  const zakazPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/users`);
      const filtered = res.data.filter((user) => user.type === 1);
      setUsers(filtered);
      calculateTotals(filtered);
    } catch (err) {
      console.error("Foydalanuvchilarni olishda xatolik:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Calculate totals
  const calculateTotals = (usersList) => {
    let seenCount = 0;
    let totalSalary = 0;

    usersList.forEach((u) => {
      if (u.count_seen > 0) {
        const oylik = (u.count_seen * (u.prosent || 0)) / 100;
        totalSalary += oylik;
        seenCount += u.count_seen;
      }
    });

    setTotalSalaryToBePaid(totalSalary);
    setTotalSeenCount(seenCount);
    setTotalProfit(seenCount - totalSalary);
  };

  // Fetch user orders
  const fetchUserOrders = async (userId, date) => {
    if (!date) return setOrders([]);
    try {
      const [zakazRes, zakazProductsRes, productsRes] = await Promise.all([
        axios.get(`${url}/zakaz`),
        axios.get(`${url}/zakaz_products`),
        axios.get(`${url}/products`),
      ]);

      const zakazlar = zakazRes.data || [];
      const zakazProducts = zakazProductsRes.data || [];
      const allProducts = productsRes.data || [];

      const filteredOrders = zakazlar.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().slice(0, 10);
        return order.user_id === userId && orderDate === date;
      });

      const enriched = filteredOrders.map((order) => ({
        ...order,
        zakaz_products: zakazProducts
          .filter((zp) => zp.zakaz_id === order.id)
          .map((zp) => {
            const product = allProducts.find((p) => p.id === zp.product_id);
            return {
              ...zp,
              name: product?.name || "Nomaʼlum mahsulot",
              image: product?.image || "",
            };
          }),
      }));

      setOrders(enriched);
      setCurrentPage(0);
    } catch (err) {
      console.error("Zakazlarni olishda xatolik:", err);
    }
  };

  // Salary history
  const fetchSalaryHistory = async (userId) => {
    try {
      const res = await axios.get(`${url}/tarixoylik`);
      const history = (res.data || []).filter((item) => item.user_id === userId);
      setSalaryHistory(history);
      setSalaryHistoryOpen(true);
    } catch (err) {
      console.error("Tarixoylikni olishda xatolik:", err);
    }
  };

  // Pay salary
  const handlePaySalary = async (userId, price) => {
    if (!window.confirm("Rostdan ham oylik bermoqchimisiz?")) return;

    try {
      await axios.put(`${url}/users/${userId}/reset-count`, { count_seen: 0 });
      await axios.post(
        `${url}/tarixoylik`,
        { user_id: userId, price },
        { headers: { "Content-Type": "application/json" } }
      );

      setUsers((prev) => {
        const next = prev.map((u) =>
          u.id === userId ? { ...u, count_seen: 0 } : u
        );
        calculateTotals(next);
        return next;
      });
    } catch (err) {
      console.error("Oylikni berishda xatolik:", err);
    }
  };

  // Modal keyboard (Esc to close)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setSalaryHistoryOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Pagination slicing
  const paginatedOrders = orders.slice(
    currentPage * zakazPerPage,
    (currentPage + 1) * zakazPerPage
  );
  const totalPages = Math.max(1, Math.ceil(orders.length / zakazPerPage));

  const fmt = (num) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString();
  };

  return (
    <LayoutComponent>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>👥 Ishchilar ro'yxati</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table} role="table">
            <thead>
              <tr className={styles.theadRow}>
                <th>#</th>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Foizi</th>
                <th>Topgan puli</th>
                <th>Oyligi</th>
                <th>Foyda</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    Foydalanuvchilar topilmadi...
                  </td>
                </tr>
              )}

              {users.map((u, i) => {
                const oylik = (u.count_seen * (u.prosent || 0)) / 100;
                const foyda = u.count_seen - oylik;

                return (
                  <tr key={u.id} className={styles.tableRow}>
                    <td>{i + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.phone_number || "Noma’lum"}</td>
                    <td>{u.prosent ?? 0}%</td>
                    <td>{fmt(u.count_seen)} so‘m</td>
                    <td>{fmt(oylik)} so‘m</td>
                    <td>{fmt(foyda)} so‘m</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => fetchSalaryHistory(u.id)}>
                          📜 Tarix
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setModalOpen(true);
                            setSelectedDate("");
                            setOrders([]);
                          }}
                        >
                          🧾 Zakazlar
                        </button>
                        {u.count_seen > 0 && (
                          <button
                            onClick={() => handlePaySalary(u.id, oylik)}
                          >
                            💵 Oylik berish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length > 0 && (
                <tr className={styles.tableFooter}>
                  <td colSpan={4} className={styles.summaryCell}>
                    Jami:
                  </td>
                  <td>{fmt(totalSeenCount)} so‘m</td>
                  <td>{fmt(totalSalaryToBePaid)} so‘m</td>
                  <td>{fmt(totalProfit)} so‘m</td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zakazlar modal */}
      {modalOpen && selectedUser && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>{selectedUser.username} — Zakazlar</h3>
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>❌</button>
            </header>

            <label>
              📅 Sana tanlang:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedDate(val);
                  fetchUserOrders(selectedUser.id, val);
                }}
              />
            </label>

            {selectedDate ? (
              <div className={styles.orderList}>
                {paginatedOrders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div
                      className={styles.orderHeader}
                      onClick={() =>
                        setOpenOrderId((prev) =>
                          prev === order.id ? null : order.id
                        )
                      }
                    >
                      🧾 Stol: {order.number_stol} —{" "}
                      {order.created_at.slice(0, 10)}
                    </div>
                    {openOrderId === order.id && (
                      <div className={styles.orderContent}>
                        {order.zakaz_products.map((p) => (
                          <div key={p.id} className={styles.productItem}>
                            <img
                              src={p.image || "/placeholder.png"}
                              alt={p.name}
                              style={{
                                width: "130px",
                                height: "130px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "13px",
                                marginLeft: "10px",
                              }}
                            >
                              <div>{p.name}</div>
                              <div>
                                {p.count} dona — {fmt(p.price)} so‘m
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {orders.length > 0 && (
                  <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={
                          i === currentPage ? styles.pageButtonActive : styles.pageButton
                        }
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>Sana tanlang</div>
            )}
          </div>
        </div>
      )}

      {/* Salary history modal */}
      {salaryHistoryOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSalaryHistoryOpen(false);
          }}
        >
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>📜 Oylik tarixi</h3>
              <button className={styles.closeButton}  onClick={() => setSalaryHistoryOpen(false)}>❌</button>
            </header>
            {salaryHistory.length > 0 ? (
              <ul>
                {salaryHistory.map((item, idx) => (
                  <li key={item.id}>
                    {idx + 1}.{" "}
                    {new Date(item.created_at).toLocaleDateString()} —{" "}
                    {fmt(item.price)} so‘m
                  </li>
                ))}
              </ul>
            ) : (
              <div>Hali oylik berilmagan.</div>
            )}
          </div>
        </div>
      )}
    </LayoutComponent>
  );
}
