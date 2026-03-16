import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  Boxes,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* HEADER */}
      <div className="bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="font-bold text-red-600 text-lg">ABS Admin</h1>

        <button onClick={() => setMenuOpen(true)} className="text-red-600">
          <Menu size={26} />
        </button>
      </div>

      {/* SIDE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* drawer */}
          <div className="w-64 bg-white shadow-xl p-4">
            <h2 className="text-lg font-bold mb-4">Admin Menu</h2>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/admin/categories");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
              >
                <Boxes size={18} />
                Categories
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-3 p-3 rounded hover:bg-red-50 text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="p-4">
        <Outlet />
      </div>

      {/* BOTTOM NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow">
        <button
          onClick={() => navigate("/admin")}
          className={`flex flex-col items-center text-xs ${
            isActive("/admin") ? "text-red-600" : "text-gray-600"
          }`}
        >
          <LayoutDashboard size={22} />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          className={`flex flex-col items-center text-xs ${
            isActive("/admin/products") ? "text-red-600" : "text-gray-600"
          }`}
        >
          <Package size={22} />
          Products
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className={`flex flex-col items-center text-xs ${
            isActive("/admin/orders") ? "text-red-600" : "text-gray-600"
          }`}
        >
          <ShoppingCart size={22} />
          Orders
        </button>
        <button
          onClick={() => navigate("/admin/payments")}
          className={`flex flex-col items-center text-xs ${
            isActive("/admin/payments") ? "text-red-600" : "text-gray-600"
          }`}
        >
          <CreditCard size={22} />
          Payments
        </button>

        <button
          onClick={logout}
          className="flex flex-col items-center text-xs text-red-600"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminLayout;
