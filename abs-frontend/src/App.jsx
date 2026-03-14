import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Products from "./pages/Products";

import CartPage from "./pages/CartPage";

import OrdersPage from "./pages/OrdersPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminCategories from "./pages/admin/AdminCategories";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/products/:category" element={<Products />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}

export default App;
