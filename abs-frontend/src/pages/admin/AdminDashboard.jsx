import { useEffect, useState } from "react";
import API from "../../api/api";
import { ShoppingCart, Clock, PackageCheck, IndianRupee } from "lucide-react";

function StatCard({ icon: Icon, title, value, gradient }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}
    >
      <div className="absolute right-3 top-3 opacity-20">
        <Icon size={60} />
      </div>

      <div className="relative z-10">
        <p className="text-sm opacity-80">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="bg-gray-200 animate-pulse h-24 rounded-2xl"></div>;
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

  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">
          Monitor your business performance
        </p>
      </div>

      {/* STATS */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Clock}
            title="Pending Payments"
            value={stats.pendingPayments}
            gradient="bg-gradient-to-r from-yellow-400 to-yellow-500"
          />

          <StatCard
            icon={ShoppingCart}
            title="Processing Orders"
            value={stats.processingOrders}
            gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
          />

          <StatCard
            icon={PackageCheck}
            title="Ready To Ship"
            value={stats.readyToShip}
            gradient="bg-gradient-to-r from-green-500 to-emerald-600"
          />

          <StatCard
            icon={IndianRupee}
            title="Total Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            gradient="bg-gradient-to-r from-pink-500 to-red-500"
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
