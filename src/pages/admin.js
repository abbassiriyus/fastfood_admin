"use client";

import LayoutComponent from '../components/Layout';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import styles from '../styles/AdminPage.module.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import url from '../host/host';
import FastDiogram from "./components/FastDiogram"

Chart.register(...registerables);

export default function Admin() {
  return (
    <LayoutComponent>
      <AdminPage />
    </LayoutComponent>
  );
}

function AdminPage() {
  const [waiters, setWaiters] = useState([]); // ofitsantlar (type = 1)
  const [zakazProducts, setZakazProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Protsent block (siz oldingi koddan ishlatganingizni saqladim)
  const [protsent, setProtsent] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [protsentId, setProtsentId] = useState(null);

  useEffect(() => {
    const fetchProtsent = async () => {
      try {
        const res = await axios.get('https://ipa.rce.uz/protsent');
        if (res.data.length > 0) {
          setProtsent(res.data[0].foiz);
          setProtsentId(res.data[0].id);
          setIsEdit(true);
        } else {
          setProtsent('');
          setProtsentId(null);
          setIsEdit(false);
        }
      } catch (err) {
        console.error('GET error:', err);
      }
    };
    fetchProtsent();
  }, []);

  const handleSaveProtsent = async () => {
    try {
      if (isEdit) {
        await axios.put(`https://ipa.rce.uz/protsent/${protsentId}`, { foiz: protsent });
        alert('Ma’lumot yangilandi!');
      } else {
        await axios.post('https://ipa.rce.uz/protsent', { foiz: protsent });
        alert('Yangi ma’lumot saqlandi!');
      }
    } catch (err) {
      console.error('Saqlashda xatolik:', err);
      alert('Xatolik yuz berdi');
    }
  };

  useEffect(() => {
    // Fetch users (ofitsantlar type = 1), zakaz_products, orders
    const fetchData = async () => {
      try {
        const [usersRes, zakazProductsRes, ordersRes] = await Promise.all([
          axios.get(`${url}/users`),
          axios.get(`${url}/zakaz_products`),
          axios.get(`${url}/zakaz`)
        ]);
        // Odatda ofitsant type = 1 (agar sizning DB da boshqacha bo'lsa bu qiymatni o'zgartiring)
        const ofitsantlar = usersRes.data.filter(u => u.type === 1 /* && u.is_active */ );
        setWaiters(ofitsantlar);
        setZakazProducts(zakazProductsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Helper: format date key YYYY-MM-DD
  const formatDay = (d) => {
    const dt = new Date(d);
    if (isNaN(dt)) return null;
    return dt.toISOString().split('T')[0];
  };
  // Helper: get last N days as ascending array [oldest,...,today]
  const getLastNDays = (n = 30) => {
    const arr = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  };

  // calculate revenues whenever orders or zakazProducts change
  const { dailyRevenue, monthlyRevenue, waiterRevenue, orderCounts } = useMemo(() => {
    const daily = {};   // { '2025-09-01': 12345, ... }
    const monthly = {}; // { '2025-09': 123456, ... }
    const waiterRev = {}; // { waiterId: { daily: {...}, monthly: {...} }, ... }
    const counts = {}; // order counts per day

    // Pre-index zakazProducts by zakaz_id for speed
    const byZakaz = {};
    for (const zp of zakazProducts || []) {
      const zid = zp.zakaz_id;
      if (!byZakaz[zid]) byZakaz[zid] = [];
      byZakaz[zid].push(zp);
    }

    for (const order of orders || []) {
      const created = order.created_at || order.createdAt || order.date || null;
      const dayKey = formatDay(created);
      if (!dayKey) continue;
      const monthKey = dayKey.slice(0, 7);

      // Sum revenue for this order from zakaz_products
      const items = byZakaz[order.id] || [];
      let orderRevenue = 0;
      for (const it of items) {
        const price = Number(it.price) || 0;
        const cnt = Number(it.count) || 0;
        orderRevenue += price * cnt;
      }

      // Add to counts (orders per day)
      counts[dayKey] = (counts[dayKey] || 0) + 1;

      // Add to daily & monthly totals
      daily[dayKey] = (daily[dayKey] || 0) + orderRevenue;
      monthly[monthKey] = (monthly[monthKey] || 0) + orderRevenue;

      // Add to waiter-specific (order.user_id is ofitsant who created the order)
      const waiterId = order.user_id;
      if (!waiterRev[waiterId]) waiterRev[waiterId] = { daily: {}, monthly: {} };
      waiterRev[waiterId].daily[dayKey] = (waiterRev[waiterId].daily[dayKey] || 0) + orderRevenue;
      waiterRev[waiterId].monthly[monthKey] = (waiterRev[waiterId].monthly[monthKey] || 0) + orderRevenue;
    }

    return { dailyRevenue: daily, monthlyRevenue: monthly, waiterRevenue: waiterRev, orderCounts: counts };
  }, [orders, zakazProducts]);

  // Labels for last 30 days (ascending)
  const last30 = getLastNDays(30);

  // Sorted month labels (ascending)
  const monthLabels = useMemo(() => {
    const months = Object.keys(monthlyRevenue || {});
    months.sort(); // YYYY-MM lexicographically sorts correctly
    return months;
  }, [monthlyRevenue]);

  // Colors generator for datasets
  const colorFor = (i) => {
    const hue = (i * 47) % 360;
    return `hsl(${hue} 70% 45%)`;
  };
  const colorForAlpha = (i, a = 0.25) => {
    const hue = (i * 47) % 360;
    return `hsla(${hue}, 70%, 45%, ${a})`;
  };

  // Build datasets for per-waiter daily (Line) using last30 labels
  const waiterDailyDatasets = waiters.map((w, idx) => {
    const arr = last30.map(d => {
      return Number(waiterRevenue[w.id]?.daily?.[d] || 0);
    });
    return {
      label: w.username || `#${w.id}`,
      data: arr,
      borderColor: colorFor(idx),
      backgroundColor: colorForAlpha(idx, 0.15),
      tension: 0.2,
      fill: false,
      pointRadius: 2,
    };
  });

  // Build datasets for per-waiter monthly (Bar stacked)
  const waiterMonthlyDatasets = waiters.map((w, idx) => {
    const arr = monthLabels.map(m => Number(waiterRevenue[w.id]?.monthly?.[m] || 0));
    return {
      label: w.username || `#${w.id}`,
      data: arr,
      backgroundColor: colorForAlpha(idx, 0.6),
      borderColor: colorFor(idx),
      borderWidth: 1,
    };
  });

  // Overall daily revenue dataset for quick overview
  const overallDailyDataset = {
    labels: last30,
    datasets: [
      {
        label: 'Umumiy kunlik daromad',
        data: last30.map(d => Number(dailyRevenue[d] || 0)),
        borderColor: '#00a3ff',
        backgroundColor: 'rgba(0,163,255,0.15)',
        fill: true,
        tension: 0.2
      }
    ]
  };

  // Overall monthly revenue dataset
  const overallMonthlyDataset = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Umumiy oylik daromad',
        data: monthLabels.map(m => Number(monthlyRevenue[m] || 0)),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76,175,80,0.15)',
        fill: true,
      }
    ]
  };

  // Options
  const commonLineOptions = { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' } } };
  const stackedBarOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: { tooltip: { mode: 'index', intersect: false }, legend: { position: 'bottom' } },
    scales: { x: { stacked: true }, y: { stacked: true } }
  };

  return (
    <div className={styles.adminContainer}>
      <h2>Admin Panel — Ofitsantlar daromadi</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Protsent kiriting"
          value={protsent}
          onChange={e => setProtsent(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: 180 }}
        />
        <button
          onClick={handleSaveProtsent}
          style={{
            padding: '8px 14px',
            backgroundColor: isEdit ? '#1976d2' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          {isEdit ? 'Yangilash' : 'Saqlash'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Overall daily */}
        <div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 360 }}>
          <h3>Kunlik daromad (oxirgi 30 kun)</h3>
          <Line data={overallDailyDataset} options={commonLineOptions} />
        </div>

        {/* Overall monthly */}
        <div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 360 }}>
          <h3>Oylik daromad (mavjud oylar)</h3>
          <Line data={overallMonthlyDataset} options={commonLineOptions} />
        </div>

        {/* Per-waiter daily (multi-line) */}
        <div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 420 }}>
          <h3>Har bir ofitsant — kunlik (oxirgi 30 kun)</h3>
          {waiters.length === 0 ? (
            <p>Ofitsantlar topilmadi.</p>
          ) : (
            <Line
              data={{
                labels: last30,
                datasets: waiterDailyDatasets
              }}
              options={{ ...commonLineOptions, plugins: { legend: { position: 'bottom', maxHeight: 100 } } }}
            />
          )}
        </div>

        {/* Per-waiter monthly (stacked bar) */}
        <div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 420 }}>
          <h3>Har bir ofitsant — oylik (kompozit)</h3>
          {monthLabels.length === 0 ? (
            <p>Oylik ma'lumot yoʻq.</p>
          ) : waiters.length === 0 ? (
            <p>Ofitsantlar topilmadi.</p>
          ) : (
            <Bar
              data={{
                labels: monthLabels,
                datasets: waiterMonthlyDatasets
              }}
              options={stackedBarOptions}
            />
          )}
        </div>

    {/* Per-waiter quick totals (bar) */}
