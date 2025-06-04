"use client"
import { FaTrash } from 'react-icons/fa'; // Ikonka kutubxonasini import qiling

import { useState } from 'react';
import styles from '../styles/CartItem.module.css';
import { useCart } from './CartContext'; // Import the CartContext

const CartItem = ({ item, onRemove }) => {
  const { setCart } = useCart(); // useCart'dan setCart funksiyasini oling
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartQuantity(newQuantity);
    } else if (quantity === 1) {
      onRemove(item.id); // Agar quantity 1 bo'lsa, to'liq o'chirish
    }
  };

  const updateCartQuantity = (newQuantity) => {
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );
  };

  return (
    <div className={styles.cartItem}>
    <img src={item.image} alt={item.name} className={styles.cartItem__image} />
    <div className={styles.cartItem__details}>
      <h4 className={styles.cartItem__title}>{item.name}</h4>
      <p className={styles.cartItem__price}>${item.price}</p>
      <div className={styles.cartItem__quantity}>
        <button onClick={handleDecrement} className={styles.cartItem__button}>-</button>
        <span className={styles.cartItem__count}>{quantity}</span>
        <button onClick={handleIncrement} className={styles.cartItem__button}>+</button>
      </div>
    </div>
    <button onClick={() => onRemove(item.id)} className={styles.cartItem__remove}>
      <FaTrash /> {/* Ikonkani qo'shish */}
    </button>
  </div>
  );
};

export default CartItem;