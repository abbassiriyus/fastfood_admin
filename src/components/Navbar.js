"use client"
import Link from 'next/link';
import { FaShoppingCart, FaClipboardCheck } from 'react-icons/fa';
import styles from "../styles/Navbar.module.css";
import { useCart } from './CartContext';
import url from '@/host/host';

// Socket.io serveriga ulanish

const Navbar = () => {
  const { cartCount, setCart } = useCart();

  // LocalStorage'dan cartni olish





  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        <Link href="/" className={styles.navbar__logo}>MenuGo</Link>
        <div className={styles.navbar__items}>
          <Link href="/cart" className={styles.navbar__item}>
            <FaShoppingCart className={styles.navbar__icon} />
            <span className={styles.navbar__notification}>{cartCount}</span>
          </Link>
          <Link href="/orders" className={styles.navbar__item}>
            <FaClipboardCheck className={styles.navbar__icon} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;