import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* HEADER */}
      <div className="bg-white shadow p-4 text-center font-bold text-red-600">
        Admin Panel
      </div>

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
