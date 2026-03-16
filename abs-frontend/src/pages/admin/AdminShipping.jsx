import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Swal from "sweetalert2";

function AdminShipping() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [trackingId, setTrackingId] = useState("");
  const [transportName, setTransportName] = useState("");
  const [file, setFile] = useState(null);

  const loadOrder = async () => {
    try {
      const res = await API.get(`/api/admin/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to load order", error);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleShip = async () => {
    if (!trackingId || !transportName || !file) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill all fields",
      });

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("trackingId", trackingId);
      formData.append("transportName", transportName);

      await API.post(`/api/admin/orders/${id}/ship`, formData);

      await Swal.fire({
        icon: "success",
        title: "Order Shipped",
        confirmButtonText: "OK",
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Shipping Failed",
      });
    }
  };

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-5">
        Ship Order #{order.orderNumber}
      </h1>

      <div className="bg-white rounded-xl shadow p-5 space-y-4">
        {/* TRANSPORT NAME */}

        <div>
          <label className="text-sm font-semibold">Transport Name</label>

          <input
            type="text"
            value={transportName}
            onChange={(e) => setTransportName(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* TRACKING ID */}

        <div>
          <label className="text-sm font-semibold">Tracking ID</label>

          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* FILE */}

        <div>
          <label className="text-sm font-semibold">Upload Transport Slip</label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mt-1"
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={handleShip}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Mark as Shipped
        </button>
      </div>
    </div>
  );
}

export default AdminShipping;
