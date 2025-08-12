import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SearchProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </SearchProvider>
);