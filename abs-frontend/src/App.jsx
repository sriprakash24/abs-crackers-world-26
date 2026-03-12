import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Products from "./pages/Products";

import CartPage from "./pages/CartPage";

import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/products/:category" element={<Products />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;
