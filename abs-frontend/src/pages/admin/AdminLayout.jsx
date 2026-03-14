import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* HEADER */}

      <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-red-600 text-lg">Admin Panel</h1>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl text-red-500 leading-none"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="w-64 bg-white shadow-lg p-4">
            <h2 className="text-lg font-bold mb-4">Admin Menu</h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/admin/categories");
                  setMenuOpen(false);
                }}
                className="text-left p-2 hover:bg-gray-100 rounded"
              >
                Categories
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="text-left p-2 hover:bg-gray-100 rounded"
              >
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

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <button
          onClick={() => navigate("/admin")}
          className="flex flex-col items-center text-xs"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          className="flex flex-col items-center text-xs"
        >
          <Package size={20} />
          Products
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="flex flex-col items-center text-xs"
        >
          <ShoppingCart size={20} />
          Orders
        </button>

        <button
          onClick={logout}
          className="flex flex-col items-center text-xs text-red-500"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminLayout;
