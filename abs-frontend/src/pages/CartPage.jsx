import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import API from "../api/api";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showSummary, setShowSummary] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

      if (nearBottom) {
        setShowSummary(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const increaseQty = async (productId) => {
    try {
      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);

      loadCart(); // reload cart
    } catch (error) {
      console.error("Increase failed", error);
    }
  };

  const decreaseQty = async (productId, currentQty) => {
    try {
      if (currentQty <= 1) {
        await API.delete(`/api/cart/remove?productId=${productId}`);
      } else {
        await API.put(
          `/api/cart/update?productId=${productId}&quantity=${currentQty - 1}`,
        );
      }

      loadCart(); // reload cart
    } catch (error) {
      console.error("Decrease failed", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await API.delete(`/api/cart/remove?productId=${productId}`);

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

  const handleCheckout = async () => {
    try {
      const response = await API.post("/api/orders/checkout");

      console.log("Order created:", response.data);

      // optional: clear cart locally
      setCartItems([]);

      toast.success("Order placed successfully!");

      navigate("/");
    } catch (error) {
      console.error("Checkout failed", error);

      toast.error("Checkout failed. Please try again.");
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
    <div className="bg-gray-50 min-h-screen p-6 pb-48">
      <div className="sticky top-0 z-20 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={22} className="text-red-500" />
        </button>

        <h2 className="text-lg font-bold text-gray-700">Your Cart</h2>

        <div className="w-10"></div>
      </div>

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

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQty(item.productId, item.quantity)}
                      className="bg-gray-200 px-2 rounded"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.productId)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      +
                    </button>
                  </div>

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

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-4">
            {/* toggle arrow */}
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-gray-500 text-sm"
              >
                {showSummary ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronUp size={18} />
                )}
              </button>
            </div>

            {/* expandable section */}
            {showSummary && (
              <>
                <div className="flex justify-between text-gray-600 text-sm mb-1">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="flex justify-between text-gray-600 text-sm mb-2">
                  <span>Total Quantity</span>
                  <span>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </>
            )}

            {/* total */}
            <div className="flex justify-between items-center border-t pt-2 mb-3">
              <span className="text-sm font-semibold">Total Amount</span>
              <span className="text-lg font-bold text-red-600">
                ₹{getTotal()}
              </span>
            </div>

            {/* buttons */}
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 py-2 rounded-lg text-sm"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold"
              >
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
