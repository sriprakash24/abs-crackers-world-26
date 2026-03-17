import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { CheckCircle, Truck, PackageCheck, CreditCard } from "lucide-react";

function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err));
  }, [orderId]);

  if (!order) return <p className="p-6">Loading...</p>;

  const isVerified = order.paymentStatus === "VERIFIED";
  const isPacked =
    order.orderStatus === "PACKING" ||
    order.orderStatus === "READY_TO_SHIP" ||
    order.orderStatus === "SHIPPED";

  const isShipped = order.orderStatus === "SHIPPED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="relative bg-white rounded-3xl shadow-lg border border-orange-100 p-5 overflow-hidden">
          {/* top gradient strip */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"></div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Truck className="text-orange-600" size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Tracking Order</p>
                <h3 className="font-bold text-gray-800 text-sm">
                  #{order.orderNumber}
                </h3>
              </div>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* 🔥 PROGRESS BAR */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center relative">
            {/* line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>

            <Step label="Placed" active icon={<CheckCircle size={18} />} />
            <Step
              label="Payment"
              active={isVerified}
              icon={<CreditCard size={18} />}
            />
            <Step
              label="Packed"
              active={isPacked}
              icon={<PackageCheck size={18} />}
            />
            <Step
              label="Shipped"
              active={isShipped}
              icon={<Truck size={18} />}
            />
          </div>
        </div>

        {/* DELIVERY DETAILS */}
        <div className="relative bg-white rounded-3xl shadow-lg border border-orange-100 p-5 overflow-hidden space-y-4">
          {/* gradient */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400"></div>

          <h3 className="font-semibold text-gray-800 text-sm">
            Shipment Details
          </h3>

          {!isShipped ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
              Your order is being prepared for shipment
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Transport</p>
                  <p className="font-semibold text-gray-800">
                    {order.transportName}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Tracking ID</p>
                  <p className="font-semibold text-gray-800">
                    {order.trackingId}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-gray-400">Shipped At</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.shippedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <a
                href={`http://localhost:8080/uploads/${order.shippingSlipPath}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl transition"
              >
                Download Shipping Slip
              </a>
            </>
          )}
        </div>

        {/* 📦 PACKAGE PROOF (FUTURE READY) */}
        {order.packageImages && order.packageImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold mb-4 text-gray-800">
              Packed Package Preview
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {order.packageImages.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:8080/uploads/${img}`}
                  className="rounded-xl object-cover h-48 w-full shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
}

/* STEP COMPONENT */
function Step({ label, active, icon }) {
  return (
    <div className="flex flex-col items-center z-10">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all
        ${
          active
            ? "bg-green-500 text-white border-green-500 shadow-md"
            : "bg-white text-gray-400 border-gray-300"
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-xs mt-2 ${
          active ? "text-green-600 font-semibold" : "text-gray-400"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

export default TrackOrder;
