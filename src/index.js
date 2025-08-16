import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from "./context/AuthContext"; // ✅ import the provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap the app so useAuth works everywhere */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
