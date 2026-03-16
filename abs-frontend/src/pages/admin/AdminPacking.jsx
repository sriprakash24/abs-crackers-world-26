import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Swal from "sweetalert2";

function AdminPacking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [packedItems, setPackedItems] = useState({});
  const navigate = useNavigate();

  const storageKey = `packing_${id}`;

  // LOAD ORDER
  const loadOrder = async () => {
    try {
      const res = await API.get(`/api/admin/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to load order", error);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadOrder();

    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setPackedItems(JSON.parse(saved));
    }
  }, [id]);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    if (Object.keys(packedItems).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(packedItems));
    }
  }, [packedItems, storageKey]);

  // INCREASE PACK
  const increasePacked = (item) => {
    setPackedItems((prev) => {
      const current = prev[item.id] || 0;

      if (current >= item.quantity) return prev;

      return {
        ...prev,
        [item.id]: current + 1,
      };
    });
  };

  // DECREASE PACK
  const decreasePacked = (item) => {
    setPackedItems((prev) => {
      const current = prev[item.id] || 0;

      if (current <= 0) return prev;

      return {
        ...prev,
        [item.id]: current - 1,
      };
    });
  };

  // MANUAL INPUT
  const handleManualChange = (item, value) => {
    let num = parseInt(value);

    if (isNaN(num)) num = 0;

    if (num > item.quantity) num = item.quantity;

    if (num < 0) num = 0;

    setPackedItems((prev) => ({
      ...prev,
      [item.id]: num,
    }));
  };

  // TOGGLE FULL PACK
  const togglePacked = (item) => {
    const packed = packedItems[item.id] || 0;

    setPackedItems((prev) => ({
      ...prev,

      [item.id]: packed === item.quantity ? 0 : item.quantity,
    }));
  };

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500">Loading order...</div>
    );
  }

  const packedCount = Object.values(packedItems).reduce((a, b) => a + b, 0);

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const completePacking = async () => {
    const confirm = await Swal.fire({
      title: "Complete Packing?",
      text: "All items are packed. Do you want to mark this order ready to ship?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete Packing",
    });

    if (!confirm.isConfirmed) return;

    try {
      for (const item of order.items) {
        const packedQty = packedItems[item.id] || 0;

        if (packedQty > 0) {
          const formData = new FormData();
          formData.append("productId", item.product.id);
          formData.append("quantity", packedQty);

          await API.post(`/api/admin/orders/${id}/pack`, formData);
        }
      }

      // Clear local storage
      localStorage.removeItem(storageKey);

      await Swal.fire({
        icon: "success",
        title: "Packing Completed",
        text: "Order is ready to ship.",
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error("Packing failed", error);

      Swal.fire({
        icon: "error",
        title: "Packing Failed",
        text: "Something went wrong while updating packing.",
      });
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen pb-24">
      {/* HEADER */}

      <h1 className="text-xl font-bold mb-5 text-gray-800">
        Packing Order #{order.orderNumber}
      </h1>

      {/* ITEM LIST */}

      <div className="bg-white rounded-2xl shadow-md divide-y">
        {order.items.map((item) => {
          const packed = packedItems[item.id] || 0;
          const remaining = item.quantity - packed;
          const isComplete = packed === item.quantity;

          return (
            <div key={item.id} className="border-b p-4 space-y-3">
              {/* TOP ROW */}

              <div className="flex items-center gap-3">
                {/* TICK */}

                <button
                  onClick={() => togglePacked(item)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold
          ${isComplete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  ✓
                </button>

                {/* IMAGE */}

                <img
                  src={item.product?.imageUrl}
                  className="w-12 h-12 object-contain border rounded"
                />

                {/* PRODUCT NAME */}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight break-words">
                    {item.product?.name}
                  </p>
                </div>
              </div>

              {/* SECOND ROW */}

              <div className="flex items-center justify-between">
                {/* ORDER INFO */}

                <div className="flex gap-3 text-xs">
                  <span className="text-gray-500">
                    Ordered: {item.quantity}
                  </span>

                  <span className="text-green-600 font-semibold">
                    Packed: {packed}
                  </span>

                  <span className="text-red-500 font-semibold">
                    Remaining: {remaining}
                  </span>
                </div>

                {/* QUANTITY CONTROLS */}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreasePacked(item)}
                    className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={packed}
                    onChange={(e) => handleManualChange(item, e.target.value)}
                    className="w-12 h-9 text-center border rounded-lg text-sm"
                  />

                  <button
                    onClick={() => increasePacked(item)}
                    className="w-9 h-9 rounded-lg bg-green-500 text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROGRESS BAR */}

      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Packing Progress</span>

          <span className="font-semibold">
            {packedCount} / {totalQty}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{
              width: `${(packedCount / totalQty) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          disabled={packedCount !== totalQty}
          onClick={completePacking}
          className={`w-full py-3 rounded-lg font-semibold text-white
      ${
        packedCount === totalQty
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-300 cursor-not-allowed"
      }`}
        >
          Complete Packing
        </button>
      </div>
    </div>
  );
}

export default AdminPacking;
