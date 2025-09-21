import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Ro'yxatdan o'tkazish
import styles from './styles/Dashboard.module.css';
import axios from 'axios';
import url from '../../host/host';
Chart.register(...registerables); // O'lchovlarni ro'yxatdan o'tkazish

const Dashboard = () => {
    const [chartData, setChartData] = useState(null);
var [dataJson,setDataJSon]=useState([])

function filterByDateRange(data, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter(item => {
        const createdAt = new Date(item.created_at);
        return createdAt >= start && createdAt <= end;
    });
}
const myfilter_f=()=>{
    axios.get(`${url}/zakaz_products`).then(res=>{
        axios.get(`${url}/products`).then(res1=>{
        for (let i = 0; i < res.data.length; i++) {
         for (let j = 0; j < res1.data.length; j++) {
          if(res.data[i].product_id==res1.data[j].id){
            res.data[i].product_name=res1.data[j].name
          }                
         }               
        }
     var   my_fastfood=res.data.filter(item=>item.fastfood_id==(JSON.parse(localStorage.getItem('user'))).id)
        generateChartData(filterByDateRange(my_fastfood,document.querySelector('#start').value,document.querySelector('#end').value))
   setDataJSon(filterByDateRange(my_fastfood,document.querySelector('#start').value,document.querySelector('#end').value))
        })
    })   
}
    useEffect(() => {
        axios.get(`${url}/zakaz_products`).then(res=>{
            axios.get(`${url}/products`).then(res1=>{
            for (let i = 0; i < res.data.length; i++) {
             for (let j = 0; j < res1.data.length; j++) {
              if(res.data[i].product_id==res1.data[j].id){
                res.data[i].product_name=res1.data[j].name
              }                
             }               
            }
       setDataJSon(res.data.filter(item=>item.fastfood_id==(JSON.parse(localStorage.getItem('user'))).id))
           generateChartData(res.data.filter(item=>item.fastfood_id==(JSON.parse(localStorage.getItem('user'))).id));
         })
        })
        
    }, []);

    const generateChartData = (zakaz) => {
        const productCounts = {};

        zakaz.forEach(item => {
            if (productCounts[item.product_name]) {
                productCounts[item.product_name] += item.count;
            } else {
                productCounts[item.product_name] = item.count;
            }
        });

        setChartData({
            labels: Object.keys(productCounts),
            datasets: [{
                label: 'Sotilgan mahsulotlar soni',
                data: Object.values(productCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        });
    };

    return (
        <div className={styles.dashboard}><h2 className={styles['date-filter__title']}>Sana Filtri</h2>
            <div className={styles['dateFilter']}>
            
            <label className={styles['date-filter__label']} htmlFor="start">Boshlash:</label>
            <input type="date" id="start" className={styles['date-filter__input']} />
            <label className={styles['date-filter__label']} htmlFor="end">Tugash:</label>
            <input type="date" id="end" className={styles['date-filter__input']} />
            <button className={styles['date-filter__button']} onClick={()=>myfilter_f()}>Filter</button>
        </div>
            {chartData ? (
                <Bar data={chartData} options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }} />
            ) : (
                <p>Ma'lumotlar yuklanmoqda...</p>
            )}
        </div>
    );
};

export default Dashboard;