import { useEffect, useState } from "react";
import API from "../../api/api";

function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/api/admin/orders");

      const pending = res.data.filter((o) => o.paymentStatus === "SUBMITTED");

      setOrders(pending);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const verifyPayment = async (id) => {
    try {
      await API.post(`/api/admin/orders/${id}/verify`);
      loadOrders();
    } catch (err) {
      alert("Verification failed");
    }
  };

  const rejectPayment = async (id) => {
    try {
      await API.post(`/api/admin/orders/${id}/reject`);
      loadOrders();
    } catch (err) {
      alert("Reject failed");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Pending Payments</h2>

      {orders.length === 0 && (
        <div className="text-gray-500 text-sm">No pending payments</div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow p-4 space-y-3"
        >
          <div className="flex justify-between">
            <div className="font-semibold">{order.orderNumber}</div>

            <div className="text-red-600 font-bold">₹{order.totalAmount}</div>
          </div>

          <div className="text-sm text-gray-500">
            Ref: {order.paymentReference || "-"}
          </div>

          {/* Screenshot */}

          {order.paymentScreenshotPath && (
            <img
              src={order.paymentScreenshotPath}
              alt="payment"
              className="rounded-lg border"
            />
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => verifyPayment(order.id)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg"
            >
              Verify
            </button>

            <button
              onClick={() => rejectPayment(order.id)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPayments;
