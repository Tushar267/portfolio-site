import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext();

const loadInitial = () => {
  try {
    const raw = localStorage.getItem("cart:v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const p = action.product;

      // Ensure ID is stable (prefer product.id from Firestore)
      const id =
        p?.id ??
        `${(p?.name || "item").toLowerCase().replace(/\s+/g, "-")}-${p?.price ?? 0}`;

      const existing = state.find((x) => x.id === id);
      if (existing) {
        return state.map((x) =>
          x.id === id ? { ...x, qty: x.qty + (action.qty || 1) } : x
        );
      }

      return [
        ...state,
        {
          id,
          name: p.name || "Item",
          price: Number(p.price) || 0,
          image: p.imageUrl || "", // ✅ FIXED: use imageUrl from Firestore
          qty: action.qty || 1,
        },
      ];
    }
    case "REMOVE":
      return state.filter((x) => x.id !== action.id);
    case "SET_QTY": {
      const { id, qty } = action;
      if (qty <= 0) return state.filter((x) => x.id !== id);
      return state.map((x) => (x.id === id ? { ...x, qty } : x));
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(reducer, [], loadInitial);

  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(cart));
  }, [cart]);

  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart]
  );
  const totalPrice = useMemo(
    () => cart.reduce((s, i) => s + i.qty * (Number(i.price) || 0), 0),
    [cart]
  );

  const addItem = (product, qty = 1) => dispatch({ type: "ADD", product, qty });
  const removeItem = (id) => dispatch({ type: "REMOVE", id });
  const setQty = (id, qty) => dispatch({ type: "SET_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addItem,
        removeItem,
        setQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
