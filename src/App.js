// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar"; // or "./components/AppNavbar.jsx"
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Backfill from "./pages/Backfill";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <Router>
      <SearchProvider>
        <CartProvider>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/backfill" element={<Backfill />} />
          </Routes>
        </CartProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;
