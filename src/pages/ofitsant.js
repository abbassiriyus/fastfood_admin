"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../host/host';
import moment from 'moment';
import styles from "../styles/ofitsant.module.css";
import { io } from 'socket.io-client';

const socket = io(`${url}`); // Socket.io serveriga ulanish

export default function Ofitsant() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    var  [protsent,setProtsent]=useState(10)
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [orderToDelete, setOrderToDelete] = useState(null);

const confirmDelete = (order) => {
    setOrderToDelete(order);
    setDeleteConfirmOpen(true);
};


const handleDeleteConfirmed = () => {
    if (orderToDelete) {
        axios.delete(`${url}/zakaz/${orderToDelete.id}`).then(() => {
            getdata();
        }).catch(error => {
            console.error("O'chirishda xato:", error);
        }).finally(() => {
            setDeleteConfirmOpen(false);
            setOrderToDelete(null);
        });
    }
};

    const handleConfirm2 = () => {
        if (selectedData) {
            setLoading(true);
            const dataToSend = {
                ...selectedData,
                status: 1,
                user_id:(JSON.parse(localStorage.getItem('user')).id)
            };
            axios.put(`${url}/zakaz/${selectedData.id}`, dataToSend)
                .then(response => {
                })
                .catch(error => {
                    console.error('Xato:', error);
                })
                .finally(() => {
                    getdata()
                    setLoading(false);
                    setOpen(false);
                    setSelectedData(null);
                });
        }
    };

const handleConfirm = async () => {
    if (selectedOrder) {
        const updatedOrder = {
            ...selectedOrder,
            status: 2,
        };

        try {
            // 1. Buyurtmani tugatish
            await axios.put(`${url}/zakaz/${selectedOrder.id}`, updatedOrder);

            // 2. count_seen ni oshirish
            const userId = JSON.parse(localStorage.getItem('user')).id;
            await axios.put(`${url}/users/${userId}/count_seen`, {
                count_seen: ((selectedOrder.price)/100*protsent).toFixed(0)*1
            });


            // 3. Ma'lumotlarni yangilash va modalni yopish
            getdata();
        } catch (error) {
            console.error('Xatolik:', error);
        } finally {
            setOpen2(false);
            setSelectedOrder(null);
        }
    }
};

 var [user1,setUser1]=useState({})
