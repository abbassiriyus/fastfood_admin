import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CategoryForm from './components/CategoryForm';
import ProductForm from './components/ProductForm';
import UserProfile from './components/UserProfile'; // Yangi import
import styles from '../styles/FastFoodAdmin.module.css';
import ResetParol from './components/ResetParol'
import CarouselForm from './components/carouselForm';
const FastFood = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
const [namee,setNamee]=useState('')
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <CategoryForm />;
      case 'products':
        return <ProductForm />;
      case 'profile': // Yangi bo'lim
        return <UserProfile />;
        case 'carousel': // Yangi bo'lim
        return <CarouselForm />;
      case 'reset': // Yangi bo'lim
        return <ResetParol />;
      default:
        return <Dashboard />;
    }
  };
useEffect(()=>{
 setNamee( (JSON.parse(localStorage.getItem("user"))).username)
},[])
  return (
    <div>
      <div className={styles.container}>
        <h1 style={{margin:'10px',marginTop:'0px',paddingTop:'10px',textAlign:'center'}}>{namee}</h1>
        <div className={styles.buttonContainer}>
          <button onClick={() => setActiveTab('dashboard')} className={styles.tabButton}>Dashboard</button>
          <button onClick={() => setActiveTab('carousel')} className={styles.tabButton}>Karusel</button>
          <button onClick={() => setActiveTab('categories')} className={styles.tabButton}>Kategoriyalar</button>
          <button onClick={() => setActiveTab('products')} className={styles.tabButton}>Mahsulotlar</button>
          <button onClick={() => setActiveTab('profile')} className={styles.tabButton}>Shaxsiy Ma'lumotlar</button> {/* Yangi tugma */}
          <button onClick={() => setActiveTab('reset')} className={styles.tabButton}>Reset parol</button> {/* Yangi tugma */} 
        </div>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>  
    </div>
  );
};

export default FastFood;