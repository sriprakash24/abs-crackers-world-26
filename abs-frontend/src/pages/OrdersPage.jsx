import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import InvoiceTemplate from "../pages/InvoiceTemplate";
import { generateInvoice } from "../utils/generateInvoice";

import {
  Package,
  CreditCard,
  FileText,
  Eye,
  ArrowLeft,
  Truck,
  CheckCircle,
  X,
  ShoppingBag,
  Sparkles,
  Shield,
  Clock,
  Search,
  Filter,
  User,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ABS CRACKERS — Orders Page
   Brand: Flame Orange #e8560a → Crimson #c0392b → Gold #f5a623
   Fonts: Plus Jakarta Sans (body) · Bricolage Grotesque (display)
   Mobile-first, fully responsive
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .ord-root {
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
    --blue:         #2563eb;
    --blue-light:   #dbeafe;
    --purple:       #7c3aed;
    --purple-light: #f3e8ff;

    --grad-flame:      linear-gradient(135deg, #f5a623 0%, #e8560a 50%, #c0392b 100%);
    --grad-flame-soft: linear-gradient(135deg, #fff0e8 0%, #ffd9c2 100%);
    --grad-header:     linear-gradient(135deg, #c0392b 0%, #e8560a 60%, #f5a623 100%);

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
    min-height: 100vh;
  }

  .ord-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Animations ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn  { from { transform:scale(0.93) translateY(16px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
  @keyframes stripFade   { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }

  .ord-card        { animation: fadeUp 0.4s ease both; }
  .float-icon      { animation: float 3.2s ease-in-out infinite; }
  .modal-overlay   { animation: fadeIn  0.2s ease; }
  .modal-box       { animation: scaleIn 0.26s cubic-bezier(0.34,1.56,0.64,1); }
  .status-pulse    { animation: statusPulse 2.2s ease-in-out infinite; }
  .strip-item      { animation: stripFade 0.4s ease both; }

  /* ── Order Card ── */
  .order-card {
    background: var(--warm-white);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: box-shadow var(--transition), transform var(--transition);
  }
  .order-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(232,86,10,0.14), 0 2px 8px rgba(192,57,43,0.07);
  }

  /* ── Action Buttons ── */
  .act-btn {
    display: flex; align-items: center; gap: 6px;
    border: none; cursor: pointer;
    border-radius: var(--radius-sm); padding: 9px 13px;
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all var(--transition);
    white-space: nowrap;
  }
  .act-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .act-btn:active { transform: translateY(0); }

  /* ── Search Input ── */
  .search-input {
    width: 100%; border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 11px 16px 11px 42px;
    font-size: 14px; font-weight: 500; color: var(--ink);
    background: var(--warm-white); font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all var(--transition); outline: none;
  }
  .search-input::placeholder { color: var(--ink-faint); }
  .search-input:focus {
    border-color: var(--flame);
    box-shadow: 0 0 0 3px rgba(232,86,10,0.1);
  }

  /* ── Filter Pill ── */
  .filter-pill {
    display: flex; align-items: center; gap: 5px;
    border: 1.5px solid var(--border); border-radius: 50px;
    padding: 7px 14px; font-size: 12px; font-weight: 700;
    color: var(--ink-mid); background: var(--warm-white);
    cursor: pointer; transition: all var(--transition);
    font-family: 'Plus Jakarta Sans', sans-serif;
    white-space: nowrap;
  }
  .filter-pill:hover { border-color: var(--flame); color: var(--flame); background: var(--flame-light); }
  .filter-pill.active { border-color: var(--flame); color: var(--flame); background: var(--flame-light); }

  /* ── Stat box ── */
  .stat-box {
    background: var(--cream); border-radius: var(--radius-md);
    padding: 10px 8px; text-align: center;
    border: 1.5px solid var(--border);
  }

  /* ── Item list scrollbar ── */
  .item-list::-webkit-scrollbar { width: 4px; }
  .item-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* ── Bottom bar ── */
  .bottom-bar { transition: box-shadow var(--transition); }
  .bottom-bar:hover { box-shadow: 0 -6px 32px rgba(232,86,10,0.12) !important; }

  /* ── Spinner ── */
  .spinner { animation: spin 0.75s linear infinite; }

  /* ── Filter dropdown ── */
  .filter-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: var(--warm-white); border-radius: var(--radius-md);
    border: 1.5px solid var(--border); box-shadow: var(--shadow-md);
    min-width: 200px; z-index: 20; overflow: hidden;
    animation: scaleIn 0.2s cubic-bezier(0.34,1.2,0.64,1);
  }
  .filter-item {
    padding: 10px 14px; font-size: 13px; font-weight: 600;
    color: var(--ink-mid); cursor: pointer;
    transition: all var(--transition);
    border-bottom: 1px solid var(--border-soft);
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; gap: 8px;
  }
  .filter-item:last-child { border-bottom: none; }
  .filter-item:hover { background: var(--flame-light); color: var(--flame); }
  .filter-item.selected { background: var(--flame-light); color: var(--flame); }
`;

/* ─── Status configs (brand-aligned) ─── */
const ORDER_STATUS = {
  PLACED: { bg: "#dbeafe", color: "#2563eb", dot: "#3b82f6", label: "Placed" },
  PROCESSING: {
    bg: "#fff0e8",
    color: "#e8560a",
    dot: "#e8560a",
    label: "Processing",
    pulse: true,
  },
  SHIPPED: {
    bg: "#f3e8ff",
    color: "#7c3aed",
    dot: "#8b5cf6",
    label: "Shipped",
    pulse: true,
  },
  DELIVERED: {
    bg: "#dcfce7",
    color: "#16a34a",
    dot: "#22c55e",
    label: "Delivered",
  },
};

const PAYMENT_STATUS = {
  PENDING: { bg: "#fff0e8", color: "#e8560a", label: "Pending" },
  SUBMITTED: { bg: "#dbeafe", color: "#2563eb", label: "Submitted" },
  VERIFIED: { bg: "#dcfce7", color: "#16a34a", label: "Verified" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
};

const FEATURES = [
  {
    icon: <Truck size={20} color="#f5a623" />,
    title: "Timely Delivery",
    sub: "On-Time Delivery Guaranteed",
  },
  {
    icon: <Package size={20} color="#f5a623" />,
    title: "Quality Assured",
    sub: "Made from fine quality raw materials",
  },
  {
    icon: <Shield size={20} color="#f5a623" />,
    title: "Safety Tested",
    sub: "All our crackers are quality & safety checked",
  },
  {
    icon: <Clock size={20} color="#f5a623" />,
    title: "Min. Order ₹3,000",
    sub: "Assured Delivery Before Diwali",
  },
];

/* ═══════════════════ COMPONENT ═══════════════════ */
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ── Close filter dropdown on outside click ── */
  useEffect(() => {
    if (!showFilters) return;
    const close = () => setShowFilters(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showFilters]);

  const oStatus = (s) =>
    ORDER_STATUS[s] || {
      bg: "#f3f4f6",
      color: "#4b5563",
      dot: "#9ca3af",
      label: s,
    };
  const pStatus = (s) =>
    PAYMENT_STATUS[s] || { bg: "#f3f4f6", color: "#4b5563", label: s };

  /* ── Filtered + searched orders ── */
  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        String(o.orderNumber).toLowerCase().includes(q) ||
        (o.customerName || "").toLowerCase().includes(q);
      const matchOrderStatus =
        filterStatus === "ALL" || o.orderStatus === filterStatus;
      const matchPayStatus =
        filterPayment === "ALL" || o.paymentStatus === filterPayment;
      return matchSearch && matchOrderStatus && matchPayStatus;
    });
  }, [orders, searchQuery, filterStatus, filterPayment]);

  const hasActiveFilters = filterStatus !== "ALL" || filterPayment !== "ALL";

  return (
    <>
      <style>{css}</style>
      <div className="ord-root" style={{ paddingBottom: 100 }}>
        {/* ── HEADER ── */}
        <div
          style={{
            background: "var(--grad-header)",
            padding: "24px 16px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative emoji */}
          <div
            style={{
              position: "absolute",
              right: 14,
              top: 10,
              fontSize: 52,
              opacity: 0.15,
              transform: "rotate(15deg)",
            }}
          >
            📦
          </div>
          {/* Scallop bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 20,
              background: "var(--cream)",
              borderRadius: "20px 20px 0 0",
            }}
          />

          <button
            onClick={() => navigate("/", { replace: true })}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: 14,
              transition: "background var(--transition)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }
          >
            <ArrowLeft size={16} />
          </button>

          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: 3,
            }}
          >
            ABS Crackers
          </p>
          <p
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.4px",
              lineHeight: 1.1,
            }}
          >
            My Orders
          </p>
          {orders.length > 0 && (
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {orders.length} order{orders.length > 1 ? "s" : ""} placed
            </p>
          )}
        </div>

        {/* ── SEARCH + FILTER BAR ── */}
        <div
          style={{ padding: "16px 16px 0", maxWidth: 680, margin: "0 auto" }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={15}
                color="var(--ink-faint)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order no. or customer name…"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink-faint)",
                    display: "flex",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter button */}
            <div style={{ position: "relative" }}>
              <button
                className={`filter-pill${hasActiveFilters ? " active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilters(!showFilters);
                }}
              >
                <SlidersHorizontal size={13} />
                Filter
                {hasActiveFilters && (
                  <span
                    style={{
                      background: "var(--flame)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {(filterStatus !== "ALL" ? 1 : 0) +
                      (filterPayment !== "ALL" ? 1 : 0)}
                  </span>
                )}
              </button>

              {showFilters && (
                <div
                  className="filter-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      padding: "10px 14px 6px",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "var(--ink-faint)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Order Status
                  </div>
                  {["ALL", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].map(
                    (s) => (
                      <div
                        key={s}
                        className={`filter-item${filterStatus === s ? " selected" : ""}`}
                        onClick={() => setFilterStatus(s)}
                      >
                        {filterStatus === s && <CheckCircle size={13} />}
                        {s === "ALL"
                          ? "All Statuses"
                          : s.charAt(0) + s.slice(1).toLowerCase()}
                      </div>
                    ),
                  )}
                  <div
                    style={{
                      padding: "10px 14px 6px",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "var(--ink-faint)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderTop: "1.5px solid var(--border-soft)",
                    }}
                  >
                    Payment Status
                  </div>
                  {["ALL", "PENDING", "SUBMITTED", "VERIFIED", "REJECTED"].map(
                    (s) => (
                      <div
                        key={s}
                        className={`filter-item${filterPayment === s ? " selected" : ""}`}
                        onClick={() => setFilterPayment(s)}
                      >
                        {filterPayment === s && <CheckCircle size={13} />}
                        {s === "ALL"
                          ? "All Payments"
                          : s.charAt(0) + s.slice(1).toLowerCase()}
                      </div>
                    ),
                  )}
                  {hasActiveFilters && (
                    <div
                      className="filter-item"
                      style={{
                        borderTop: "1.5px solid var(--border-soft)",
                        color: "var(--red)",
                      }}
                      onClick={() => {
                        setFilterStatus("ALL");
                        setFilterPayment("ALL");
                        setShowFilters(false);
                      }}
                    >
                      <X size={13} /> Clear Filters
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {filterStatus !== "ALL" && (
                <span
                  style={{
                    background: "var(--flame-light)",
                    color: "var(--flame-deep)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 50,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()}
                  <button
                    onClick={() => setFilterStatus("ALL")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "inherit",
                      display: "flex",
                    }}
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
              {filterPayment !== "ALL" && (
                <span
                  style={{
                    background: "var(--gold-light)",
                    color: "var(--gold-deep)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 50,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {filterPayment.charAt(0) +
                    filterPayment.slice(1).toLowerCase()}
                  <button
                    onClick={() => setFilterPayment("ALL")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "inherit",
                      display: "flex",
                    }}
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div
          style={{ padding: "16px 16px 0", maxWidth: 680, margin: "0 auto" }}
        >
          {/* ── LOADING ── */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 0",
                gap: 14,
              }}
            >
              <div style={{ position: "relative", width: 40, height: 40 }}>
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
              <p
                style={{
                  color: "var(--ink-mid)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Loading your orders…
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 48,
                background: "var(--warm-white)",
                borderRadius: 28,
                padding: "48px 28px",
                boxShadow: "var(--shadow-md)",
                border: "1.5px solid var(--border)",
                maxWidth: 380,
                margin: "48px auto 0",
              }}
            >
              <div
                className="float-icon"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--grad-flame-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 22,
                  border: "1.5px solid var(--border)",
                }}
              >
                <Package size={34} color="var(--flame)" />
              </div>
              <p
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                {searchQuery || hasActiveFilters
                  ? "No matches found"
                  : "No orders yet"}
              </p>
              <p
                style={{
                  color: "var(--ink-mid)",
                  fontSize: 14,
                  marginBottom: 24,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                {searchQuery || hasActiveFilters
                  ? "Try adjusting your search or filters."
                  : "You haven't placed any orders. Start shopping to see them here."}
              </p>
              {searchQuery || hasActiveFilters ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("ALL");
                    setFilterPayment("ALL");
                  }}
                  style={{
                    background: "var(--flame-light)",
                    border: "1.5px solid var(--border)",
                    color: "var(--flame-deep)",
                    borderRadius: 50,
                    padding: "10px 28px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear Search & Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  style={{
                    background: "var(--grad-header)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 50,
                    padding: "12px 32px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(232,86,10,0.32)",
                  }}
                >
                  Browse Products
                </button>
              )}
            </div>
          ) : (
            /* ── ORDER LIST ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Result count */}
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-faint)",
                  fontWeight: 600,
                }}
              >
                {filteredOrders.length} order
                {filteredOrders.length > 1 ? "s" : ""}
                {searchQuery ? ` matching "${searchQuery}"` : ""}
              </p>

              {filteredOrders.map((order, idx) => {
                const os = oStatus(order.orderStatus);
                const ps = pStatus(order.paymentStatus);
                return (
                  <div
                    key={order.orderId}
                    className="order-card ord-card"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Flame top accent */}
                    <div
                      style={{ height: 3, background: "var(--grad-header)" }}
                    />

                    <div style={{ padding: "16px 16px" }}>
                      {/* Row 1: Order number + customer name + status */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 14,
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "var(--radius-sm)",
                              background: "var(--flame-light)",
                              border: "1.5px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Package size={18} color="var(--flame)" />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 10,
                                color: "var(--ink-faint)",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: 2,
                              }}
                            >
                              Order Number
                            </p>
                            <p
                              style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: 16,
                                fontWeight: 800,
                                color: "var(--ink)",
                              }}
                            >
                              #{order.orderNumber}
                            </p>
                            {order.customerName && (
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "var(--ink-mid)",
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  marginTop: 2,
                                }}
                              >
                                <User size={10} /> {order.customerName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order status pill */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: os.bg,
                            borderRadius: 50,
                            padding: "5px 11px",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            className={os.pulse ? "status-pulse" : ""}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: os.dot,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: os.color,
                            }}
                          >
                            {os.label}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Stat boxes */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 8,
                          marginBottom: 14,
                        }}
                      >
                        <div className="stat-box">
                          <p
                            style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: "var(--ink)",
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                            }}
                          >
                            {order.items?.length || 0}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--ink-faint)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              marginTop: 2,
                            }}
                          >
                            Items
                          </p>
                        </div>
                        <div className="stat-box">
                          <p
                            style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: "var(--flame-deep)",
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                            }}
                          >
                            ₹{order.totalAmount?.toLocaleString()}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--ink-faint)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              marginTop: 2,
                            }}
                          >
                            Total
                          </p>
                        </div>
                        <div className="stat-box" style={{ background: ps.bg }}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: ps.color,
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                            }}
                          >
                            {ps.label}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--ink-faint)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              marginTop: 2,
                            }}
                          >
                            Payment
                          </p>
                        </div>
                      </div>

                      {/* Row 3: Action buttons */}
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {/* View Items */}
                        <button
                          className="act-btn"
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            background: "var(--flame-light)",
                            color: "var(--flame-deep)",
                            border: "1.5px solid var(--border)",
                          }}
                        >
                          <Eye size={12} /> Items
                        </button>

                        {/* Pay Now */}
                        {order.paymentStatus === "PENDING" && (
                          <button
                            className="act-btn"
                            onClick={() =>
                              navigate(`/payment/${order.orderId}`)
                            }
                            style={{
                              background: "var(--grad-header)",
                              color: "#fff",
                              boxShadow: "0 3px 12px rgba(232,86,10,0.32)",
                            }}
                          >
                            <CreditCard size={12} /> Pay Now
                          </button>
                        )}

                        {/* Invoice */}
                        <button
                          className="act-btn"
                          onClick={() => {
                            setSelectedOrder(order);
                            setTimeout(
                              () => generateInvoice(order.orderNumber),
                              300,
                            );
                          }}
                          style={{
                            background: "var(--blue-light)",
                            color: "var(--blue)",
                          }}
                        >
                          <FileText size={12} /> Invoice
                        </button>

                        {/* Track */}
                        {(order.orderStatus === "SHIPPED" ||
                          order.orderStatus === "DELIVERED") && (
                          <button
                            className="act-btn"
                            onClick={() =>
                              navigate(`/track-order/${order.orderId}`)
                            }
                            style={{
                              background: "var(--purple-light)",
                              color: "var(--purple)",
                            }}
                          >
                            <Truck size={12} /> Track
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FEATURE STRIP ── */}
          {!loading && orders.length > 0 && (
            <div
              style={{
                marginTop: 40,
                borderRadius: 28,
                overflow: "hidden",
                background: "linear-gradient(145deg, #2d1a0e 0%, #4a2a14 100%)",
                border: "1.5px solid rgba(245,166,35,0.2)",
              }}
            >
              <div
                style={{
                  padding: "6px 0",
                  textAlign: "center",
                  background: "var(--grad-flame)",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                  }}
                >
                  Why ABS Crackers
                </span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {FEATURES.map((f, i) => (
                  <div
                    key={i}
                    className="strip-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 20px",
                      borderBottom:
                        i < FEATURES.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "var(--radius-sm)",
                        flexShrink: 0,
                        background: "rgba(245,166,35,0.1)",
                        border: "1px solid rgba(245,166,35,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: 2,
                        }}
                      >
                        {f.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.45)",
                        }}
                      >
                        {f.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ITEMS MODAL ── */}
        {selectedOrder && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(45,26,14,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                border: "1.5px solid var(--border)",
                overflow: "hidden",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  background: "var(--grad-header)",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    Order Items
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.65)",
                      marginTop: 2,
                    }}
                  >
                    #{selectedOrder.orderNumber}
                    {selectedOrder.customerName
                      ? ` · ${selectedOrder.customerName}`
                      : ""}{" "}
                    · {selectedOrder.items.length} item
                    {selectedOrder.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
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
                >
                  <X size={15} />
                </button>
              </div>

              {/* Items list */}
              <div
                className="item-list"
                style={{
                  maxHeight: 320,
                  overflowY: "auto",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      background: "var(--cream)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 14px",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "var(--radius-sm)",
                        flexShrink: 0,
                        overflow: "hidden",
                        border: "1.5px solid var(--border)",
                        background: "#fff",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        alt={item.productName}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--ink)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: 3,
                        }}
                      >
                        {item.productName}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--ink-mid)",
                          fontWeight: 600,
                        }}
                      >
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--flame-deep)",
                        flexShrink: 0,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      ₹{item.totalPrice}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderTop: "1.5px solid var(--border)",
                  background: "var(--gold-light)",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--ink-mid)",
                  }}
                >
                  Total Amount
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--flame-deep)",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>

              <div style={{ padding: "12px 16px 16px" }}>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    width: "100%",
                    background: "var(--grad-header)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "13px 0",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(232,86,10,0.3)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── OFFSCREEN INVOICE ── */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          {selectedOrder && <InvoiceTemplate order={selectedOrder} />}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="bottom-bar"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: "rgba(255,250,246,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1.5px solid var(--border)",
            boxShadow: "0 -4px 24px rgba(45,26,14,0.08)",
          }}
        >
          <div
            onClick={() => navigate("/", { replace: true })}
            style={{
              maxWidth: 680,
              margin: "0 auto",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--ink-faint)",
                  marginBottom: 2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Continue shopping
              </p>
              <p
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                Back to Home
              </p>
            </div>
            <div
              style={{
                background: "var(--grad-header)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(232,86,10,0.3)",
              }}
            >
              <ArrowLeft size={17} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrdersPage;