<div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 360 }}>
  <h3>Ofitsantlar — umumiy (oxirgi 30 kun ichida yigʻindilar)</h3>
  {waiters.length === 0 ? <p>Ofitsantlar topilmadi.</p> : (
    <Bar
      data={{
        labels: waiters.map(w => w.username),
        datasets: [
          {
            label: 'Oxirgi 30 kun yigʻindisi',
            data: waiters.map(w =>
              last30.reduce((s, d) => s + Number(waiterRevenue[w.id]?.daily?.[d] || 0), 0)
            ),
            backgroundColor: waiters.map((_, i) => colorForAlpha(i, 0.5))
          }
        ]
      }}
      options={{ maintainAspectRatio: false, responsive: true }}
    />
  )}
</div>

{/* Kunlik buyurtmalar */}
<div style={{ border: '1px solid #e6eef9', borderRadius: 8, padding: 12, height: 360 }}>
  <h3>Kunlik buyurtmalar (oxirgi 30 kun)</h3>
  <Line
    data={{
      labels: last30,
      datasets: [{
        label: 'Buyurtma soni',
        data: last30.map(d => Number(orderCounts[d] || 0)),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244,67,54,0.12)',
        fill: true
      }]
    }}
    options={commonLineOptions}
  />
</div>

      </div>
      <FastDiogram/>
    </div>
  );
}
