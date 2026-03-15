import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import InvoiceTemplate from "../pages/InvoiceTemplate";
import { generateInvoice } from "../utils/generateInvoice";

import { Package, CreditCard, FileText, Eye, ArrowLeft } from "lucide-react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const statusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-600";

      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paymentColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-600";

      case "SUBMITTED":
        return "bg-blue-100 text-blue-600";

      case "VERIFIED":
        return "bg-green-100 text-green-600";

      case "REJECTED":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 min-h-screen p-6 pb-24">
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/", { replace: true })}
          className="p-2 rounded-full hover:bg-white"
        >
          <ArrowLeft className="text-red-500" />
        </button>

        <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Package size={40} className="mx-auto mb-3 text-gray-400" />
          No orders placed yet
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-[2px] transition-all"
            >
              {/* HEADER */}

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Package className="text-red-500" />

                  <h3 className="font-semibold text-gray-800">
                    Order #{order.orderNumber}
                  </h3>
                </div>

                <span
                  className={`text-[11px] px-3 py-1 rounded-full font-semibold ${statusColor(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* ORDER DETAILS */}

              <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700 mt-3">
                <div>
                  <span className="text-gray-500">Order ID</span>
                  <p className="font-semibold">{order.orderId}</p>
                </div>

                <div>
                  <span className="text-gray-500">Items</span>
                  <p className="font-semibold">{order.items.length}</p>
                </div>

                <div>
                  <span className="text-gray-500">Amount</span>
                  <p className="font-semibold text-red-600">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">Payment</span>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <Eye size={16} />
                  View Items
                </button>

                {order.paymentStatus === "PENDING" && (
                  <button
                    onClick={() => navigate(`/payment/${order.orderId}`)}
                    className="flex items-center gap-1 text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <CreditCard size={16} />
                    Pay Now
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedOrder(order);

                    setTimeout(() => {
                      generateInvoice(order.orderNumber);
                    }, 300);
                  }}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  <FileText size={16} />
                  Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ITEMS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedOrder.items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <img
                    src={item.imageUrl}
                    className="w-12 h-12 object-contain"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.productName}</p>

                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>

                  <p className="font-semibold text-sm">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* OFFSCREEN INVOICE RENDERER */}

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        {selectedOrder && <InvoiceTemplate order={selectedOrder} />}
      </div>
    </div>
  );
}

export default OrdersPage;
