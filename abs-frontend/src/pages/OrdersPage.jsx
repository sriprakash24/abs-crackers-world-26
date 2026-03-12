import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await API.get("/api/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow px-4 py-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-red-500 font-semibold"
        >
          ← Back
        </button>

        <h2 className="text-lg font-bold mt-1">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">
                    Order #{order.orderNumber}
                  </h3>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold
      ${
        order.orderStatus === "PLACED"
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-100 text-gray-600"
      }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Order ID:</span>{" "}
                    {order.orderId}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">Items:</span>{" "}
                    {order.items.length}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">Payment:</span>
                    <span className="ml-2 inline-block bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* Amount */}
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Amount</span>
                  <span className="text-red-600 font-bold text-lg">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
