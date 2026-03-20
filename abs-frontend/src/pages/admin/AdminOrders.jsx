import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, Truck } from "lucide-react";

function getStatusStyle(status) {
  switch (status) {
    case "PROCESSING":
      return "bg-orange-100 text-orange-700 border border-orange-300";
    case "READY_TO_SHIP":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "DELIVERED":
      return "bg-green-100 text-green-700 border border-green-300";
    case "PLACED":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function SkeletonCard() {
  return (
    <div className="bg-white/50 backdrop-blur animate-pulse h-32 rounded-2xl shadow"></div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/api/admin/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-5 pb-24 bg-gradient-to-br from-gray-50 to-gray-100 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-500 text-sm">
          Track and manage all orders efficiently
        </p>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No orders available
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="relative bg-white/80 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-5 border border-gray-100 hover:scale-[1.02]"
            >
              {/* LEFT ACCENT */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl"></div>

              {/* TOP */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-semibold text-gray-800 text-lg">
                    #{o.orderNumber}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                    o.orderStatus,
                  )}`}
                >
                  {o.orderStatus}
                </span>
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Amount</p>
                  <p className="text-xl font-bold text-red-600">
                    ₹{o.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Customer</p>
                  <p className="font-semibold text-gray-800">{o.user?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Payment</p>
                  <p className="font-semibold">{o.paymentStatus}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Mobile</p>
                  <a
                    href={`tel:${o.user?.phone}`}
                    className="text-blue-600 font-semibold"
                  >
                    📞 {o.user?.phone}
                  </a>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5 flex-wrap">
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  View
                </button>

                {o.paymentStatus === "SUBMITTED" && (
                  <button
                    onClick={() => navigate(`/admin/payments`)}
                    className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    <CreditCard size={16} /> Verify
                  </button>
                )}

                {o.orderStatus === "PROCESSING" && (
                  <button
                    onClick={() => navigate(`/admin/packing/${o.id}`)}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                  >
                    <Package size={16} /> Packing
                  </button>
                )}

                {o.orderStatus === "READY_TO_SHIP" && (
                  <button
                    onClick={() => navigate(`/admin/shipping/${o.id}`)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Truck size={16} /> Ship
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-5">
            <h2 className="text-lg font-bold mb-4">
              Order #{selectedOrder.orderNumber}
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  <img
                    src={item.product.imageUrl}
                    className="w-12 h-12 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-red-500">
                    ₹{item.totalPrice}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
