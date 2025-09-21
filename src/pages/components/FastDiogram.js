"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import url from "../../host/host";
import styles from "../admin/Dashboard.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [zakazProducts, setZakazProducts] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, zakazRes] = await Promise.all([
          axios.get(`${url}/users`),
          axios.get(`${url}/zakaz_products`),
        ]);

        const fastfoods = usersRes.data.filter((u) => u.type === 2);
        setUsers(fastfoods);
        setZakazProducts(zakazRes.data);

        // ✅ Statistika hisoblash
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        const statsData = fastfoods.map((user) => {
          const userZakaz = zakazRes.data.filter(
            (zp) => zp.fastfood_id === user.id
          );

          // Bugungi
          const todayZakaz = userZakaz.filter(
            (zp) => new Date(zp.created_at).toISOString().split("T")[0] === today
          );
          const todayCount = todayZakaz.length;
          const todaySum = todayZakaz.reduce(
            (sum, zp) => sum + zp.price * zp.count,
            0
          );

          // Shu oydagi
          const monthZakaz = userZakaz.filter(
            (zp) =>
              new Date(zp.created_at).toISOString().slice(0, 7) === thisMonth
          );
          const monthCount = monthZakaz.length;
          const monthSum = monthZakaz.reduce(
            (sum, zp) => sum + zp.price * zp.count,
            0
          );

          return {
            id: user.id,
            name: user.username,
            todayCount,
            todaySum,
            monthCount,
            monthSum,
          };
        });

        setStats(statsData);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Umumiy summalarni hisoblash
  const totalTodayCount = stats.reduce((sum, s) => sum + s.todayCount, 0);
  const totalTodaySum = stats.reduce((sum, s) => sum + s.todaySum, 0);
  const totalMonthCount = stats.reduce((sum, s) => sum + s.monthCount, 0);
  const totalMonthSum = stats.reduce((sum, s) => sum + s.monthSum, 0);

  return (
    <div className={styles.layout}>
      {/* Diagramma */}
      <div style={{ marginTop: "40px" }}>
        <h3>📈 Bugungi zakazlar soni (FastFood bo‘yicha)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="todayCount" fill="#6366f1" name="Bugungi zakaz soni" />
          </BarChart>
        </ResponsiveContainer>

        <h3 style={{ marginTop: "40px" }}>💰 Shu oydagi zakaz summasi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="monthSum" fill="#10b981" name="Oylik zakaz summasi" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>📊 FastFood Statistikasi</h2>

      {/* Jadval */}
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>#</th>
            <th className={styles.tableHeaderCell}>FastFood nomi</th>
            <th className={styles.tableHeaderCell}>Bugun (soni)</th>
            <th className={styles.tableHeaderCell}>Bugun (summa)</th>
            <th className={styles.tableHeaderCell}>Shu oy (soni)</th>
            <th className={styles.tableHeaderCell}>Shu oy (summa)</th>
          </tr>
        </thead>
        
        <tbody>
          {stats.map((s, index) => (
            <tr key={s.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{s.name}</td>
              <td className={styles.tableCell}>{s.todayCount}</td>
              <td className={styles.tableCell}>
                {s.todaySum.toLocaleString()} so'm
              </td>
              <td className={styles.tableCell}>{s.monthCount}</td>
              <td className={styles.tableCell}>
                {s.monthSum.toLocaleString()} so'm
              </td>
            </tr>
          ))}
        </tbody>
        <tbody >
          <tr className={styles.tableRow}>

            <td>    </td>
            <td  className={styles.tableCell}>
              Umumiy:
            </td>
            <td className={styles.tableCell}>{totalTodayCount}</td>
            <td className={styles.tableCell}>
              {totalTodaySum.toLocaleString()} so'm
            </td>
            <td className={styles.tableCell}>{totalMonthCount}</td>
            <td className={styles.tableCell}>
              {totalMonthSum.toLocaleString()} so'm
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
