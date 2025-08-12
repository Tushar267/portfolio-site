// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // parse price from product.price which might be "₹1,499" or 1499
  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const formatPrice = (value) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const addItem = (product, qty = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      const price = parsePrice(product.price);
      if (idx > -1) {
        // already in cart -> increase qty
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      // add new
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price,
          image: product.image,
          qty,
        },
      ];
    });
  };

  const updateItemQty = (id, qty) => {
    setCartItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, qty } : p));
    });
  };

  const removeItem = (id) => setCartItems((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalAmount = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateItemQty,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
