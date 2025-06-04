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
const handleSubmit = (e) => {
e.preventDefault(); // Formni yuborishni to'xtatish

const formData = new FormData();
formData.append('name', productName);
formData.append('price', price);
formData.append('description', description);
formData.append('category_id', category);
formData.append('image', file);
if(file){
axios.post(`${url}/products`, formData).then(res => {
  getData(); // Yangi mahsulot qo'shilgandan so'ng ma'lumotlarni yangilash
  // Form ma'lumotlarini tozalash
  setProductName('');
  setPrice('');
  setDescription('');
  setCategory('');
  setFile(null);
  document.querySelector('#file_2').files[0]=null
  document.querySelector('#file_2').value=""

}).catch(err => {
  console.error(err);
});
}else{
  alert("rasmni qayta tanlang")
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
<ul className={styles.list}>
{products.map(product => (
<li className={styles.listItem} key={product.id}>
<div className={styles.productDetails}>
<strong>{product.name}</strong> - {product.price} so'm
<p>{product.description}</p>
<p>Kategoriya: {product.category}</p>
<img src={product.image} alt={product.name} className={styles.productImage} />
</div>
<button className={styles.editButton}
onClick={() => handleEdit(product)}>Tahrirlash</button>
<button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>O'chirish</button>
</li>
))}
</ul>
<ProductModal data={data} isOpen={isModalOpen} onClose={() =>{ setIsModalOpen(false),getData()}} />
</div>
);
};
export default ProductForm;