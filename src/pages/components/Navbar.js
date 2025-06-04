import Link from 'next/link';
import styles from './styles/Navbar.module.css';

const Navbar = ({ setActiveTab }) => {
  return (
    <nav>
      <ul>
        <li onClick={() => setActiveTab('dashboard')}>Dashboard</li>
        <li onClick={() => setActiveTab('categories')}>Kategoriyalar</li>
        <li onClick={() => setActiveTab('products')}>Mahsulotlar</li>
      </ul>
    </nav>
  );
};

export default Navbar;