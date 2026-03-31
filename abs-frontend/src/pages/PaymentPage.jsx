import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import logo from "../assets/logo1.png";
import qr from "../assets/upi-qr.png";
import {
  CreditCard,
  QrCode,
  Landmark,
  Upload,
  Hash,
  ShieldCheck,
  CheckCircle,
  X,
  Copy,
  Check,
  Package,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ABS CRACKERS — Payment Page
   Brand: Flame Orange #e8560a → Crimson #c0392b → Gold #f5a623
   Fonts: Plus Jakarta Sans (body) · Bricolage Grotesque (display)
   Mobile-first, dark card on warm cream background
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .pay-root {
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
    --card-bg:      #1e1008;
    --card-mid:     #2d1a0e;
    --card-border:  rgba(245,166,35,0.18);
    --card-text:    rgba(255,255,255,0.85);
    --card-faint:   rgba(255,255,255,0.4);

    --grad-flame:     linear-gradient(135deg, #f5a623 0%, #e8560a 50%, #c0392b 100%);
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
    min-height: 100vh;
  }

  .pay-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Animations ── */
  @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { transform:scale(0.92) translateY(14px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes checkDraw { from { stroke-dashoffset:80; } to { stroke-dashoffset:0; } }
  @keyframes ringPop { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes confettiFall {
    0%   { transform:translateY(-8px) rotate(0deg);  opacity:1; }
    100% { transform:translateY(90px) rotate(720deg); opacity:0; }
  }
  @keyframes toastIn  { from { transform:translateX(110%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes toastOut { from { opacity:1; } to { transform:translateX(110%); opacity:0; } }
  @keyframes qrGlow  {
    0%,100% { box-shadow:0 0 0 0 rgba(245,166,35,0); }
    50%     { box-shadow:0 0 0 8px rgba(245,166,35,0.18); }
  }

  .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.45s 0.15s ease both; }
  .fade-up-3 { animation: fadeUp 0.45s 0.25s ease both; }
  .fade-up-4 { animation: fadeUp 0.45s 0.35s ease both; }
  .fade-up-5 { animation: fadeUp 0.45s 0.45s ease both; }
  .fade-up-6 { animation: fadeUp 0.45s 0.55s ease both; }

  .modal-overlay { animation: fadeIn  0.2s ease; }
  .modal-box     { animation: scaleIn 0.26s cubic-bezier(0.34,1.56,0.64,1); }
  .check-ring    { animation: ringPop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both; }
  .check-svg     { stroke-dasharray:80; stroke-dashoffset:80; animation: checkDraw 0.4s 0.45s ease forwards; }
  .confetti-p    { position:absolute; border-radius:2px; animation: confettiFall 1.1s ease-out forwards; opacity:0; }
  .spinner       { animation: spin 0.75s linear infinite; }
  .toast-in      { animation: toastIn  0.3s cubic-bezier(0.34,1.2,0.64,1) forwards; }
  .toast-out     { animation: toastOut 0.25s ease-in forwards; }
  .qr-img        { animation: qrGlow 2.8s ease-in-out infinite; }

  /* ── Tab Buttons ── */
  .pay-tab {
    flex: 1; border-radius: var(--radius-sm);
    padding: 11px 0; font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    cursor: pointer; border: none; background: transparent;
    color: var(--card-faint); transition: all var(--transition);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .pay-tab.active {
    background: var(--grad-flame) !important;
    color: #fff !important;
    box-shadow: 0 4px 14px rgba(232,86,10,0.38);
  }

  /* ── Input ── */
  .pay-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1.5px solid var(--card-border);
    border-radius: var(--radius-md); padding: 13px 16px;
    font-size: 15px; font-weight: 600; color: var(--card-text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all var(--transition); outline: none;
  }
  .pay-input::placeholder { color: var(--card-faint); font-weight: 400; }
  .pay-input:focus {
    border-color: var(--flame);
    box-shadow: 0 0 0 3px rgba(232,86,10,0.2);
  }

  /* ── Upload zone ── */
  .upload-zone { transition: all var(--transition); cursor: pointer; }
  .upload-zone:hover { border-color: var(--flame) !important; background: rgba(232,86,10,0.06) !important; }
  .upload-zone.has-file { border-color: var(--gold) !important; background: rgba(245,166,35,0.05) !important; }

  /* ── Submit button ── */
  .submit-btn {
    position: relative; overflow: hidden;
    background: var(--grad-flame);
    transition: transform var(--transition), box-shadow var(--transition);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,86,10,0.42) !important; }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,240,220,0.18), transparent);
    opacity: 0; transition: opacity 0.28s;
  }
  .submit-btn:hover::before { opacity: 1; }

  /* ── Copy button ── */
  .copy-btn { transition: all var(--transition); }
  .copy-btn:hover { background: rgba(245,166,35,0.18) !important; }

  /* ── Bank row ── */
  .bank-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .bank-row:last-child { border-bottom: none; padding-bottom: 0; }

  /* ── Step dot ── */
  .step-dot { transition: all var(--transition); }

  /* ── Scrollbar ── */
  .pay-root ::-webkit-scrollbar { width: 4px; }
  .pay-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

/* ── Confetti pieces ── */
const CONFETTI = [
  { color: "#f5a623", left: "12%", delay: "0s", size: 9 },
  { color: "#c0392b", left: "28%", delay: "0.07s", size: 7 },
  { color: "#f5a623", left: "48%", delay: "0.03s", size: 10 },
  { color: "#e8560a", left: "63%", delay: "0.11s", size: 7 },
  { color: "#f5a623", left: "78%", delay: "0.02s", size: 8 },
  { color: "#c0392b", left: "40%", delay: "0.15s", size: 6 },
  { color: "#f5a623", left: "70%", delay: "0.05s", size: 9 },
];

/* ═══════════════════ COMPONENT ═══════════════════ */
function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [reference, setReference] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upi");
  const [copied, setCopied] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [warnModal, setWarnModal] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Helpers (all original logic preserved) ── */
  const showToast = (msg) => {
    setToast({ msg, exiting: false });
    setTimeout(
      () => setToast((t) => (t ? { ...t, exiting: true } : null)),
      1700,
    );
    setTimeout(() => setToast(null), 2050);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    showToast("Copied!");
    setTimeout(() => setCopied(""), 1800);
  };

  const handleFileChange = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "image/png" || f.type === "image/jpeg"))
      handleFileChange(f);
  };

  const submitPayment = async () => {
    if (!reference.trim()) {
      setWarnModal({
        title: "Reference Required",
        text: "Please enter your UTR / payment reference number before submitting.",
      });
      return;
    }
    if (!file) {
      setWarnModal({
        title: "Screenshot Required",
        text: "Please upload your payment screenshot so we can verify your transaction.",
      });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reference", reference);
      await API.post(`/api/orders/${orderId}/submit-payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessModal(true);
    } catch (error) {
      console.error(error);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── Render ─────────────── */
  return (
    <>
      <style>{css}</style>
      <div className="pay-root" style={{ background: "var(--cream)" }}>
        {/* ── TOAST ── */}
        {toast && (
          <div
            className={toast.exiting ? "toast-out" : "toast-in"}
            style={{
              position: "fixed",
              top: 20,
              right: 16,
              zIndex: 100,
              background: "var(--ink)",
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
            <Check size={14} color="var(--gold)" /> {toast.msg}
          </div>
        )}

        {/* ── HEADER ── */}
        <div
          style={{
            background: "var(--grad-header)",
            padding: "20px 16px 28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
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
            💳
          </div>
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
            onClick={() => navigate(-1)}
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
            Complete Payment
          </p>

          {/* Order badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 50,
              padding: "4px 12px",
              marginTop: 8,
            }}
          >
            <Package size={12} color="rgba(255,255,255,0.9)" />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 700,
              }}
            >
              Order #{orderId}
            </span>
          </div>
        </div>

        {/* ── CARD CONTAINER ── */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "16px 16px 100px",
          }}
        >
          {/* Dark payment card */}
          <div
            className="fade-up-2"
            style={{
              background:
                "linear-gradient(145deg, var(--card-bg) 0%, var(--card-mid) 100%)",
              borderRadius: 28,
              overflow: "hidden",
              border: "1.5px solid var(--card-border)",
              boxShadow: "0 16px 64px rgba(45,26,14,0.32)",
              position: "relative",
            }}
          >
            {/* Top flame line */}
            <div style={{ height: 3, background: "var(--grad-flame)" }} />

            <div style={{ padding: "22px 20px" }}>
              {/* ── Method Tabs ── */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-md)",
                  padding: 4,
                  display: "flex",
                  gap: 4,
                  marginBottom: 20,
                  border: "1px solid var(--card-border)",
                }}
              >
                {[
                  { id: "upi", icon: <QrCode size={15} />, label: "UPI / QR" },
                  {
                    id: "bank",
                    icon: <Landmark size={15} />,
                    label: "Bank Transfer",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`pay-tab${activeTab === tab.id ? " active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* ── UPI Panel ── */}
              {activeTab === "upi" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px 18px",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--gold)",
                      textAlign: "center",
                      marginBottom: 18,
                    }}
                  >
                    Scan to Pay
                  </p>

                  {/* QR */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      className="qr-img"
                      style={{
                        background: "#fff",
                        borderRadius: "var(--radius-md)",
                        padding: 10,
                        border: "2px solid rgba(245,166,35,0.35)",
                      }}
                    >
                      <img
                        src={qr}
                        alt="UPI QR"
                        style={{ width: 140, height: 140, display: "block" }}
                      />
                    </div>
                  </div>

                  {/* UPI ID row */}
                  <div
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "11px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--card-faint)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        UPI ID
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "var(--card-text)",
                          letterSpacing: "0.2px",
                        }}
                      >
                        abscrackers@upi
                      </p>
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() => copyText("abscrackers@upi", "upi")}
                      style={{
                        background: "rgba(245,166,35,0.1)",
                        border: "1px solid rgba(245,166,35,0.25)",
                        borderRadius: "var(--radius-sm)",
                        width: 34,
                        height: 34,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gold)",
                      }}
                    >
                      {copied === "upi" ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Bank Panel ── */}
              {activeTab === "bank" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "18px 18px",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--gold)",
                      marginBottom: 16,
                    }}
                  >
                    Bank Account Details
                  </p>
                  {[
                    {
                      label: "Account Name",
                      value: "ABS Crackers",
                      key: "name",
                    },
                    { label: "Account No", value: "1234567890", key: "accno" },
                    { label: "IFSC Code", value: "HDFC0001234", key: "ifsc" },
                    { label: "Phone / UPI", value: "9876543210", key: "phone" },
                  ].map((row) => (
                    <div key={row.key} className="bank-row">
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "var(--card-faint)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontWeight: 700,
                            marginBottom: 3,
                          }}
                        >
                          {row.label}
                        </p>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: "var(--card-text)",
                            letterSpacing: "0.2px",
                          }}
                        >
                          {row.value}
                        </p>
                      </div>
                      <button
                        className="copy-btn"
                        onClick={() => copyText(row.value, row.key)}
                        style={{
                          background: "rgba(245,166,35,0.1)",
                          border: "1px solid rgba(245,166,35,0.22)",
                          borderRadius: "var(--radius-sm)",
                          width: 34,
                          height: 34,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--gold)",
                        }}
                      >
                        {copied === row.key ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Reference Input ── */}
              <div className="fade-up-4" style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--card-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 8,
                  }}
                >
                  <Hash size={12} color="var(--gold)" /> Payment Reference / UTR
                </label>
                <input
                  className="pay-input"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter UTR / reference number"
                />
              </div>

              {/* ── Screenshot Upload ── */}
              <div className="fade-up-5" style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--card-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 8,
                  }}
                >
                  <Upload size={12} color="var(--gold)" /> Payment Screenshot
                </label>

                <div
                  className={`upload-zone${file ? " has-file" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    background: dragOver
                      ? "rgba(245,166,35,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: `2px dashed ${file ? "rgba(245,166,35,0.5)" : dragOver ? "var(--gold)" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: "var(--radius-md)",
                    padding: "20px 18px",
                    textAlign: "center",
                    transition: "all var(--transition)",
                  }}
                >
                  {preview ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={preview}
                        alt="preview"
                        style={{
                          maxHeight: 130,
                          maxWidth: "100%",
                          borderRadius: "var(--radius-sm)",
                          objectFit: "cover",
                          border: "1px solid rgba(245,166,35,0.3)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 6,
                          right: 6,
                          background: "rgba(45,26,14,0.75)",
                          borderRadius: 6,
                          padding: "3px 8px",
                          fontSize: 11,
                          color: "var(--gold)",
                          fontWeight: 700,
                        }}
                      >
                        ✓{" "}
                        {file.name.length > 22
                          ? file.name.slice(0, 22) + "…"
                          : file.name}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background: "rgba(245,166,35,0.1)",
                          border: "1px solid rgba(245,166,35,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                        }}
                      >
                        <Upload size={20} color="var(--gold)" />
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--card-text)",
                          marginBottom: 4,
                          fontWeight: 600,
                        }}
                      >
                        Tap to upload screenshot
                      </p>
                      <p style={{ fontSize: 11, color: "var(--card-faint)" }}>
                        or drag and drop · PNG / JPG
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>

              {/* ── Checklist ── */}
              <div
                style={{
                  background: "rgba(245,166,35,0.06)",
                  border: "1px solid rgba(245,166,35,0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    done: !!reference.trim(),
                    label: "Payment reference entered",
                  },
                  { done: !!file, label: "Screenshot uploaded" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "4px 0",
                      borderBottom:
                        i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: item.done
                          ? "rgba(22,163,74,0.2)"
                          : "rgba(255,255,255,0.08)",
                        border: `1.5px solid ${item.done ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.done && <Check size={10} color="#22c55e" />}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: item.done
                          ? "rgba(255,255,255,0.7)"
                          : "var(--card-faint)",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Submit ── */}
              <button
                className="submit-btn fade-up-6"
                onClick={submitPayment}
                disabled={loading}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 0",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 6px 24px rgba(232,86,10,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        border: "2.5px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                      }}
                      className="spinner"
                    />
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    <span>Submit Payment</span>
                  </>
                )}
              </button>

              {/* Security note */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "var(--card-faint)",
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <ShieldCheck size={11} color="rgba(245,166,35,0.6)" />
                Payments are verified by our team within 30 minutes
              </p>
            </div>
          </div>
        </div>

        {/* ════ SUCCESS MODAL ════ */}
        {successModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
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
              className="modal-box"
              style={{
                background:
                  "linear-gradient(145deg, var(--card-bg), var(--card-mid))",
                borderRadius: 28,
                width: "100%",
                maxWidth: 380,
                boxShadow: "0 32px 80px rgba(45,26,14,0.5)",
                border: "1.5px solid var(--card-border)",
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
                  height: 120,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {CONFETTI.map((p, i) => (
                  <div
                    key={i}
                    className="confetti-p"
                    style={{
                      left: p.left,
                      top: -12,
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      animationDelay: p.delay,
                      borderRadius: i % 2 === 0 ? "50%" : "2px",
                    }}
                  />
                ))}
              </div>

              <div style={{ height: 4, background: "var(--grad-flame)" }} />

              <div style={{ padding: "34px 26px 28px", textAlign: "center" }}>
                {/* Animated check */}
                <div
                  className="check-ring"
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "rgba(245,166,35,0.1)",
                    border: "1.5px solid rgba(245,166,35,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 22px",
                    boxShadow: "0 0 0 8px rgba(245,166,35,0.06)",
                  }}
                >
                  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                    <circle
                      cx="23"
                      cy="23"
                      r="21"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      opacity="0.35"
                    />
                    <polyline
                      className="check-svg"
                      points="13,24 20,31 33,16"
                      stroke="var(--gold)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>

                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Payment Submitted!
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--card-faint)",
                    marginBottom: 18,
                    lineHeight: 1.55,
                  }}
                >
                  Our team will verify your payment and confirm your order
                  within 30 minutes.
                </p>

                {/* Order badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(245,166,35,0.1)",
                    border: "1px solid rgba(245,166,35,0.25)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 16px",
                    marginBottom: 24,
                  }}
                >
                  <Package size={13} color="var(--gold)" />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--gold)",
                      fontWeight: 600,
                    }}
                  >
                    Order <strong>#{orderId}</strong> · Under Review
                  </span>
                </div>

                {/* Progress steps */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0,
                    marginBottom: 26,
                  }}
                >
                  {[
                    { label: "Order\nPlaced", done: true },
                    { label: "Payment\nSent", done: true },
                    { label: "Under\nReview", active: true },
                    { label: "Confirmed", done: false },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          className="step-dot"
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: s.done
                              ? "var(--gold)"
                              : s.active
                                ? "var(--flame)"
                                : "rgba(255,255,255,0.15)",
                            margin: "0 auto 5px",
                            boxShadow: s.active
                              ? "0 0 0 3px rgba(232,86,10,0.25)"
                              : "none",
                          }}
                        />
                        <p
                          style={{
                            fontSize: 9,
                            color:
                              s.done || s.active
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(255,255,255,0.25)",
                            whiteSpace: "pre-line",
                            lineHeight: 1.3,
                            fontWeight: s.active ? 800 : 500,
                          }}
                        >
                          {s.label}
                        </p>
                      </div>
                      {i < 3 && (
                        <div
                          style={{
                            width: 26,
                            height: 1,
                            marginBottom: 14,
                            background: s.done
                              ? "rgba(245,166,35,0.5)"
                              : "rgba(255,255,255,0.1)",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSuccessModal(false);
                    navigate("/orders", { replace: true });
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 0",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--ink)",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, var(--gold), var(--flame))",
                    boxShadow: "0 6px 20px rgba(245,166,35,0.3)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  View My Orders →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ WARN MODAL ════ */}
        {warnModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 70,
              background: "rgba(45,26,14,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="modal-box"
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
                    background: "var(--flame-light)",
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    fontSize: 26,
                  }}
                >
                  <AlertTriangle size={26} color="var(--flame)" />
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
                  {warnModal.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  {warnModal.text}
                </p>
              </div>
              <div style={{ padding: "0 24px 24px" }}>
                <button
                  onClick={() => setWarnModal(null)}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "13px 0",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    background: "var(--grad-header)",
                    boxShadow: "0 4px 14px rgba(232,86,10,0.3)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ ERROR MODAL ════ */}
        {errorModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 70,
              background: "rgba(45,26,14,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="modal-box"
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
                    background: "#fee2e2",
                    border: "1.5px solid rgba(220,38,38,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  <X size={26} color="#dc2626" />
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
                  Submission Failed
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  Something went wrong while submitting your payment. Please try
                  again or contact support.
                </p>
              </div>
              <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
                <button
                  onClick={() => setErrorModal(false)}
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
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setErrorModal(false);
                    submitPayment();
                  }}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    background: "var(--grad-header)",
                    boxShadow: "0 4px 14px rgba(232,86,10,0.28)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PaymentPage;
