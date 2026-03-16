import { useEffect, useState } from "react";
import API from "../../api/api";
import { ShoppingCart, Clock, PackageCheck, IndianRupee } from "lucide-react";

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} />
      </div>

      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h2 className="text-lg font-bold">{value}</h2>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingPayments: 0,
    processingOrders: 0,
    readyToShip: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/api/admin/orders");

      const orders = res.data;

      const pending = orders.filter(
        (o) => o.paymentStatus === "SUBMITTED",
      ).length;

      const processing = orders.filter(
        (o) => o.orderStatus === "PROCESSING",
      ).length;

      const ready = orders.filter(
        (o) => o.orderStatus === "READY_TO_SHIP",
      ).length;

      const revenue = orders
        .filter((o) => o.paymentStatus === "VERIFIED")
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);

      setStats({
        pendingPayments: pending,
        processingOrders: processing,
        readyToShip: ready,
        revenue,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Dashboard</h2>

      {/* STATS GRID */}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Clock}
          title="Pending Payments"
          value={stats.pendingPayments}
          color="bg-yellow-100"
        />

        <StatCard
          icon={ShoppingCart}
          title="Processing"
          value={stats.processingOrders}
          color="bg-blue-100"
        />

        <StatCard
          icon={PackageCheck}
          title="Ready To Ship"
          value={stats.readyToShip}
          color="bg-green-100"
        />

        <StatCard
          icon={IndianRupee}
          title="Revenue"
          value={`₹${stats.revenue}`}
          color="bg-red-100"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
