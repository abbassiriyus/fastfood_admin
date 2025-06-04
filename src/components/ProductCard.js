import styles from "../styles/ProductCard.module.css";
import { useCart } from './CartContext';
import { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const { addToCart, cart, setCart } = useCart();
  const [quantity, setQuantity] = useState(0);

  // Mahsulot avvaldan sotib olinganmi yoki yo'qligini tekshirish
  useEffect(() => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setQuantity(existingProduct.quantity);
    }
  }, [cart, product.id]);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + 1;
      updateCartQuantity(newQuantity);
      return newQuantity;
    });
  };
  
  const decreaseQuantity = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity > 1) {
        const newQuantity = prevQuantity - 1;
        updateCartQuantity(newQuantity);
        return newQuantity;
      } else if (prevQuantity === 1) {
        // 0 ga tushganda mahsulotni o'chirish
        removeFromCart();
        return 0; // Sonni 0 ga o'rnatish
      }
      return prevQuantity; // 1 dan pastga tushmasin
    });
  };
  
  const removeFromCart = () => {
    setCart(cart.filter(item => item.id !== product.id)); // Mahsulotni o'chirish
  };
  
  const updateCartQuantity = (newQuantity) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    setQuantity(1); // Tugma bosilganda sonni qayta tiklash
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardImageDiv}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.productCardImage}
        />
      </div>
      <div className={styles.productCardContent}>
        <del className={styles.productCardPriceDel}>${product.price}</del>
        <p className={styles.productCardPrice}>${product.price}</p>
        <h3 className={styles.productCardTitle}>{product.name}</h3>
        <p className={styles.productCardDescription}>{product.description}</p>
        {quantity > 0 ? (
          <div className={styles.productCardAction}>
            <button className={styles.productCardButton1} onClick={decreaseQuantity}>-</button>
            <div className={styles.productCardCount}>{quantity}</div>
            <button className={styles.productCardButton1} onClick={increaseQuantity}>+</button>
          </div>
        ) : (
          <button className={styles.productCardButton} onClick={handleAddToCart}>Korzinkaga qo'shish</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;