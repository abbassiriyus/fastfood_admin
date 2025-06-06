import { useEffect, useState } from 'react';
import styles from './styles/ProductForm.module.css';
import axios from 'axios';
import url from "../../host/host";
import { RSCPathnameNormalizer } from 'next/dist/server/normalizers/request/rsc';
import ProductModal from './ProductModal';

const ProductForm = () => {
var [data,setData]=useState({})
const [products, setProducts] = useState([]);
const [productName, setProductName] = useState('');
const [price, setPrice] = useState('');
const [description, setDescription] = useState('');
const [category, setCategory] = useState('');
const [file, setFile] = useState(null);
const [categories, setCategories] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState('');
const [orders, setOrders] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', productName);
  formData.append('price', price);
  formData.append('description', description);
  formData.append('category_id', category);
  formData.append('image', file);
  formData.append('orders', orders);

  if (file) {
    axios.post(`${url}/products`, formData).then(res => {
      getData();
      setProductName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setOrders('');
      setFile(null);
      document.querySelector('#file_2').value = "";
    }).catch(err => {
      console.error(err);
    });
  } else {
    alert("Rasmni tanlang");
  }
};


const getData = () => {
axios.get(`${url}/products`).then(res => {
axios.get(`${url}/categories`).then(res1=>{
var my_fastfood=JSON.parse(localStorage.getItem('user'))
  var mycategory=res1.data.filter(item=>item.fastfood_id==my_fastfood.id)
  
  setCategories(mycategory)
  var newdata=[]
  
  for (let i = 0; i < res.data.length; i++) {
  res.data[i].push=false
    for (let j = 0; j < mycategory.length; j++) {
    if(mycategory[j].id==res.data[i].category_id){
    res.data[i].push=true 
    res.data[i].category=mycategory[j].name
     }
  }
  if(res.data[i].push){
   newdata.push(res.data[i])  
  }
 
  }
const sortedData = newdata.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

// Saralangan ma'lumotlarni setProducts ga berish
setProducts(sortedData);
}).catch(err=>{
  })

});
};
const handleDelete=( id )=>{
axios.delete(`${url}/products/${id}`).then(res=>{
alert("Malumot ochirildi")
 getData() 
}).catch(err=>{ alert('Ochirishda xatolik bo`ldi')
})
}
useEffect(() => {
getData();
}, []);


useEffect(() => {
  if (data?.id) {
    setProductName(data.name);
    setPrice(data.price);
    setDescription(data.description);
    setCategory(data.category_id);
    setOrders(data.orders); // bu yerda qo‘shildi
  }
}, [data]);


const handleEdit = (id) => {
setIsModalOpen(true)
setData(id)
};

return (
<div className={styles.formContainer}>
<form onSubmit={handleSubmit}>
<input
className={styles.input}
type="text"
placeholder="Mahsulot nomi"
value={productName}
onChange={(e) => setProductName(e.target.value)}
/>
<input
className={styles.input}
type="number"
placeholder="Narx"
value={price}
onChange={(e) => setPrice(e.target.value)}
/>
<input
  className={styles.input}
  type="number"
  placeholder="Tartib raqami (orders)"
  value={orders}
  onChange={(e) => setOrders(e.target.value)}
/>

<input
className={styles.input}
type="text"
placeholder="Tavsif"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>
<select
className={styles.input}
value={category}
onChange={(e) => setCategory(e.target.value)}
>
<option value="">Tanlang</option>
{categories.map((item,key)=>{
return <option key={key} value={item.id}>{item.name}</option>
})}
</select>
<label>
Rasm yuklash:
<input
type="file"
id='file_2'
onChange={(e) => setFile(e.target.files[0])}
/>
</label><br />
<button className={styles.button} type="submit">Qo'shish</button>
</form>
<div className={styles.filterContainer}>
  <label>Kategoriya bo‘yicha filter:</label>
  <select
    className={styles.input}
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">Barchasi</option>
    {categories.map(cat => (
      <option key={cat.id} value={cat.id}>{cat.name}</option>
    ))}
  </select>
</div>

<div className={styles.productGrid}>
{products
  .filter(product => selectedCategory === '' || product.category_id === +selectedCategory)
  .map(product => (
    <div key={product.id} className={styles.productCard}>
      <img src={product.image} alt={product.name} className={styles.cardImage} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Narx:</strong> {product.price} so'm</p>
      <p><strong>Kategoriya:</strong> {product.category}</p>
      <p><strong>Tartib raqami:</strong> {product.orders}</p> {/* ✅ Qo‘shildi */}
      <div className={styles.cardButtons}>
        <button onClick={() => handleEdit(product)} className={styles.editButton}>✏️</button>
        <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>🗑️</button>
      </div>
    </div>
))}


</div>

<ProductModal data={data} isOpen={isModalOpen} onClose={() =>{ setIsModalOpen(false),getData()}} />
</div>
);
};
export default ProductForm;