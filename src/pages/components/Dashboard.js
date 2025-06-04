import { useEffect, useState } from 'react';
import styles from './styles/Dashboard.module.css';
import axios from 'axios';
import url from '../../host/host';
import DiagrammaProduct from '../components/DiagrammaProduct'
const Dashboard = () => {
  const [product, setProduct] = useState([]);
  const [all_price, setAll_price] = useState(0);
  const [zakaz_p, setZakaz_p] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getZakaz();
  }, []);

  function filterByDateRange(data, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter(item => {
        const createdAt = new Date(item.created_at);
        return createdAt >= start && createdAt <= end;
    });
}
const myfilter_f=()=>{
  axios.get(`${url}/zakaz_products`).then(res => {
    var fastfood_1=JSON.parse(localStorage.getItem('user'))
var filtered = res.data
  .filter(item => item.fastfood_id == fastfood_1.id)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    filtered=filterByDateRange(filtered,document.querySelector('#start1').value,document.querySelector('#end1').value)
    
    setZakaz_p(filtered);
    let allprice = 0;
    axios.get(`${url}/categories`).then(res2 => {
      axios.get(`${url}/products`).then(product => {
           var category_data = res2.data.filter(item => item.fastfood_id == fastfood_1.id)
        var newdata = []
        for (let i = 0; i < product.data.length; i++) {
          product.data[i].push = false
          for (let j = 0; j < category_data.length; j++) {
            if (product.data[i].category_id == category_data[j].id) {
              product.data[i].push = true
            }
          }
          if (product.data[i].push) {
            newdata.push(product.data[i])
          }
        }  
        for (let i = 0; i < filtered.length; i++) {
          for (let j = 0; j < newdata.length; j++) {
            if (filtered[i].product_id === newdata[j].id) {
              filtered[i].product_name = newdata[j].name;
              filtered[i].price = newdata[j].price;
              
              allprice += filtered[i].price * filtered[i].count;
            }
          }
        }
     


        setAll_price(allprice);
        setProduct(newdata);
      }).catch(err => {
        console.error(err);
      });
    })

  }).catch(err => {
    console.error(err);
  });
}
  const getZakaz = () => {
    axios.get(`${url}/zakaz_products`).then(res => {
      var fastfood_1=JSON.parse(localStorage.getItem('user'))
     var filtered = res.data
  .filter(item => item.fastfood_id == fastfood_1.id)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setZakaz_p(filtered);
      let allprice = 0;
      axios.get(`${url}/categories`).then(res2 => {
        axios.get(`${url}/products`).then(product => {
             var category_data = res2.data.filter(item => item.fastfood_id == fastfood_1.id)
          var newdata = []
          for (let i = 0; i < product.data.length; i++) {
            product.data[i].push = false
            for (let j = 0; j < category_data.length; j++) {
              if (product.data[i].category_id == category_data[j].id) {
                product.data[i].push = true
              }
            }
            if (product.data[i].push) {
              newdata.push(product.data[i])
            }
          }  
          for (let i = 0; i < filtered.length; i++) {
            for (let j = 0; j < newdata.length; j++) {
              if (filtered[i].product_id === newdata[j].id) {
                filtered[i].product_name = newdata[j].name;
                filtered[i].price = newdata[j].price;
                
                allprice += filtered[i].price * filtered[i].count;
              }
            }
          }
       


          setAll_price(allprice);
          setProduct(newdata);
        }).catch(err => {
          console.error(err);
        });
      })

    }).catch(err => {
      console.error(err);
    });
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchedZakaz = zakaz_p.filter(item =>
      item.product_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setZakaz_p(searchedZakaz);
  };

  const paginatedZakaz = zakaz_p.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard</h2>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Barcha haridlar</h3>
          <p>{all_price} so'm</p>
        </div>
        <div className={styles.statCard}>
          <h3>Sotuvlar</h3>
          <p>{zakaz_p.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Maxsulotlarim</h3>
          <p>{product.length}</p>
        </div>
      </div>
      <DiagrammaProduct/>
    <div style={{display:'flex', gap:'10px',alignItems:'center'}}>
    <input
        type="text"
        placeholder="Qidiruv..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
       <div className={styles['date-filter']} style={{display:'flex'}}>
            <label className={styles['date-filter__label']} htmlFor="start1">Boshlash:</label>
            <input type="date" id="start1" className={styles['date-filter__input']} />
            <label className={styles['date-filter__label']} htmlFor="end1">Tugash:</label>
            <input type="date" id="end1" className={styles['date-filter__input']} />
            <button className={styles['date-filter__button']} onClick={()=>myfilter_f()}>Filter</button>
        </div>
    </div>
      <div className={styles.latestOrders}>
        <h3>Sotuvlar</h3>
        <ul>
          {paginatedZakaz.map((item, key) => (
            <li key={key}>
              {item.product_name}
              <p style={{ fontSize: '12px' }}>{formatDate(item.created_at)}</p>
              <h5>{item.price} so'm x {item.count} ta</h5>
              <h5>Jami: {item.price * item.count} so'm</h5>
            </li>
          ))}
        </ul>
        <div className={styles.pagination}>
          {[...Array(Math.ceil(zakaz_p.length / itemsPerPage))].map((_, index) => (
            <button key={index} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleString('uz-UZ', options);
};

export default Dashboard;