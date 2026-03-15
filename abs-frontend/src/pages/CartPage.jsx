import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import API from "../api/api";
import Swal from "sweetalert2";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const loadProfileAndAddress = async () => {
    try {
      const profileRes = await API.get("/api/auth/profile");
      const addressRes = await API.get("/api/address");

      setProfile(profileRes.data);
      setAddresses(addressRes.data);
    } catch (err) {
      console.error("Failed loading profile/address", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const increaseQty = async (productId) => {
    try {
      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);
      loadCart();
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

      loadCart();
    } catch (error) {
      console.error("Decrease failed", error);
    }
  };

  const removeItem = async (productId) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: "This product will be removed from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remove",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/cart/remove?productId=${productId}`);

      loadCart();

      Swal.fire({
        icon: "success",
        title: "Item removed",
        timer: 1200,
        showConfirmButton: false,
      });
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
      setCheckoutLoading(true);
      const response = await API.post("/api/orders/checkout");

      setCartItems([]);

      const result = await Swal.fire({
        icon: "success",
        title: "Order Placed Successfully!",
        text: "Your order has been placed.",
        showCancelButton: true,
        confirmButtonText: "Proceed to Payment",
        cancelButtonText: "Close",
        confirmButtonColor: "#dc2626",
      });

      if (result.isConfirmed) {
        navigate("/payment");
      }
    } catch (error) {
      console.error("Checkout failed", error);

      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: "Please try again",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };
  const handleCheckoutClick = async () => {
    await loadProfileAndAddress();

    setShowCheckoutModal(true);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.sellingPrice * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 p-6 pb-72">
      {/* HEADER */}

      <div className="sticky top-0 z-30 bg-white shadow-sm px-4 py-3 rounded-xl flex items-center justify-between mb-6">
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
        <div className="flex flex-col items-center justify-center mt-24">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>

          <button
            onClick={() => navigate("/")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center"
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

                    <p className="text-red-600 font-bold">
                      ₹{item.sellingPrice}
                    </p>

                    {/* QTY CONTROLLER */}

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          decreaseQty(item.productId, item.quantity)
                        }
                        className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center"
                      >
                        -
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.productId)}
                        className="w-7 h-7 bg-red-500 text-white rounded flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold mt-1">
                      Subtotal ₹{item.sellingPrice * item.quantity}
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
          </div>

          {/* BOTTOM SUMMARY */}

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl px-6 py-4">
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-gray-500"
              >
                {showSummary ? <ChevronDown /> : <ChevronUp />}
              </button>
            </div>

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

            <div className="flex justify-between items-center border-t pt-2 mb-3">
              <span className="text-sm font-semibold">Total Amount</span>

              <span className="text-lg font-bold text-red-600">
                ₹{getTotal()}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 py-2 rounded-lg text-sm"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckoutClick}
                disabled={checkoutLoading}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </>
      )}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]">
            <h2 className="text-lg font-bold mb-4">Confirm Delivery Details</h2>

            {/* PROFILE */}

            {profile && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{profile.name}</p>

                <p className="text-sm text-gray-600 mt-2">Mobile</p>
                <p className="font-semibold">{profile.phone}</p>
              </div>
            )}

            {/* ADDRESS */}

            {/* ADDRESS */}

            {addresses.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600 mb-3">
                  Delivery address required to place the order
                </p>

                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    navigate("/profile?checkout=true");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Select Delivery Address
                </p>

                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  <option value="">Select Address</option>

                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.addressLine}, {addr.city}, {addr.state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (addresses.length === 0) {
                    Swal.fire({
                      icon: "warning",
                      title: "Address Required",
                      text: "Please add delivery address before checkout",
                      confirmButtonColor: "#dc2626",
                    });

                    return;
                  }

                  if (!selectedAddress) {
                    Swal.fire({
                      icon: "warning",
                      title: "Select Address",
                      text: "Please choose delivery address",
                      confirmButtonColor: "#dc2626",
                    });

                    return;
                  }

                  setShowCheckoutModal(false);

                  handleCheckout();
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
