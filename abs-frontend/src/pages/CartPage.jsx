import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  CheckCircle,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Package,
  Sparkles,
} from "lucide-react";
import API from "../api/api";

/* ═══════════════════════════════════════════════════════════════
   ABS CRACKERS — Cart Page
   Brand: Flame Orange #e8560a → Crimson #c0392b → Gold #f5a623
   Fonts: Plus Jakarta Sans (body) · Bricolage Grotesque (display)
   Mobile-first, fully responsive
═══════════════════════════════════════════════════════════════ */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .cart-root {
    --flame:        #e8560a;
    --flame-deep:   #c0392b;
    --flame-light:  #fff0e8;
    --flame-mid:    #ffd9c2;
    --gold:         #f5a623;
    --gold-light:   #fff8e8;
    --gold-deep:    #c47d0a;
    --cream:        #fffaf6;
    --warm-white:   #ffffff;
    --border:       #f0e0d0;
    --border-soft:  #fae8d8;
    --ink:          #2d1a0e;
    --ink-mid:      #7a4f35;
    --ink-faint:    #c4a088;
    --green:        #16a34a;
    --green-light:  #dcfce7;
    --red:          #dc2626;
    --red-light:    #fee2e2;

    --grad-flame:     linear-gradient(135deg, #f5a623 0%, #e8560a 50%, #c0392b 100%);
    --grad-flame-soft:linear-gradient(135deg, #fff0e8 0%, #ffd9c2 100%);
    --grad-header:    linear-gradient(135deg, #c0392b 0%, #e8560a 60%, #f5a623 100%);

    --shadow-sm:  0 1px 4px rgba(232,86,10,0.08), 0 2px 8px rgba(192,57,43,0.05);
    --shadow-md:  0 4px 16px rgba(232,86,10,0.12), 0 1px 4px rgba(192,57,43,0.06);
    --shadow-lg:  0 12px 40px rgba(192,57,43,0.18), 0 4px 12px rgba(232,86,10,0.1);

    --radius:    18px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);

    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
  }

  .cart-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Animations ── */
  @keyframes pageFade {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position:-300px 0; }
    100% { background-position: 300px 0; }
  }
  @keyframes trayIn {
    from { transform:translateY(100%); }
    to   { transform:translateY(0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes float {
    0%,100% { transform:translateY(0) rotate(-2deg); }
    50%     { transform:translateY(-10px) rotate(2deg); }
  }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn {
    from { transform:scale(0.92) translateY(14px); opacity:0; }
    to   { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes successPop {
    0%   { transform:scale(0.65) translateY(40px); opacity:0; }
    60%  { transform:scale(1.05) translateY(-6px); opacity:1; }
    100% { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes checkDraw { from { stroke-dashoffset:80; } to { stroke-dashoffset:0; } }
  @keyframes ringPulse {
    0%   { transform:scale(0.5); opacity:0; }
    60%  { transform:scale(1.18); opacity:1; }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes confettiFall {
    0%   { transform:translateY(-10px) rotate(0deg);   opacity:1; }
    100% { transform:translateY(100px) rotate(720deg); opacity:0; }
  }
  @keyframes ripple {
    0%   { transform:scale(0.8); opacity:0.6; }
    100% { transform:scale(2.2); opacity:0; }
  }
  @keyframes toastIn  {
    from { transform:translateX(120%) scale(0.9); opacity:0; }
    to   { transform:translateX(0) scale(1);      opacity:1; }
  }
  @keyframes toastOut {
    from { transform:translateX(0); opacity:1; }
    to   { transform:translateX(120%); opacity:0; }
  }
  @keyframes slideDown {
    from { transform:translateY(-18px) scale(0.96); opacity:0; }
    to   { transform:translateY(0) scale(1);        opacity:1; }
  }

  .page-fade     { animation: pageFade 0.4s ease both; }
  .float-icon    { animation: float 3.5s ease-in-out infinite; }
  .spinner       { animation: spin 0.7s linear infinite; }
  .modal-overlay { animation: fadeIn  0.2s ease; }
  .modal-box     { animation: scaleIn 0.26s cubic-bezier(0.34,1.46,0.64,1); }
  .success-modal-box { animation: successPop 0.5s cubic-bezier(0.34,1.46,0.64,1) forwards; }
  .success-ring  { animation: ringPulse 0.5s 0.15s cubic-bezier(0.34,1.46,0.64,1) both; }
  .success-check { stroke-dasharray:80; stroke-dashoffset:80; animation: checkDraw 0.45s 0.45s ease forwards; }
  .confetti-piece { position:absolute; border-radius:2px; animation: confettiFall 1.2s ease-out forwards; }
  .ripple-ring   { position:absolute; inset:-12px; border-radius:50%; border:1.5px solid rgba(245,166,35,0.4); animation: ripple 1.4s 0.5s ease-out infinite; }
  .confirm-box   { animation: slideDown 0.24s cubic-bezier(0.34,1.2,0.64,1) forwards; }
  .tray-enter    { animation: trayIn 0.32s cubic-bezier(0.4,0,0.2,1); }
  .toast-in      { animation: toastIn  0.34s cubic-bezier(0.34,1.3,0.64,1) forwards; }
  .toast-out     { animation: toastOut 0.26s ease-in forwards; }

  /* ── Stagger ── */
  .stagger > * { opacity:0; animation: pageFade 0.38s ease forwards; }
  .stagger > *:nth-child(1) { animation-delay:.05s; }
  .stagger > *:nth-child(2) { animation-delay:.10s; }
  .stagger > *:nth-child(3) { animation-delay:.15s; }
  .stagger > *:nth-child(4) { animation-delay:.20s; }
  .stagger > *:nth-child(5) { animation-delay:.25s; }
  .stagger > *:nth-child(6) { animation-delay:.30s; }

  /* ── Shimmer ── */
  .shimmer-card {
    background: linear-gradient(90deg, #fae8d8 25%, #fff0e8 50%, #fae8d8 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: var(--radius);
    height: 110px;
  }

  /* ── Cart Card ── */
  .cart-card {
    transition: box-shadow var(--transition), transform var(--transition);
    position: relative;
    background: var(--warm-white);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .cart-card:hover {
    box-shadow: 0 8px 32px rgba(232,86,10,0.14), 0 2px 8px rgba(192,57,43,0.07);
    transform: translateY(-2px);
  }

  /* ── Qty Controls ── */
  .qty-pill {
    display: inline-flex; align-items: center;
    background: var(--flame-light);
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 3px 4px;
    gap: 2px;
  }
  .qty-btn {
    width: 30px; height: 30px;
    border-radius: 50px; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    transition: all 0.18s cubic-bezier(.4,0,.2,1);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .qty-btn-minus {
    background: var(--warm-white);
    color: var(--flame-deep);
    box-shadow: 0 2px 6px rgba(192,57,43,0.1);
  }
  .qty-btn-minus:hover { background: var(--red-light); transform: scale(1.08); }
  .qty-btn-plus {
    background: var(--grad-flame);
    color: #fff;
    box-shadow: 0 3px 10px rgba(232,86,10,0.28);
  }
  .qty-btn-plus:hover { filter: brightness(1.08); transform: scale(1.08); }
  .qty-value {
    font-weight: 800; font-size: 14px; color: var(--ink);
    min-width: 26px; text-align: center; letter-spacing: -0.3px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Discount badge ── */
  .discount-badge {
    background: var(--grad-flame);
    color: #fff; font-size: 9px; font-weight: 800;
    padding: 2px 7px; border-radius: 20px;
    letter-spacing: 0.3px; text-transform: uppercase;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Checkout button ── */
  .checkout-btn {
    position: relative; overflow: hidden;
    background: var(--grad-header);
    transition: filter var(--transition), transform 0.15s ease, box-shadow var(--transition);
  }
  .checkout-btn:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(232,86,10,0.38) !important;
  }
  .checkout-btn:active:not(:disabled) { transform: translateY(0); filter: brightness(0.97); }
  .checkout-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transition: left 0.5s ease;
  }
  .checkout-btn:hover:not(:disabled)::after { left: 160%; }

  /* ── Remove button ── */
  .remove-btn {
    transition: all var(--transition);
    background: var(--flame-light);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px;
    cursor: pointer;
    color: var(--flame-deep);
    display: flex; align-items: center; justify-content: center;
  }
  .remove-btn:hover { background: var(--red-light); color: var(--red); transform: scale(1.08); border-color: rgba(220,38,38,0.25); }

  /* ── Address card ── */
  .addr-card {
    transition: all var(--transition); cursor: pointer;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    padding: 14px 16px;
    margin-bottom: 10px;
  }
  .addr-card:hover { border-color: var(--flame); background: var(--flame-light); }
  .addr-card.selected { border-color: var(--flame); background: var(--flame-light); box-shadow: 0 0 0 3px rgba(232,86,10,0.12); }

  /* ── Savings banner ── */
  .savings-bar {
    background: var(--grad-flame-soft);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Scrollbar ── */
  .addr-list::-webkit-scrollbar { width: 4px; }
  .addr-list::-webkit-scrollbar-track { background: transparent; }
  .addr-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

/* ═══════════════════ COMPONENT ═══════════════════ */
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [warnDialog, setWarnDialog] = useState(null);
  const navigate = useNavigate();

  /* ── Toast ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type, exiting: false });
    setTimeout(
      () => setToast((t) => (t ? { ...t, exiting: true } : null)),
      1700,
    );
    setTimeout(() => setToast(null), 2050);
  };

  /* ── ALL ORIGINAL LOGIC PRESERVED ── */
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (nearBottom) setShowSummary(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadCart = async () => {
    try {
      const res = await API.get("/api/cart");
      setCartItems(res.data.items);
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileAndAddress = async () => {
    try {
      const [profileRes, addressRes] = await Promise.all([
        API.get("/api/auth/profile"),
        API.get("/api/address"),
      ]);
      setProfile(profileRes.data);
      setAddresses(addressRes.data);
    } catch (e) {
      console.error("Failed loading profile/address", e);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const increaseQty = async (productId) => {
    try {
      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);
      loadCart();
    } catch (e) {
      console.error("Increase failed", e);
    }
  };

  const decreaseQty = async (productId, currentQty) => {
    try {
      if (currentQty <= 1)
        await API.delete(`/api/cart/remove?productId=${productId}`);
      else
        await API.put(
          `/api/cart/update?productId=${productId}&quantity=${currentQty - 1}`,
        );
      loadCart();
    } catch (e) {
      console.error("Decrease failed", e);
    }
  };

  const removeItem = async (productId) => {
    setConfirmDialog({
      title: "Remove item?",
      text: "This product will be removed from your cart.",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await API.delete(`/api/cart/remove?productId=${productId}`);
          loadCart();
          showToast("Item removed");
        } catch (e) {
          console.error("Remove failed", e);
        }
      },
    });
  };

  const clearCart = async () => {
    try {
      await API.delete("/api/cart/clear");
      loadCart();
    } catch (e) {
      console.error("Clear cart failed", e);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const response = await API.post("/api/orders/checkout", {
        addressId: selectedAddress,
      });
      setCartItems([]);
      setOrderSuccess({ orderId: response.data.orderId });
    } catch (e) {
      console.error("Checkout failed", e);
      setWarnDialog({
        title: "Checkout Failed",
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckoutClick = async () => {
    await loadProfileAndAddress();
    setShowCheckoutModal(true);
  };

  const getTotal = () =>
    cartItems.reduce((t, item) => t + item.sellingPrice * item.quantity, 0);

  /* ═══════════════════ LOADING ═══════════════════ */
  if (loading) {
    return (
      <>
        <style>{globalCss}</style>
        <div
          className="cart-root"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 14,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer-card"
              style={{ width: "100%", maxWidth: 480, opacity: 1 - i * 0.15 }}
            />
          ))}
          <div
            style={{
              position: "relative",
              width: 40,
              height: 40,
              marginTop: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid var(--border)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "var(--flame)",
              }}
              className="spinner"
            />
          </div>
          <p style={{ color: "var(--ink-mid)", fontSize: 13, fontWeight: 500 }}>
            Loading your cart…
          </p>
        </div>
      </>
    );
  }

  /* ═══════════════════ CONFETTI ═══════════════════ */
  const confettiPieces = [
    { color: "#f5a623", left: "12%", delay: "0s", size: 9 },
    { color: "#c0392b", left: "28%", delay: "0.07s", size: 7 },
    { color: "#f5a623", left: "48%", delay: "0.03s", size: 11 },
    { color: "#e8560a", left: "63%", delay: "0.11s", size: 7 },
    { color: "#f5a623", left: "79%", delay: "0.02s", size: 8 },
    { color: "#c0392b", left: "40%", delay: "0.15s", size: 6 },
    { color: "#f5a623", left: "71%", delay: "0.06s", size: 9 },
    { color: "#e8560a", left: "20%", delay: "0.09s", size: 6 },
  ];

  return (
    <>
      <style>{globalCss}</style>
      <div
        className="cart-root"
        style={{
          minHeight: "100vh",
          paddingBottom: cartItems.length > 0 ? 180 : 40,
        }}
      >
        {/* ── TOAST ── */}
        {toast && (
          <div
            className={toast.exiting ? "toast-out" : "toast-in"}
            style={{
              position: "fixed",
              top: 20,
              right: 16,
              zIndex: 100,
              background: toast.type === "success" ? "var(--ink)" : "#dc2626",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 8px 24px rgba(45,26,14,0.22)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {toast.type === "success" ? <CheckCircle size={14} /> : "⚠️"}
            {toast.message}
          </div>
        )}

        {/* ── HEADER ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(255,250,246,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1.5px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: "var(--flame-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--flame-deep)",
              cursor: "pointer",
              transition: "background var(--transition)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--flame-mid)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--flame-light)")
            }
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-sm)",
                background: "var(--grad-header)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(232,86,10,0.3)",
              }}
            >
              <ShoppingBag size={16} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "var(--ink)",
                letterSpacing: "-0.4px",
              }}
            >
              Your Cart
            </span>
          </div>

          {cartItems.length > 0 ? (
            <div
              style={{
                background: "var(--grad-flame)",
                color: "#fff",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                boxShadow: "0 3px 10px rgba(232,86,10,0.3)",
              }}
            >
              {cartItems.length}
            </div>
          ) : (
            <div style={{ width: 26 }} />
          )}
        </header>

        <div
          style={{
            padding: "16px 16px 0",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* ════ EMPTY STATE ════ */}
          {cartItems.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "48px auto 0",
                maxWidth: 360,
                background: "var(--warm-white)",
                borderRadius: 28,
                padding: "48px 28px",
                boxShadow: "var(--shadow-md)",
                border: "1.5px solid var(--border)",
              }}
            >
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "var(--grad-flame-soft)",
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="float-icon"
                >
                  <Package size={38} color="var(--flame)" strokeWidth={1.5} />
                </div>
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "var(--flame)" : "var(--gold)",
                      opacity: 0.35,
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${deg}deg) translateX(54px) translateY(-50%)`,
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Cart is empty
              </p>
              <p
                style={{
                  color: "var(--ink-mid)",
                  fontSize: 14,
                  marginBottom: 28,
                  textAlign: "center",
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                You haven't added anything yet.
                <br />
                Let's find something you'll love!
              </p>
              <button
                onClick={() => navigate("/")}
                className="checkout-btn"
                style={{
                  border: "none",
                  borderRadius: 50,
                  padding: "12px 32px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(232,86,10,0.32)",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Sparkles size={15} /> Browse Products
              </button>
            </div>
          ) : (
            /* ════ CART ITEMS ════ */
            <div
              className="stagger"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Savings banner */}
              {cartItems.some((i) => i.mrp > i.sellingPrice) && (
                <div className="savings-bar">
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--ink-mid)",
                      fontWeight: 600,
                    }}
                  >
                    🎉 You're saving on this order
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--flame-deep)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    ₹
                    {cartItems.reduce(
                      (s, i) =>
                        s + Math.max(0, (i.mrp - i.sellingPrice) * i.quantity),
                      0,
                    )}
                  </span>
                </div>
              )}

              {/* Customer name display in cart */}
              {profile && (
                <div
                  style={{
                    background: "var(--gold-light)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <User size={13} color="var(--gold-deep)" />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--ink-mid)",
                      fontWeight: 500,
                    }}
                  >
                    Cart for
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {profile.name}
                  </span>
                </div>
              )}

              {cartItems.map((item) => {
                const discount =
                  item.mrp > item.sellingPrice
                    ? Math.round((1 - item.sellingPrice / item.mrp) * 100)
                    : 0;
                return (
                  <div key={item.productId} className="cart-card">
                    {/* Flame left accent */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 12,
                        bottom: 12,
                        width: 3,
                        borderRadius: "0 3px 3px 0",
                        background: "var(--grad-flame)",
                      }}
                    />

                    <div
                      style={{
                        padding: "14px 14px 14px 20px",
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      {/* Product image */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1.5px solid var(--border)",
                          position: "relative",
                          background: "var(--cream)",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {discount > 0 && (
                          <div
                            style={{ position: "absolute", top: 4, left: 4 }}
                            className="discount-badge"
                          >
                            {discount}%
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--ink)",
                            lineHeight: 1.3,
                            marginBottom: 4,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.productName}
                        </p>

                        {/* Price row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 6,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: "var(--flame-deep)",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            ₹{item.sellingPrice}
                          </span>
                          {item.mrp > item.sellingPrice && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--ink-faint)",
                                textDecoration: "line-through",
                              }}
                            >
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>

                        {/* Qty + subtotal */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <div className="qty-pill">
                            <button
                              className="qty-btn qty-btn-minus"
                              onClick={() =>
                                decreaseQty(item.productId, item.quantity)
                              }
                            >
                              <Minus size={11} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn qty-btn-plus"
                              onClick={() => increaseQty(item.productId)}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--ink-mid)",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            ={" "}
                            <strong
                              style={{ color: "var(--ink)", fontWeight: 800 }}
                            >
                              ₹{item.sellingPrice * item.quantity}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.productId)}
                        style={{ alignSelf: "flex-start", flexShrink: 0 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ════ BOTTOM TRAY ════ */}
        {cartItems.length > 0 && (
          <div
            className="tray-enter"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(255,250,246,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "1.5px solid var(--border)",
              boxShadow: "0 -8px 40px rgba(45,26,14,0.10)",
              borderRadius: "20px 20px 0 0",
              padding: "12px 16px env(safe-area-inset-bottom)",
              zIndex: 40,
            }}
          >
            {/* Drag pill */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 4,
                  borderRadius: 4,
                  background: "var(--border)",
                }}
              />
            </div>

            {/* Summary rows */}
            {showSummary && (
              <div
                style={{
                  background: "var(--gold-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  marginBottom: 12,
                  border: "1.5px solid var(--border)",
                }}
              >
                {[
                  ["Products", cartItems.length],
                  ["Total Qty", cartItems.reduce((s, i) => s + i.quantity, 0)],
                  [
                    "You Save",
                    `₹${cartItems.reduce((s, i) => s + Math.max(0, (i.mrp - i.sellingPrice) * i.quantity), 0)}`,
                  ],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      color: "var(--ink-mid)",
                      padding: "4px 0",
                      borderBottom: "1px solid var(--border-soft)",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{label}</span>
                    <span
                      style={{
                        fontWeight: 800,
                        color:
                          label === "You Save"
                            ? "var(--flame-deep)"
                            : "var(--ink)",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Total row + toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--ink-faint)",
                    marginBottom: 1,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Total Amount
                </p>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-1px",
                    color: "var(--flame-deep)",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  ₹{getTotal().toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowSummary(!showSummary)}
                style={{
                  background: "var(--flame-light)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--ink-mid)",
                }}
              >
                {showSummary ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronUp size={18} />
                )}
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={clearCart}
                style={{
                  flex: 1,
                  background: "var(--flame-light)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "13px 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-mid)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all var(--transition)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--red-light)";
                  e.currentTarget.style.color = "var(--red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--flame-light)";
                  e.currentTarget.style.color = "var(--ink-mid)";
                }}
              >
                <Trash2 size={14} /> Clear
              </button>

              <button
                onClick={handleCheckoutClick}
                disabled={checkoutLoading}
                className="checkout-btn"
                style={{
                  flex: 3,
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "13px 0",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 6px 22px rgba(232,86,10,0.36)",
                  letterSpacing: "0.1px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {checkoutLoading ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                      }}
                      className="spinner"
                    />
                    <span>Processing…</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Checkout</span>
                    <span style={{ fontSize: 13, opacity: 0.7 }}>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ════ CHECKOUT MODAL ════ */}
        {showCheckoutModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(45,26,14,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 16,
            }}
          >
            <div
              className="modal-box"
              style={{
                background: "var(--warm-white)",
                borderRadius: 28,
                width: "100%",
                maxWidth: 440,
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                border: "1.5px solid var(--border)",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  background: "var(--grad-header)",
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin size={16} color="rgba(255,255,255,0.9)" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    Delivery Details
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)")
                  }
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ padding: "20px 22px" }}>
                {/* Profile card */}
                {profile && (
                  <div
                    style={{
                      background: "var(--gold-light)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px 16px",
                      marginBottom: 18,
                      border: "1.5px solid var(--border)",
                      display: "flex",
                      gap: 24,
                    }}
                  >
                    {[
                      {
                        icon: <User size={12} color="var(--flame-deep)" />,
                        label: "Customer",
                        val: profile.name,
                      },
                      {
                        icon: <Phone size={12} color="var(--flame-deep)" />,
                        label: "Mobile",
                        val: profile.phone,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginBottom: 2,
                          }}
                        >
                          {f.icon}
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--ink-faint)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              fontWeight: 700,
                            }}
                          >
                            {f.label}
                          </span>
                        </div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--ink)",
                          }}
                        >
                          {f.val}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Addresses */}
                {addresses.length === 0 ? (
                  <div
                    style={{
                      background: "var(--red-light)",
                      borderRadius: "var(--radius-md)",
                      padding: "20px",
                      marginBottom: 18,
                      border: "1px solid rgba(220,38,38,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <MapPin
                      size={28}
                      color="var(--flame-deep)"
                      style={{ marginBottom: 10, opacity: 0.7 }}
                    />
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--flame-deep)",
                        marginBottom: 14,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      A delivery address is required to place your order.
                    </p>
                    <button
                      onClick={() => {
                        setShowCheckoutModal(false);
                        navigate("/profile?checkout=true");
                      }}
                      className="checkout-btn"
                      style={{
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 24px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(232,86,10,0.28)",
                      }}
                    >
                      + Add Address
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--ink-faint)",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      Select Delivery Address
                    </p>
                    <div
                      className="addr-list"
                      style={{
                        maxHeight: 240,
                        overflowY: "auto",
                        marginBottom: 18,
                      }}
                    >
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`addr-card${selectedAddress === addr.id ? " selected" : ""}`}
                          onClick={() => setSelectedAddress(addr.id)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                alignItems: "flex-start",
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "var(--radius-sm)",
                                  background:
                                    selectedAddress === addr.id
                                      ? "var(--flame-light)"
                                      : "var(--cream)",
                                  border: "1.5px solid var(--border)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                <MapPin
                                  size={14}
                                  color={
                                    selectedAddress === addr.id
                                      ? "var(--flame)"
                                      : "var(--ink-mid)"
                                  }
                                />
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--ink)",
                                    marginBottom: 3,
                                  }}
                                >
                                  {addr.street}
                                </p>
                                <p
                                  style={{
                                    fontSize: 12,
                                    color: "var(--ink-mid)",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {addr.city}, {addr.state} — {addr.pincode}
                                </p>
                              </div>
                            </div>
                            {selectedAddress === addr.id && (
                              <CheckCircle
                                size={18}
                                color="var(--flame)"
                                style={{ flexShrink: 0 }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Order summary */}
                <div
                  style={{
                    background: "var(--flame-light)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    marginBottom: 18,
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink-mid)",
                    }}
                  >
                    Order Total
                  </span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--flame-deep)",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    ₹{getTotal().toLocaleString()}
                  </span>
                </div>

                {/* Place Order */}
                <button
                  onClick={handleCheckout}
                  disabled={!selectedAddress || checkoutLoading}
                  className="checkout-btn"
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "15px 0",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#fff",
                    cursor: !selectedAddress ? "not-allowed" : "pointer",
                    opacity: !selectedAddress ? 0.6 : 1,
                    boxShadow: selectedAddress
                      ? "0 6px 22px rgba(232,86,10,0.36)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {checkoutLoading ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.35)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                        }}
                        className="spinner"
                      />
                      <span>Placing Order…</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ CONFIRM DIALOG ════ */}
        {confirmDialog && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 80,
              background: "rgba(45,26,14,0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="confirm-box"
              style={{
                background: "var(--warm-white)",
                borderRadius: 24,
                width: "100%",
                maxWidth: 320,
                boxShadow: "var(--shadow-lg)",
                border: "1.5px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "26px 24px 0" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--red-light)",
                    border: "1px solid rgba(220,38,38,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Trash2 size={22} color="var(--red)" />
                </div>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--ink)",
                    marginBottom: 6,
                  }}
                >
                  {confirmDialog.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  {confirmDialog.text}
                </p>
              </div>
              <div
                style={{ display: "flex", gap: 10, padding: "20px 24px 24px" }}
              >
                <button
                  onClick={() => setConfirmDialog(null)}
                  style={{
                    flex: 1,
                    background: "var(--flame-light)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--ink-mid)",
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Keep it
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="checkout-btn"
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(232,86,10,0.3)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ WARN DIALOG ════ */}
        {warnDialog && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(45,26,14,0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="confirm-box"
              style={{
                background: "var(--warm-white)",
                borderRadius: 24,
                width: "100%",
                maxWidth: 320,
                boxShadow: "var(--shadow-lg)",
                border: "1.5px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "28px 24px 20px", textAlign: "center" }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background:
                      warnDialog.type === "error"
                        ? "var(--red-light)"
                        : "var(--gold-light)",
                    border: `1.5px solid ${warnDialog.type === "error" ? "rgba(220,38,38,0.2)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    fontSize: 24,
                  }}
                >
                  {warnDialog.type === "error" ? "⚠️" : "📍"}
                </div>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {warnDialog.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  {warnDialog.text}
                </p>
              </div>
              <div style={{ padding: "0 24px 24px" }}>
                <button
                  onClick={() => setWarnDialog(null)}
                  className="checkout-btn"
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "13px 0",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(232,86,10,0.28)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ ORDER SUCCESS MODAL ════ */}
        {orderSuccess && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 95,
              background: "rgba(45,26,14,0.65)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="success-modal-box"
              style={{
                background: "var(--warm-white)",
                borderRadius: 32,
                width: "100%",
                maxWidth: 370,
                boxShadow: "0 32px 80px rgba(45,26,14,0.32)",
                border: "1.5px solid var(--border)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Confetti */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 130,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {confettiPieces.map((p, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: p.left,
                      top: -14,
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      animationDelay: p.delay,
                      opacity: 0,
                      borderRadius:
                        i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "1px",
                    }}
                  />
                ))}
              </div>

              {/* Flame top bar */}
              <div style={{ height: 5, background: "var(--grad-header)" }} />

              <div style={{ padding: "34px 26px 26px", textAlign: "center" }}>
                {/* Animated check */}
                <div
                  style={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    margin: "0 auto 22px",
                  }}
                >
                  <div className="success-ring ripple-ring" />
                  <div
                    className="success-ring"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background: "var(--flame-light)",
                      border: "1.5px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 28px rgba(232,86,10,0.15)",
                      position: "absolute",
                      inset: 0,
                    }}
                  >
                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                      <circle
                        cx="23"
                        cy="23"
                        r="21"
                        stroke="var(--gold)"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      <polyline
                        className="success-check"
                        points="13,24 20,31 33,15"
                        stroke="var(--flame-deep)"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--ink)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Order Placed
                  <br />
                  Successfully!
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}
                >
                  Your order has been confirmed and is being processed.
                </p>

                {/* Order ID chip */}
                <div
                  style={{
                    background: "var(--gold-light)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "9px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  <Package size={13} color="var(--gold-deep)" />
                  <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>
                    Order ID:{" "}
                    <strong style={{ color: "var(--ink)" }}>
                      #{orderSuccess.orderId}
                    </strong>
                  </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setOrderSuccess(null)}
                    style={{
                      flex: 1,
                      background: "var(--flame-light)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "13px 0",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink-mid)",
                      cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="checkout-btn"
                    onClick={() => {
                      setOrderSuccess(null);
                      navigate(`/payment/${orderSuccess.orderId}`);
                    }}
                    style={{
                      flex: 2,
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      padding: "13px 0",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(232,86,10,0.34)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span>Proceed to Payment →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
