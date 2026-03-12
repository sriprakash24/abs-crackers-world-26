import { useEffect, useState } from "react";
import API from "../../api/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

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
    <div>
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId} className="border-t text-sm">
              <td className="p-2">{o.orderNumber}</td>
              <td className="text-center">₹{o.totalAmount}</td>
              <td className="text-center">{o.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
