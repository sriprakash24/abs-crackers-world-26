import { useEffect, useState } from "react";

import API from "../api/api";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await API.get("/api/cart");

      setCartItems(res.data.items);
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await API.delete(`/api/cart/remove/${productId}`);

      loadCart();
    } catch (error) {
      console.error("Remove failed", error);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/api/cart/clear");

      loadCart();
    } catch (error) {
      console.error("Clear cart failed", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.sellingPrice * item.quantity;
    }, 0);
  };

  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white shadow rounded-xl p-4 flex gap-4 items-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-contain"
                />

                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.productName}</p>

                  <p className="text-gray-400 text-xs line-through">
                    ₹{item.mrp}
                  </p>

                  <p className="text-red-600 font-bold">₹{item.sellingPrice}</p>

                  <p className="text-sm mt-1">Qty: {item.quantity}</p>

                  <p className="text-sm font-semibold mt-1">
                    Subtotal: ₹{item.sellingPrice * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <p className="text-lg font-bold">Total: ₹{getTotal()}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={clearCart}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Clear Cart
              </button>

              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
