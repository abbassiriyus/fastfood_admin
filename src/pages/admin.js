import LayoutComponent from '../components/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/AdminPage.module.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import url from '../host/host';

// Ro'yxatdan o'tkazish
Chart.register(...registerables);

const AdminPage = () => {
    const [fastfoods, setFastfoods] = useState([]);
    const [zakazProducts, setZakazProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [dailyRevenue, setDailyRevenue] = useState({});
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [orderCounts, setOrderCounts] = useState({});
    const [fastfoodRevenue, setFastfoodRevenue] = useState({});

    useEffect(() => {
        const fetchFastfoods = async () => {
            try {
                const response = await axios.get(`${url}/users`);
                const activeFastfoods = response.data.filter(user => user.type === 2 && user.is_active);
                setFastfoods(activeFastfoods);
            } catch (error) {
                console.error('Error fetching fastfoods:', error);
            }
        };

        const fetchZakazProducts = async () => {
            try {
                const response = await axios.get(`${url}/zakaz_products`);
                setZakazProducts(response.data);
            } catch (error) {
                console.error('Error fetching zakaz products:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/zakaz`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchFastfoods();
        fetchZakazProducts();
        fetchOrders();
    }, []);

    // Daromadlarni hisoblash
    const calculateRevenue = () => {
        const dailyRevenueData = {};
        const monthlyRevenueData = {};
        const fastfoodRevenueData = {};

        fastfoods.forEach(fastfood => {
            const fastfoodId = fastfood.id;

            zakazProducts.forEach(product => {
                if (product.fastfood_id === fastfoodId) {
                    const revenue = product.price * (product.count || 0);
                    const orderDate = new Date(product.created_at);
                    const dayKey = orderDate.toISOString().split('T')[0];
                    const orderMonth = orderDate.toISOString().slice(0, 7); // YYYY-MM format

                    // Kunlik daromad
                    dailyRevenueData[dayKey] = (dailyRevenueData[dayKey] || 0) + revenue;

                    // Oylik daromad
                    monthlyRevenueData[orderMonth] = (monthlyRevenueData[orderMonth] || 0) + revenue;

                    // Fastfood daromadlari
                    if (!fastfoodRevenueData[fastfoodId]) {
                        fastfoodRevenueData[fastfoodId] = { daily: {}, monthly: {} };
                    }
                    fastfoodRevenueData[fastfoodId].daily[dayKey] = (fastfoodRevenueData[fastfoodId].daily[dayKey] || 0) + revenue;
                    fastfoodRevenueData[fastfoodId].monthly[orderMonth] = (fastfoodRevenueData[fastfoodId].monthly[orderMonth] || 0) + revenue;
                }
            });
        });

        setDailyRevenue(dailyRevenueData);
        setMonthlyRevenue(monthlyRevenueData);
        setFastfoodRevenue(fastfoodRevenueData);
    };

    // Zakazlar sonini hisoblash
    const calculateOrderCounts = () => {
        const orderCountsData = orders.reduce((acc, order) => {
            const orderDate = new Date(order.created_at);
            const dayKey = orderDate.toISOString().split('T')[0];
            acc[dayKey] = (acc[dayKey] || 0) + 1;
            return acc;
        }, {});

        setOrderCounts(orderCountsData);
    };

    useEffect(() => {
        calculateRevenue();
        calculateOrderCounts();
    }, [fastfoods, zakazProducts, orders]);

    // Oxirgi 30 kunni olish
    const getLast30Days = () => {
        const last30Days = {};
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayKey = date.toISOString().split('T')[0];
            last30Days[dayKey] = 0; // Boshlang'ich qiymat
        }

        return last30Days;
    };

    // Fastfoodlar daromadi uchun diagrammalar
    const fastfoodLabels = fastfoods.map(fastfood => fastfood.username); // `username` ustunidan foydalanish
    const fastfoodDailyData = fastfoods.map(fastfood => {
        const fastfoodId = fastfood.id;
        return Object.keys(getLast30Days()).map(date => fastfoodRevenue[fastfoodId]?.daily[date] || 0);
    });

 

    return (
        <div className={styles.adminContainer}>
            <h2>Admin Panel</h2>
            <p>Fastfoodlar uchun oylik va kunlik daromadlar:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', width: '600px', height: '400px', paddingBottom: '30px' }}>
                    <h3>Kunlik Daromad (Oxirgi 30 kun)</h3>
                    <Line data={{
                        labels: Object.keys(getLast30Days()),
                        datasets: [
                            {
                                label: 'Kunlik Daromad',
                                data: Object.keys(getLast30Days()).map(date => dailyRevenue[date] || 0),
                                borderColor: '#80deea',
                                backgroundColor: 'rgba(128, 222, 238, 0.5)',
                                fill: true,
                            },
                        ]
                    }} options={{ maintainAspectRatio: false }} />
                </div>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', width: '600px', height: '400px',paddingBottom:'30px' }}>
                    <h3>Oylik Daromad</h3>
                    <Line data={{
                        labels: Object.keys(monthlyRevenue),
                        datasets: [
                            {
                                label: 'Oylik Daromad',
                                data: Object.values(monthlyRevenue),
                                borderColor: '#e0f7fa',
                                backgroundColor: 'rgba(224, 247, 251, 0.5)',
                                fill: true,
                            },
                        ]
                    }} options={{ maintainAspectRatio: false }} />
                </div>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', width: '600px', height: '400px', paddingBottom: '33px' }}>
                    <h3>Kunlik Buyurtmalar (Oxirgi 30 kun)</h3>
                    <Line data={{
                        labels: Object.keys(getLast30Days()),
                        datasets: [
                            {
                                label: 'Kunlik Buyurtmalar',
                                data: Object.keys(getLast30Days()).map(date => orderCounts[date] || 0),
                                borderColor: '#f44336',
                                backgroundColor: 'rgba(244, 67, 54, 0.5)',
                                fill: true,
                            },
                        ]
                    }} options={{ maintainAspectRatio: false }} />
                </div><div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', width: '600px', height: '400px', paddingBottom: '30px' }}>
                <h3>Fastfoodlar - Kunlik Daromad</h3>
                <Bar data={{
                    labels: fastfoodLabels,
                    datasets: [
                        {
                            label: 'Kunlik Daromad',
                            data: fastfoodDailyData.reduce((acc, curr) => {
                                curr.forEach((value, index) => {
                                    acc[index] = (acc[index] || 0) + value;
                                });
                                return acc;
                            }, []),
                            backgroundColor: 'rgba(128, 222, 238, 0.5)',
                        },
                    ]
                }} options={{ maintainAspectRatio: false }} />
            </div>
            </div>

            

       
        </div>
    );
};

export default function Admin() {
    return (
        <LayoutComponent>
            <AdminPage />
        </LayoutComponent>
    );
}