useEffect(()=>{
if(localStorage){
setUser1(JSON.parse(localStorage.getItem('user')))
}
},[])
    useEffect(() => {
        socket.on('zakazUpdated', () => {
          getdata(); // Yangilangan buyurtmalarni olish
        });
    axios.get(`${url}/protsent`).then(res=>{
        if(res.data.length>0){
            setProtsent(res.data[0].foiz)
        }
    })
        return () => {
          socket.off('zakazUpdated'); // Komponent o'chirilganda hodisani o'chirish
        };
      }, []);

    const getdata = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : null;

        axios.get(`${url}/zakaz`).then(res => {
            axios.get(`${url}/zakaz_products`).then(res1 => {
                axios.get(`${url}/products`).then(res_product => {
                    axios.get(`${url}/users`).then(fastfood=>{


for (let i = 0; i < res1.data.length; i++) {
  for (let j = 0; j < res_product.data.length; j++) {
    
 if(res1.data[i].product_id==res_product.data[j].id){
    res1.data[i].product_name=res_product.data[j].name
 }
      
  }
  for (let j = 0; j < fastfood.data.length; j++) {
    
    if(res1.data[i].fastfood_id==fastfood.data[j].id){
        res1.data[i].fastfood_name=fastfood.data[j].username
     }
  }
}



                       const statusZeroOrders = [];
                    const statusOneOrders = [];
                    const statusTwoOrders = [];
    var sortedData = res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
                    sortedData.forEach(order => {
                        order.key = order.id;
                        order.price = 0;
                        order.description = `<table><thead><tr><th>Fastfood</th><th>Product</th><th>Count</th><th>Price</th><th>Jami</th></tr></thead><tbody>`;
                        res1.data.forEach(item => {
                            if (order.id === item.zakaz_id) {
                                order.price += item.price * item.count;
                                order.description += `<tr><td>${item.fastfood_name}</td><td>${item.product_name}</td><td>${item.count}</td><td>${item.price} so'm</td><td>${item.price * item.count} so'm</td></tr>`;
                            }
                        });
                        order.description += `</tbody></table>`;
                    
                    // 10% xizmat narxini hisoblash
                    const serviceCharge = order.price * protsent/100;
                    const totalAmount = order.price + serviceCharge;

                    order.description += `
                        <div style="margin-top: 10px; font-weight: bold;">
                            Barchasi: ${serviceCharge.toFixed(0)*100/protsent} so'm<br>
                            Xizmat narxi (10%): ${serviceCharge.toFixed(0)} so'm<br>
                            Jami summa: ${totalAmount.toFixed(0)} so'm
                        </div>
                    `;
                        if (order.status === 0) {
                            statusZeroOrders.push(order);
                        } else if (userId && order.user_id === userId && order.status === 1) {
                            statusOneOrders.push(order);
                        } else if (userId && order.user_id === userId && order.status === 2) {
                            statusTwoOrders.push(order);
                        }
             
                    });
                    const sortedData1 = {
  statusZeroOrders: statusZeroOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  statusOneOrders: statusOneOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  statusTwoOrders: statusTwoOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
};
                    setData(sortedData1);  
                    })
                   
                });
            });
        });
    };

    useEffect(() => {
        getdata();
    }, []);

    const toggleRow = (key) => {
        setExpandedRows(prev => 
            prev.includes(key) ? prev.filter(rowKey => rowKey !== key) : [...prev, key]
        );
    };

    return (
        <div className={styles.ofitsant}>
              <nav className={styles.navbar}>
      <div className={styles.logo}>MenuGo</div>
      <ul className={styles.links}>
        <li>
          <a className={`${styles.ofitsant__tab} ${page === 0 ? styles.ofitsant__tabActive : ''}`} onClick={() => setPage(0)}>Yangilar</a>
        </li>
        <li>
          <a  className={`${styles.ofitsant__tab} ${page === 1 ? styles.ofitsant__tabActive : ''}`} onClick={() => setPage(1)} >Amalda</a>
        </li>
        <li>
          <a className={`${styles.ofitsant__tab} ${page === 2 ? styles.ofitsant__tabActive : ''}`} onClick={() => setPage(2)}>Tarix</a>
        </li>
      </ul>
    </nav>
        <h2 className={styles.ofitsant_name} >{user1.username || ""}</h2>
            {page === 0 && (
           // JSX qismida o'chirish tugmasini qo'shish
<div className={styles.ofitsant__accordion}>
    {data.statusZeroOrders && data.statusZeroOrders.map(order => (
        <div key={order.key} className={styles.ofitsant__accordionItem}>
            <div className={styles.ofitsant__accordionHeader} onClick={() => toggleRow(order.key)}>
                <span className={styles.ofitsant__accordionTitle}>
                    No: {order.id} - stol: {order.number_stol} - {moment(order.created_at).format('MM/DD HH:mm')}
                </span>
                <button className={styles.ofitsant__button} onClick={(e) => { e.stopPropagation(); setSelectedData(order); setOpen(true); }}>Qabul qilish</button>
               <button style={{ background: 'red' }} className={styles.ofitsant__button} 
    onClick={(e) => { 
        e.stopPropagation(); 
        confirmDelete(order); 
    }}>
    O'chirish
</button>

            </div>
            {expandedRows.includes(order.key) && (
                <div className={styles.ofitsant__accordionContent} dangerouslySetInnerHTML={{ __html: order.description }} />
            )}
        </div>
    ))}
</div>
            )}
            {page === 1 && (
                <div className={styles.ofitsant__accordion}>
                    {data.statusOneOrders && data.statusOneOrders.map(order => (
                        <div key={order.key} className={styles.ofitsant__accordionItem}>
                            <div className={styles.ofitsant__accordionHeader} onClick={() => toggleRow(order.key)}>
                                <span className={styles.ofitsant__accordionTitle}>
                                   No:{order.id} - stol:{order.number_stol} - {moment(order.created_at).format('MM/DD HH:mm')}
                                </span>
                                <button className={styles.ofitsant__button} onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setOpen2(true); }}>Tugatish</button>
                            </div>
                            {expandedRows.includes(order.key) && (
                                <div className={styles.ofitsant__accordionContent} dangerouslySetInnerHTML={{ __html: order.description }} />
                            )}
                        </div>
                    ))}
                </div>
            )}
            {page === 2 && (
                <table className={styles.ofitsant__table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Stol</th>
                            <th>Vaqt</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                 {data.statusTwoOrders && data.statusTwoOrders
  .filter(order => moment(order.created_at).isSame(moment(), 'day')) // Bugungi buyurtmalarni filtrlash
  .map(order => (
    <tr key={order.key}>
      <td>{order.id}</td>
      <td>{order.number_stol}</td>
      <td>{moment(order.created_at).format('MM/DD HH:mm')}</td>
      <td>{order.price} so`m</td>
    </tr>
  ))}
                    </tbody>
                </table>
            )}
<center> <a className={styles.chiqsh} href="/">chiqish</a></center>
            {open && (
                <div className={styles.ofitsant__modal}>
                    <h4 className={styles.ofitsant__modalTitle}>Yangi buyurtma</h4>
                    <p       className={styles.ofitsant__modalText}>Siz buyurtmani qabul qilmoqchimisiz?</p>
                    <div className={styles.ofitsant__modalActions}>
                        <button className={styles.ofitsant__button} onClick={()=>handleConfirm2()} >
                        Qabul qilaman
                        </button>
                        <button className={styles.ofitsant__buttonCancel} onClick={() => setOpen(false)}>Yopish</button>
                    </div>
                </div>
            )}
            {open2 && (
                <div className={styles.ofitsant__modal}>
                    <h4 className={styles.ofitsant__modalTitle}>Tugatish</h4>
                    <p className={styles.ofitsant__modalText}>Buyurtmani tugatganingizni tasdiqlang!</p>
                    <div className={styles.ofitsant__modalActions}>
                        <button className={styles.ofitsant__button} onClick={()=>handleConfirm()}>Tasdiqlayman</button>
                        <button className={styles.ofitsant__buttonCancel} onClick={() => setOpen2(false)}>Yopish</button>
                    </div>
                </div>
            )}
            {deleteConfirmOpen && (
    <div className={styles.ofitsant__modal}>
        <h4 className={styles.ofitsant__modalTitle}>Buyurtmani o'chirish</h4>
        <p className={styles.ofitsant__modalText}>
            Buyurtma <strong>No:{orderToDelete?.id}</strong> ni haqiqatdan ham o‘chirmoqchimisiz?
        </p>
        <div className={styles.ofitsant__modalActions}>
            <button className={styles.ofitsant__button} onClick={handleDeleteConfirmed}>Ha, o‘chirish</button>
            <button className={styles.ofitsant__buttonCancel} onClick={() => setDeleteConfirmOpen(false)}>Yo‘q, bekor qilish</button>
        </div>
    </div>
)}

        </div>
    );
}