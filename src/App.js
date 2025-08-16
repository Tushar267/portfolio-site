import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <SearchProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />


          </Routes>
        </CartProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;
