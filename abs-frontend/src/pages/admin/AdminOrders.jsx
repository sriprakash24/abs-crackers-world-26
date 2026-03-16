import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await API.get("/api/admin/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition"
            >
              {/* ORDER HEADER */}

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order Number</p>
                  <p className="font-semibold text-gray-800">
                    #{o.orderNumber}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {o.orderStatus}
                </span>
              </div>

              {/* ORDER INFO */}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Amount</p>
                  <p className="font-semibold text-red-600">₹{o.totalAmount}</p>
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
                    className="flex items-center gap-1 text-blue-600 font-semibold"
                  >
                    📞 {o.user?.phone}
                  </a>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="text-sm px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  View
                </button>

                {o.paymentStatus === "SUBMITTED" && (
                  <button
                    onClick={() => navigate(`/admin/payments`)}
                    className="text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Verify Payment
                  </button>
                )}

                {o.orderStatus === "PROCESSING" && (
                  <button
                    onClick={() => navigate(`/admin/packing/${o.id}`)}
                    className="text-sm px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Start Packing
                  </button>
                )}
                {o.orderStatus === "READY_TO_SHIP" && (
                  <button
                    onClick={() => navigate(`/admin/shipping/${o.id}`)}
                    className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ship Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] p-5">
            <h2 className="text-lg font-bold mb-4">
              Order #{selectedOrder.orderNumber}
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  <img
                    src={item.product.imageUrl}
                    className="w-12 h-12 object-contain"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product.name}</p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-red-600">
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
