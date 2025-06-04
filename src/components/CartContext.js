// CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Mahsulotlar qo'shilganda yoki o'zgarganda cartCount yangilanishi
  useEffect(() => {
    setCartCount(cart.length);
    localStorage.setItem('shop', JSON.stringify(cart)); // LocalStorage'ga saqlash
  }, [cart]);

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find(item => item.id === product.id);
    let updatedCart;
  
    if (existingProduct) {
      updatedCart = cart.map(item => 
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }
  
    setCart(updatedCart);
    localStorage.setItem('shop', JSON.stringify(updatedCart)); // LocalStorage'ga saqlash
  };

 

  // Cart o'zgaris  hi bilan localStorage'ni yangilash


  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart,setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);