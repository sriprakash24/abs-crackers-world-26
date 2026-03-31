import logo from "../assets/logo1.png";
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  CreditCard,
  CheckCircle,
  Clock,
} from "lucide-react";

const invoiceCss = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

  .inv-root {
    font-family: 'Jost', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .inv-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .inv-serif { font-family: 'Cormorant Garamond', serif; }

  /* status badge */
  .inv-badge-paid    { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .inv-badge-pending { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
  .inv-badge-failed  { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

  /* table row hover - screen only */
  @media screen {
    .inv-row:hover { background: #fdf8f0 !important; }
  }

  /* print overrides */
  @media print {
    .inv-no-print { display: none !important; }
    .inv-root { width: 100% !important; }
  }
`;

function statusBadgeClass(status) {
  if (!status) return "inv-badge-pending";
  const s = status.toLowerCase();
  if (s.includes("paid") || s.includes("completed") || s.includes("success"))
    return "inv-badge-paid";
  if (s.includes("fail") || s.includes("cancel")) return "inv-badge-failed";
  return "inv-badge-pending";
}

function statusIcon(status) {
  if (!status) return <Clock size={11} />;
  const s = status.toLowerCase();
  if (s.includes("paid") || s.includes("completed") || s.includes("success"))
    return <CheckCircle size={11} />;
  if (s.includes("fail") || s.includes("cancel"))
    return <span style={{ fontSize: 11 }}>✕</span>;
  return <Clock size={11} />;
}

function InvoiceTemplate({ order }) {
  const subtotal = order.totalAmount;
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

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

            {/* Invoice label */}
            <div style={{ textAlign: "right" }}>
              <p
                className="inv-serif"
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  opacity: 0.95,
                }}
              >
                INVOICE
              </p>
              <div
                style={{
                  marginTop: 6,
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 8,
                  padding: "5px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Hash size={11} color="rgba(255,255,255,0.7)" />
                <span
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  {order.orderNumber}
                </span>
              </div>
            </div>
          </div>

          {/* ── GOLD DIVIDER ── */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, #ca8a04, #fbbf24 45%, #ca8a04 80%, rgba(202,138,4,0.1))",
              margin: "0 40px",
              borderRadius: 2,
            }}
          />

          {/* ── INFO ROW (Bill To + Order Meta) ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              gap: 0,
              padding: "28px 40px",
              alignItems: "start",
            }}
          >
            {/* Bill To */}
            <div style={{ paddingRight: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={13} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#b91c1c",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Bill To
                </span>
              </div>

              <p
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#18120a",
                  marginBottom: 3,
                }}
              >
                {order.deliveryName}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 2,
                }}
              >
                <Phone size={11} color="#78716c" />
                <p style={{ fontSize: 13, color: "#3d2f1e" }}>
                  {order.deliveryPhone}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 5,
                  marginTop: 6,
                }}
              >
                <MapPin
                  size={11}
                  color="#78716c"
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{ fontSize: 12, color: "#3d2f1e", lineHeight: 1.5 }}
                  >
                    {order.deliveryAddress}
                  </p>
                  <p style={{ fontSize: 12, color: "#3d2f1e" }}>
                    {order.deliveryCity}, {order.deliveryState}
                  </p>
                  <p style={{ fontSize: 12, color: "#78716c" }}>
                    {order.deliveryPincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Vertical separator */}
            <div
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(202,138,4,0.3), transparent)",
                width: 1,
                alignSelf: "stretch",
              }}
            />

            {/* Order Meta */}
            <div style={{ paddingLeft: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "linear-gradient(135deg, #ca8a04, #a16207)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard size={13} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#ca8a04",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Order Details
                </span>
              </div>

              {[
                {
                  icon: <Hash size={11} />,
                  label: "Order ID",
                  val: order.orderId,
                },
                {
                  icon: <Calendar size={11} />,
                  label: "Invoice Date",
                  val: new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(202,138,4,0.1)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "#78716c",
                    }}
                  >
                    <span style={{ color: "#ca8a04" }}>{row.icon}</span>
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#18120a" }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}

              {/* Payment status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: "1px solid rgba(202,138,4,0.1)",
                }}
              >
                <span style={{ fontSize: 12, color: "#78716c" }}>
                  Payment Status
                </span>
                <span
                  className={`inv-badge-${statusBadgeClass(order.paymentStatus).replace("inv-badge-", "")}`}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {statusIcon(order.paymentStatus)}
                  {order.paymentStatus}
                </span>
              </div>

              {/* Order status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                }}
              >
                <span style={{ fontSize: 12, color: "#78716c" }}>
                  Order Status
                </span>
                <span
                  className={`inv-badge-${statusBadgeClass(order.orderStatus).replace("inv-badge-", "")}`}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {statusIcon(order.orderStatus)}
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ── ITEMS TABLE ── */}
          <div style={{ padding: "0 40px 32px" }}>
            {/* table header label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#b91c1c,#7f1d1d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Package size={14} color="#fff" />
              </div>
              <span
                className="inv-serif"
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#18120a",
                  letterSpacing: "-0.3px",
                }}
              >
                Order Items
              </span>
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(202,138,4,0.1)",
                  border: "1px solid rgba(202,138,4,0.25)",
                  color: "#92400e",
                  borderRadius: 20,
                  padding: "2px 9px",
                }}
              >
                {itemCount} pcs
              </span>
            </div>

            {/* Table */}
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(202,138,4,0.18)",
              }}
            >
              {/* thead */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 90px 100px",
                  background: "linear-gradient(135deg, #18120a, #3d2f1e)",
                  padding: "11px 18px",
                }}
              >
                {["Product", "Qty", "Unit Price", "Total"].map((h, i) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.75)",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      textAlign: i === 0 ? "left" : "center",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* rows */}
              {order.items.map((item, idx) => (
                <div
                  key={item.productId}
                  className="inv-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 90px 100px",
                    padding: "12px 18px",
                    background: idx % 2 === 0 ? "#ffffff" : "#fdfaf6",
                    borderTop: "1px solid rgba(202,138,4,0.09)",
                    transition: "background 0.15s",
                  }}
                >
                  {/* product name */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(135deg,#ca8a04,#fbbf24)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#18120a",
                      }}
                    >
                      {item.productName}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#3d2f1e",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {item.quantity}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#3d2f1e",
                      textAlign: "center",
                    }}
                  >
                    ₹{item.price}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      textAlign: "center",
                      background: "linear-gradient(135deg,#b91c1c,#7f1d1d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ₹{item.totalPrice}
                  </div>
                </div>
              ))}

              {/* table footer total row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 90px 100px",
                  padding: "12px 18px",
                  background: "linear-gradient(135deg, #fdf8f0, #fef9ee)",
                  borderTop: "2px solid rgba(202,138,4,0.25)",
                }}
              >
                <div
                  style={{
                    gridColumn: "1/4",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#78716c" }}>
                    Free Shipping
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      background: "#dcfce7",
                      color: "#166534",
                      border: "1px solid #bbf7d0",
                      borderRadius: 20,
                      padding: "1px 8px",
                    }}
                  >
                    ✓ FREE
                  </span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 10, color: "#78716c" }}>₹0</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div
            style={{
              margin: "0 40px",
              borderTop: "1px solid rgba(202,138,4,0.18)",
              padding: "18px 0 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {/* left: thank you */}
            <div>
              <p
                className="inv-serif"
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#b91c1c",
                  marginBottom: 4,
                }}
              >
                Thank you for your order!
              </p>
              <p style={{ fontSize: 12, color: "#78716c", lineHeight: 1.6 }}>
                For queries, reach us at{" "}
                <span style={{ color: "#b91c1c", fontWeight: 600 }}>
                  support@abscrackers.com
                </span>
              </p>
              <p style={{ fontSize: 11, color: "#a8a29e", marginTop: 4 }}>
                ABS Crackers World · Sivakasi, Tamil Nadu · Licensed Fireworks
                Retailer
              </p>
            </div>

            {/* right: watermark stamp */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "2px solid rgba(185,28,28,0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.35,
                transform: "rotate(-12deg)",
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  color: "#b91c1c",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                ABS
              </span>
              <span
                style={{
                  fontSize: 7,
                  color: "#b91c1c",
                  letterSpacing: "0.5px",
                }}
              >
                CRACKERS
              </span>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "#b91c1c",
                  margin: "2px 0",
                }}
              />
              <span
                style={{
                  fontSize: 6,
                  color: "#b91c1c",
                  letterSpacing: "0.3px",
                }}
              >
                SIVAKASI
              </span>
            </div>
          </div>

          {/* bottom crimson bar */}
          <div
            style={{
              height: 6,
              background:
                "linear-gradient(90deg, #7f1d1d, #b91c1c, #ca8a04, #fbbf24, #ca8a04, #b91c1c, #7f1d1d)",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default InvoiceTemplate;
