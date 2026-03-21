import logo from "../assets/logo1.png";
import { Package, User, MapPin, CreditCard } from "lucide-react";

function InvoiceTemplate({ order }) {
  return (
    <div id="invoice-content" className="bg-white text-gray-800 p-8 w-[800px]">
      {/* HEADER */}

      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-14" />

          <div>
            <h1 className="text-xl font-bold text-red-600">ABS Crackers</h1>

            <p className="text-xs text-gray-500">Chinnakamanpatti</p>
            <p className="text-xs text-gray-500">Sivakasi, Tamil Nadu</p>

            <p className="text-xs text-gray-500">Phone: +91 9597189599</p>

            <p className="text-xs text-gray-500">
              Email: support@abscrackers.com
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold">INVOICE</h2>

          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
        </div>
      </div>

      {/* ORDER INFO */}

      <div className="flex justify-between mt-6 text-sm">
        {/* BILL TO */}

        <div style={{ width: "50%" }}>
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <User size={16} />
            Bill To
          </div>

          <p>{order.deliveryName}</p>

          <p>{order.deliveryPhone}</p>

          <p>{order.deliveryAddress}</p>

          <p>
            {order.deliveryCity}, {order.deliveryState}
          </p>

          <p>{order.deliveryPincode}</p>
        </div>

        {/* ORDER DETAILS */}

        <div style={{ width: "40%", textAlign: "right" }}>
          <p>
            <b>Order ID :</b> {order.orderId}
          </p>

          <p>
            <b>Invoice Date :</b>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <p>
            <b>Payment Status :</b> {order.paymentStatus}
          </p>

          <p>
            <b>Order Status :</b> {order.orderStatus}
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}

      <div className="mt-8">
        <div className="flex items-center gap-2 font-semibold mb-3">
          <Package size={16} />
          Order Items
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>

              <th className="p-2">Qty</th>

              <th className="p-2">Price</th>

              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-t">
                <td className="p-2">{item.productName}</td>

                <td className="p-2 text-center">{item.quantity}</td>

                <td className="p-2 text-center">₹{item.price}</td>

                <td className="p-2 text-center font-semibold">
                  ₹{item.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}

      <div className="flex justify-end mt-6">
        <div className="w-64 border rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>

            <span className="text-red-600">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="text-center text-xs text-gray-500 mt-8 border-t pt-4">
        Thank you for shopping with ABS Crackers
      </div>
    </div>
  );
}

export default InvoiceTemplate;
