import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CreditCard,
  Truck,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Inbox,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   ABS CRACKERS WORLD — Admin Orders
   Brand tokens synced from AdminProducts:
   Flame #e8560a · Crimson #c0392b · Gold #f5a623
   Fonts: Bricolage Grotesque + Plus Jakarta Sans
═══════════════════════════════════════════════ */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .ao-root {
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
    --green-deep:   #14532d;
    --red:          #dc2626;
    --red-light:    #fee2e2;
    --blue:         #2563eb;
    --blue-light:   #dbeafe;
    --blue-deep:    #1e3a8a;

    --grad-flame:      linear-gradient(135deg, #f5a623 0%, #e8560a 50%, #c0392b 100%);
    --grad-header:     linear-gradient(135deg, #c0392b 0%, #e8560a 60%, #f5a623 100%);
    --grad-flame-soft: linear-gradient(135deg, #fff0e8 0%, #ffd9c2 100%);

    --shadow-sm: 0 1px 4px rgba(232,86,10,0.08), 0 2px 8px rgba(192,57,43,0.05);
    --shadow-md: 0 4px 16px rgba(232,86,10,0.12), 0 1px 4px rgba(192,57,43,0.06);
    --shadow-lg: 0 12px 40px rgba(192,57,43,0.18), 0 4px 12px rgba(232,86,10,0.1);

    --radius:    18px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --t: 0.2s cubic-bezier(0.4,0,0.2,1);

    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Header ── */
  .ao-header {
    background: var(--grad-header);
    padding: 28px 20px 40px;
    position: relative; overflow: hidden;
  }
  .ao-header::before {
    content: '📦';
    position: absolute; right: 16px; top: 10px;
    font-size: 60px; opacity: 0.15; transform: rotate(10deg);
  }
  .ao-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 22px; background: var(--cream);
    border-radius: 22px 22px 0 0;
  }
  .ao-header-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.72); margin-bottom: 4px;
  }
  .ao-header-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 26px; font-weight: 800; color: #fff;
    letter-spacing: -0.4px; line-height: 1.15;
  }
  .ao-header-sub { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px; font-weight: 500; }
  .ao-header-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
  .ao-header-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: var(--radius-sm);
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; border: none; transition: all var(--t);
  }
  .ao-header-btn-outline {
    background: rgba(255,255,255,0.18); color: #fff;
    border: 1.5px solid rgba(255,255,255,0.4);
  }
  .ao-header-btn-outline:hover { background: rgba(255,255,255,0.28); }
  .ao-header-btn-white { background: #fff; color: var(--flame-deep); box-shadow: 0 2px 10px rgba(192,57,43,0.2); }
  .ao-header-btn-white:hover { background: var(--flame-light); }

  /* ── Metrics ── */
  .ao-metrics {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 10px; padding: 16px 14px 0;
  }
  @media (max-width: 480px) { .ao-metrics { grid-template-columns: repeat(2,1fr); } }
  .ao-metric {
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 12px 14px; box-shadow: var(--shadow-sm);
  }
  .ao-metric-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--ink-faint); margin-bottom: 4px;
  }
  .ao-metric-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 24px; font-weight: 800; color: var(--ink); line-height: 1;
  }
  .ao-metric-val.flame { color: var(--flame); }
  .ao-metric-val.gold  { color: var(--gold-deep); }
  .ao-metric-val.blue  { color: var(--blue); }
  .ao-metric-val.green { color: var(--green); }

  /* ── Sticky Filter Bar ── */
  .ao-filterbar {
    position: sticky; top: 0; z-index: 30;
    background: var(--warm-white);
    border-bottom: 1.5px solid var(--border);
    box-shadow: 0 2px 12px rgba(232,86,10,0.07);
  }
  .ao-filterbar-top {
    display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  }
  .ao-search-wrap { position: relative; flex: 1; min-width: 0; }
  .ao-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: var(--ink-faint);
  }
  .ao-search-input {
    width: 100%; height: 38px; padding: 0 10px 0 34px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink); background: var(--cream);
    outline: none; box-sizing: border-box;
    transition: border-color var(--t), box-shadow var(--t);
  }
  .ao-search-input:focus { border-color: var(--flame); box-shadow: 0 0 0 3px rgba(232,86,10,0.1); }
  .ao-search-input::placeholder { color: var(--ink-faint); }
  .ao-filter-toggle-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 0 12px; height: 38px; white-space: nowrap;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: var(--cream); color: var(--ink-mid);
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all var(--t); flex-shrink: 0;
  }
  .ao-filter-toggle-btn.active { background: var(--flame-light); border-color: var(--flame-mid); color: var(--flame-deep); }
  .ao-filter-badge {
    background: var(--flame); color: #fff;
    font-size: 9px; font-weight: 800;
    width: 16px; height: 16px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .ao-filters-panel {
    padding: 0 14px 12px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  @media (min-width: 600px) {
    .ao-filters-panel { grid-template-columns: repeat(4,1fr); }
  }
  .ao-filter-select {
    height: 36px; width: 100%; padding: 0 10px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 12px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink); background: var(--cream);
    outline: none; box-sizing: border-box; cursor: pointer;
    transition: border-color var(--t);
  }
  .ao-filter-select:focus { border-color: var(--flame); box-shadow: 0 0 0 3px rgba(232,86,10,0.1); }
  .ao-filter-summary {
    padding: 6px 14px 10px;
    font-size: 11px; color: var(--ink-mid); font-weight: 500;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ao-clear-btn {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 700; color: var(--red);
    background: var(--red-light); border: none;
    padding: 3px 8px; border-radius: 20px; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all var(--t);
  }
  .ao-clear-btn:hover { background: #fecaca; }

  /* ── Status / Payment Badges ── */
  .ao-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    padding: 3px 9px; border-radius: 20px; white-space: nowrap;
  }
  .ao-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ao-badge-PLACED        { background: var(--gold-light);  color: var(--gold-deep); }
  .ao-badge-PLACED .ao-badge-dot { background: var(--gold); }
  .ao-badge-PROCESSING    { background: var(--flame-light); color: var(--flame-deep); }
  .ao-badge-PROCESSING .ao-badge-dot { background: var(--flame); }
  .ao-badge-READY_TO_SHIP { background: var(--blue-light);  color: var(--blue-deep); }
  .ao-badge-READY_TO_SHIP .ao-badge-dot { background: var(--blue); }
  .ao-badge-DELIVERED     { background: var(--green-light); color: var(--green-deep); }
  .ao-badge-DELIVERED .ao-badge-dot { background: var(--green); }
  .ao-badge-default       { background: var(--border); color: var(--ink-mid); }
  .ao-pay-PAID      { background: var(--green-light); color: var(--green-deep); }
  .ao-pay-SUBMITTED { background: var(--gold-light);  color: var(--gold-deep); }
  .ao-pay-PENDING   { background: var(--red-light);   color: var(--red); }
  .ao-pay-default   { background: var(--border); color: var(--ink-mid); }

  /* ── Buttons ── */
  .ao-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 11px; border-radius: var(--radius-sm);
    font-size: 11px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; border: none;
    transition: all var(--t); white-space: nowrap;
  }
  .ao-btn:hover { transform: translateY(-1px); }
  .ao-btn-ghost { background: var(--cream); color: var(--ink-mid); border: 1.5px solid var(--border); }
  .ao-btn-ghost:hover { background: var(--border); }
  .ao-btn-green { background: var(--green-light); color: var(--green-deep); border: 1.5px solid #bbf7d0; }
  .ao-btn-green:hover { background: #bbf7d0; }
  .ao-btn-amber { background: var(--gold-light); color: var(--gold-deep); border: 1.5px solid #fde68a; }
  .ao-btn-amber:hover { background: #fde68a; }
  .ao-btn-blue  { background: var(--blue-light); color: var(--blue-deep); border: 1.5px solid #bfdbfe; }
  .ao-btn-blue:hover { background: #bfdbfe; }

  /* ── MOBILE card list (default, shown <768px) ── */
  .ao-card-list { padding: 14px 14px 100px; display: flex; flex-direction: column; gap: 12px; }
  .ao-order-card {
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm);
    transition: box-shadow var(--t), transform var(--t);
  }
  .ao-order-card:active { transform: scale(0.99); }
  .ao-card-stripe { height: 4px; width: 100%; }
  .ao-card-body { padding: 14px 16px 16px; }
  .ao-card-row1 {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 12px;
  }
  .ao-card-order-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.09em; color: var(--ink-faint); margin-bottom: 2px;
  }
  .ao-card-order-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px; font-weight: 800; color: var(--ink);
  }
  .ao-card-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 14px;
  }
  .ao-card-field-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--ink-faint); margin-bottom: 2px;
  }
  .ao-card-field-val { font-size: 13px; font-weight: 600; color: var(--ink); }
  .ao-card-amount {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px; font-weight: 800; color: var(--flame-deep);
  }
  .ao-card-phone-link {
    font-size: 12px; font-weight: 600; color: var(--blue);
    text-decoration: none; display: flex; align-items: center; gap: 3px;
  }
  .ao-card-divider { height: 1px; background: var(--border-soft); margin: 0 0 12px; }
  .ao-card-actions { display: flex; gap: 7px; flex-wrap: wrap; }

  /* ── DESKTOP table (shown ≥768px) ── */
  .ao-table-wrap { padding: 16px 16px 100px; display: none; }
  @media (min-width: 768px) {
    .ao-card-list  { display: none; }
    .ao-table-wrap { display: block; }
  }
  .ao-table-container {
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm);
  }
  .ao-table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 820px; }
  .ao-table thead tr { background: var(--flame-light); }
  .ao-table th {
    padding: 11px 14px; text-align: left;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.09em; color: var(--flame-deep);
    white-space: nowrap; cursor: pointer; user-select: none;
    border-bottom: 1.5px solid var(--border);
    transition: background var(--t);
  }
  .ao-table th:hover { background: var(--flame-mid); }
  .ao-table th.no-sort { cursor: default; }
  .ao-table th.no-sort:hover { background: var(--flame-light); }
  .ao-table td {
    padding: 13px 14px; border-bottom: 1px solid var(--border-soft);
    font-size: 13px; color: var(--ink); vertical-align: middle;
  }
  .ao-table tbody tr:last-child td { border-bottom: none; }
  .ao-table tbody tr:hover td { background: var(--flame-light); }

  /* ── Skeleton ── */
  .ao-skeleton-card {
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: var(--radius); height: 160px; overflow: hidden; position: relative;
  }
  .ao-sk-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(232,86,10,0.06) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: skAnim 1.5s infinite;
  }
  @keyframes skAnim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .ao-sk-cell {
    height: 13px; border-radius: 6px;
    background: var(--flame-light);
    animation: skAnim 1.5s infinite; background-size: 200% 100%;
  }

  /* ── Empty ── */
  .ao-empty { text-align: center; padding: 52px 24px; }
  .ao-empty-icon { margin-bottom: 12px; opacity: 0.4; }
  .ao-empty-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 6px;
  }
  .ao-empty-sub { font-size: 13px; color: var(--ink-faint); }

  /* ── Error ── */
  .ao-error {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 20px; color: var(--red); font-size: 13px; font-weight: 500;
    background: var(--red-light); border-bottom: 1.5px solid #fecaca;
  }

  /* ── Pagination ── */
  .ao-pagination {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; flex-wrap: wrap; gap: 8px;
    border-top: 1.5px solid var(--border); background: var(--cream);
  }
  .ao-pg-info { font-size: 12px; color: var(--ink-mid); font-weight: 500; }
  .ao-pg-controls { display: flex; gap: 5px; align-items: center; }
  .ao-pg-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: var(--radius-sm);
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--warm-white); color: var(--ink-mid);
    transition: all var(--t);
  }
  .ao-pg-btn:hover:not(:disabled) { background: var(--flame-light); border-color: var(--flame-mid); color: var(--flame-deep); }
  .ao-pg-btn.active { background: var(--grad-flame); color: #fff; border-color: transparent; }
  .ao-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .ao-pg-size-select {
    height: 32px; padding: 0 8px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 12px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink); background: var(--warm-white);
    cursor: pointer; outline: none;
  }

  /* ── Modal ── */
  .ao-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(45,26,14,0.5); backdrop-filter: blur(5px);
    display: flex; align-items: flex-end;
  }
  @media (min-width: 600px) {
    .ao-overlay { align-items: center; justify-content: center; padding: 20px; }
  }
  .ao-modal {
    background: var(--warm-white); width: 100%; max-width: 460px;
    border-radius: 24px 24px 0 0; max-height: 90vh;
    display: flex; flex-direction: column; box-shadow: var(--shadow-lg);
    animation: slideUp 0.28s cubic-bezier(0.32,0.72,0,1);
  }
  @media (min-width: 600px) {
    .ao-modal { border-radius: 24px; animation: popIn 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes popIn   { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .ao-modal-drag {
    width: 40px; height: 4px; border-radius: 2px;
    background: var(--border); margin: 12px auto 0;
  }
  @media (min-width: 600px) { .ao-modal-drag { display: none; } }
  .ao-modal-header {
    padding: 16px 20px; border-bottom: 1.5px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ao-modal-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 17px; font-weight: 800; color: var(--ink);
  }
  .ao-modal-close {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--cream); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--ink-mid); transition: all var(--t);
  }
  .ao-modal-close:hover { background: var(--red-light); color: var(--red); border-color: #fecaca; }
  .ao-modal-body { overflow-y: auto; padding: 8px 20px; flex: 1; }
  .ao-modal-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border-soft);
  }
  .ao-modal-item:last-child { border-bottom: none; }
  .ao-modal-img {
    width: 50px; height: 50px; border-radius: var(--radius-sm);
    object-fit: cover; border: 1.5px solid var(--border);
    background: var(--cream); flex-shrink: 0;
  }
  .ao-modal-item-name {
    font-size: 13px; font-weight: 600; color: var(--ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ao-modal-item-qty { font-size: 11px; color: var(--ink-faint); margin-top: 3px; }
  .ao-modal-item-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px; font-weight: 800; color: var(--flame-deep);
    margin-left: auto; flex-shrink: 0;
  }
  .ao-modal-footer {
    padding: 14px 20px 20px; border-top: 1.5px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ao-modal-total-label { font-size: 12px; font-weight: 600; color: var(--ink-faint); }
  .ao-modal-total-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px; font-weight: 800;
    background: var(--grad-flame);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
`;

/* ─── Constants ─── */
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const STATUS_CONFIG = {
  PLACED: { label: "Placed", stripe: "#f5a623" },
  PROCESSING: { label: "Processing", stripe: "#e8560a" },
  READY_TO_SHIP: { label: "Ready to Ship", stripe: "#2563eb" },
  DELIVERED: { label: "Delivered", stripe: "#16a34a" },
};

const PAYMENT_LABELS = {
  PAID: "Paid",
  SUBMITTED: "Submitted",
  PENDING: "Pending",
};

/* ─── Helpers ─── */
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function exportCSV(orders) {
  const hdr = [
    "Order #",
    "Customer",
    "Phone",
    "Amount",
    "Payment",
    "Status",
    "Date",
  ];
  const rows = orders.map((o) => [
    o.orderNumber,
    o.user?.name || "",
    o.user?.phone || "",
    o.totalAmount,
    o.paymentStatus,
    o.orderStatus,
    o.createdAt ? fmtDate(o.createdAt) : "",
  ]);
  const csv = [hdr, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  Object.assign(document.createElement("a"), {
    href: url,
    download: "orders.csv",
  }).click();
  URL.revokeObjectURL(url);
}

/* ─── Sub-components ─── */
function StatusBadge({ status }) {
  const cls = STATUS_CONFIG[status]
    ? `ao-badge ao-badge-${status}`
    : "ao-badge ao-badge-default";
  return (
    <span className={cls}>
      {STATUS_CONFIG[status] && <span className="ao-badge-dot" />}
      {STATUS_CONFIG[status]?.label || status?.replace(/_/g, " ") || "—"}
    </span>
  );
}

function PaymentBadge({ status }) {
  const cls = PAYMENT_LABELS[status]
    ? `ao-badge ao-pay-${status}`
    : "ao-badge ao-pay-default";
  return <span className={cls}>{PAYMENT_LABELS[status] || status || "—"}</span>;
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field)
    return <ChevronsUpDown size={12} style={{ opacity: 0.4, marginLeft: 3 }} />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} style={{ marginLeft: 3, color: "var(--flame)" }} />
  ) : (
    <ChevronDown size={12} style={{ marginLeft: 3, color: "var(--flame)" }} />
  );
}

function OrderActions({ o, onView, navigate }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <button className="ao-btn ao-btn-ghost" onClick={() => onView(o)}>
        <Eye size={12} /> View
      </button>
      {o.paymentStatus === "SUBMITTED" && (
        <button
          className="ao-btn ao-btn-green"
          onClick={() => navigate("/admin/payments")}
        >
          <CreditCard size={12} /> Verify
        </button>
      )}
      {o.orderStatus === "PROCESSING" && (
        <button
          className="ao-btn ao-btn-amber"
          onClick={() => navigate(`/admin/packing/${o.id}`)}
        >
          <Package size={12} /> Pack
        </button>
      )}
      {o.orderStatus === "READY_TO_SHIP" && (
        <button
          className="ao-btn ao-btn-blue"
          onClick={() => navigate(`/admin/shipping/${o.id}`)}
        >
          <Truck size={12} /> Ship
        </button>
      )}
    </div>
  );
}

function ItemsModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="ao-overlay" onClick={onClose}>
      <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ao-modal-drag" />
        <div className="ao-modal-header">
          <p className="ao-modal-title">Order #{order.orderNumber}</p>
          <button className="ao-modal-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="ao-modal-body">
          {order.items?.map((item, idx) => (
            <div key={item.productId || idx} className="ao-modal-item">
              <img
                src={item.product?.imageUrl}
                alt={item.product?.name}
                className="ao-modal-img"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ao-modal-item-name">{item.product?.name}</div>
                <div className="ao-modal-item-qty">Qty: {item.quantity}</div>
              </div>
              <span className="ao-modal-item-price">
                {fmt(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
        <div className="ao-modal-footer">
          <span className="ao-modal-total-label">Order Total</span>
          <span className="ao-modal-total-val">{fmt(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError("Failed to load orders. Please try again.");
    }
    setLoading(false);
  };

  const handleSort = useCallback((field) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return field;
      }
      setSortDir("asc");
      return field;
    });
    setPage(1);
  }, []);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("ALL");
    setFilterPayment("ALL");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const activeFilterCount = [
    search,
    filterStatus !== "ALL",
    filterPayment !== "ALL",
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let r = [...orders];
    const q = search.toLowerCase().trim();
    if (q)
      r = r.filter(
        (o) =>
          String(o.orderNumber).toLowerCase().includes(q) ||
          (o.user?.name || "").toLowerCase().includes(q),
      );
    if (filterStatus !== "ALL")
      r = r.filter((o) => o.orderStatus === filterStatus);
    if (filterPayment !== "ALL")
      r = r.filter((o) => o.paymentStatus === filterPayment);
    if (dateFrom)
      r = r.filter(
        (o) => o.createdAt && new Date(o.createdAt) >= new Date(dateFrom),
      );
    if (dateTo)
      r = r.filter(
        (o) =>
          o.createdAt &&
          new Date(o.createdAt) <= new Date(dateTo + "T23:59:59"),
      );
    r.sort((a, b) => {
      let av = a[sortField],
        bv = b[sortField];
      if (sortField === "totalAmount") {
        av = Number(av);
        bv = Number(bv);
      } else if (sortField === "createdAt") {
        av = new Date(av || 0);
        bv = new Date(bv || 0);
      } else {
        av = String(av || "").toLowerCase();
        bv = String(bv || "").toLowerCase();
      }
      return av < bv
        ? sortDir === "asc"
          ? -1
          : 1
        : av > bv
          ? sortDir === "asc"
            ? 1
            : -1
          : 0;
    });
    return r;
  }, [
    orders,
    search,
    filterStatus,
    filterPayment,
    dateFrom,
    dateTo,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const metrics = [
    { label: "Total", val: orders.length, cls: "" },
    {
      label: "Processing",
      val: orders.filter((o) => o.orderStatus === "PROCESSING").length,
      cls: "flame",
    },
    {
      label: "To Ship",
      val: orders.filter((o) => o.orderStatus === "READY_TO_SHIP").length,
      cls: "blue",
    },
    {
      label: "Delivered",
      val: orders.filter((o) => o.orderStatus === "DELIVERED").length,
      cls: "green",
    },
  ];

  const COL = [
    { label: "Order #", field: "orderNumber", w: 90 },
    { label: "Customer", field: "customer", w: 150 },
    { label: "Amount", field: "totalAmount", w: 110 },
    { label: "Payment", field: "paymentStatus", w: 105 },
    { label: "Status", field: "orderStatus", w: 130 },
    { label: "Date", field: "createdAt", w: 100 },
    { label: "Actions", field: null, w: 180 },
  ];

  function Pagination({ mobile = false }) {
    return (
      <div className="ao-pagination">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="ao-pg-info">Rows:</span>
          <select
            className="ao-pg-size-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <span className="ao-pg-info">
          {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filtered.length)} / {filtered.length}
        </span>
        <div className="ao-pg-controls">
          <button
            className="ao-pg-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={13} />
          </button>
          {!mobile &&
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  className={`ao-pg-btn ${page === p ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
          <button
            className="ao-pg-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  const EmptyState = () => (
    <div className="ao-empty">
      <div className="ao-empty-icon">
        <Inbox size={36} />
      </div>
      <div className="ao-empty-title">
        {activeFilterCount > 0 ? "No matches found" : "No orders yet"}
      </div>
      <div className="ao-empty-sub">
        {activeFilterCount > 0
          ? "Try adjusting your filters"
          : "Orders placed by customers will appear here"}
      </div>
      {activeFilterCount > 0 && (
        <button
          className="ao-btn ao-btn-ghost"
          style={{ marginTop: 14 }}
          onClick={clearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="ao-root">
      <style>{styles}</style>

      {/* ── Header ── */}
      <div className="ao-header">
        <div className="ao-header-eyebrow">ABS Crackers World</div>
        <div className="ao-header-title">Orders</div>
        <div className="ao-header-sub">
          {loading ? "Loading…" : `${orders.length} total orders`}
        </div>
        <div className="ao-header-actions">
          <button
            className="ao-header-btn ao-header-btn-outline"
            onClick={() => exportCSV(filtered)}
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            className="ao-header-btn ao-header-btn-white"
            onClick={loadOrders}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Metrics ── */}
      {!loading && !error && (
        <div className="ao-metrics">
          {metrics.map((m) => (
            <div key={m.label} className="ao-metric">
              <div className="ao-metric-label">{m.label}</div>
              <div className={`ao-metric-val ${m.cls}`}>{m.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sticky Filter Bar ── */}
      <div
        className="ao-filterbar"
        style={{ marginTop: !loading && !error ? 14 : 0 }}
      >
        <div className="ao-filterbar-top">
          <div className="ao-search-wrap">
            <Search size={14} className="ao-search-icon" />
            <input
              className="ao-search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order # or name…"
            />
          </div>
          <button
            className={`ao-filter-toggle-btn ${filtersOpen || activeFilterCount > 0 ? "active" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal size={13} /> Filters
            {activeFilterCount > 0 && (
              <span className="ao-filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="ao-filters-panel">
            <select
              className="ao-filter-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <select
              className="ao-filter-select"
              value={filterPayment}
              onChange={(e) => {
                setFilterPayment(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All payments</option>
              {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input
              className="ao-filter-select"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              title="From date"
            />
            <input
              className="ao-filter-select"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              title="To date"
            />
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="ao-filter-summary">
            <span>
              Showing {filtered.length} of {orders.length} orders
            </span>
            <button className="ao-clear-btn" onClick={clearFilters}>
              <X size={10} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* ══════════ MOBILE: Card List ══════════ */}
      <div className="ao-card-list">
        {error ? (
          <div className="ao-error">
            <AlertCircle size={16} /> {error}
            <button
              className="ao-btn ao-btn-ghost"
              style={{ marginLeft: 8 }}
              onClick={loadOrders}
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ao-skeleton-card">
              <div className="ao-sk-shimmer" />
            </div>
          ))
        ) : paginated.length === 0 ? (
          <EmptyState />
        ) : (
          paginated.map((o) => {
            const stripe =
              STATUS_CONFIG[o.orderStatus]?.stripe || "var(--border)";
            return (
              <div key={o.id} className="ao-order-card">
                <div
                  className="ao-card-stripe"
                  style={{ background: stripe }}
                />
                <div className="ao-card-body">
                  <div className="ao-card-row1">
                    <div>
                      <div className="ao-card-order-label">Order</div>
                      <div className="ao-card-order-num">#{o.orderNumber}</div>
                    </div>
                    <StatusBadge status={o.orderStatus} />
                  </div>
                  <div className="ao-card-grid">
                    <div>
                      <div className="ao-card-field-label">Amount</div>
                      <div className="ao-card-amount">{fmt(o.totalAmount)}</div>
                    </div>
                    <div>
                      <div className="ao-card-field-label">Customer</div>
                      <div className="ao-card-field-val">
                        {o.user?.name || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="ao-card-field-label">Payment</div>
                      <PaymentBadge status={o.paymentStatus} />
                    </div>
                    <div>
                      <div className="ao-card-field-label">Mobile</div>
                      {o.user?.phone ? (
                        <a
                          href={`tel:${o.user.phone}`}
                          className="ao-card-phone-link"
                        >
                          📞 {o.user.phone}
                        </a>
                      ) : (
                        <span className="ao-card-field-val">—</span>
                      )}
                    </div>
                  </div>
                  {o.createdAt && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-faint)",
                        marginBottom: 10,
                        fontWeight: 500,
                      }}
                    >
                      {fmtDate(o.createdAt)}
                    </div>
                  )}
                  <div className="ao-card-divider" />
                  <OrderActions
                    o={o}
                    onView={setSelectedOrder}
                    navigate={navigate}
                  />
                </div>
              </div>
            );
          })
        )}
        {!loading && !error && filtered.length > 0 && <Pagination mobile />}
      </div>

      {/* ══════════ DESKTOP: Table ══════════ */}
      <div className="ao-table-wrap">
        <div className="ao-table-container">
          {error && (
            <div className="ao-error">
              <AlertCircle size={16} /> {error}
              <button
                className="ao-btn ao-btn-ghost"
                style={{ marginLeft: 8 }}
                onClick={loadOrders}
              >
                Retry
              </button>
            </div>
          )}
          {!error && (
            <div style={{ overflowX: "auto" }}>
              <table className="ao-table">
                <colgroup>
                  {COL.map((c) => (
                    <col key={c.label} style={{ width: c.w }} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {COL.map((c) => (
                      <th
                        key={c.label}
                        className={c.field ? "" : "no-sort"}
                        onClick={() => c.field && handleSort(c.field)}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {c.label}
                          {c.field && (
                            <SortIcon
                              field={c.field}
                              sortField={sortField}
                              sortDir={sortDir}
                            />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {[80, 120, 70, 80, 100, 70, 120].map((w, j) => (
                          <td key={j} style={{ padding: "14px" }}>
                            <div className="ao-sk-cell" style={{ width: w }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={COL.length}>
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <span
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontWeight: 800,
                              fontSize: 14,
                            }}
                          >
                            #{o.orderNumber}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {o.user?.name || "—"}
                          </div>
                          {o.user?.phone && (
                            <a
                              href={`tel:${o.user.phone}`}
                              style={{
                                fontSize: 11,
                                color: "var(--blue)",
                                textDecoration: "none",
                                display: "block",
                                marginTop: 2,
                              }}
                            >
                              {o.user.phone}
                            </a>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontWeight: 800,
                              fontSize: 15,
                              color: "var(--flame-deep)",
                            }}
                          >
                            {fmt(o.totalAmount)}
                          </span>
                        </td>
                        <td>
                          <PaymentBadge status={o.paymentStatus} />
                        </td>
                        <td>
                          <StatusBadge status={o.orderStatus} />
                        </td>
                        <td style={{ color: "var(--ink-mid)", fontSize: 12 }}>
                          {fmtDate(o.createdAt)}
                        </td>
                        <td>
                          <OrderActions
                            o={o}
                            onView={setSelectedOrder}
                            navigate={navigate}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && filtered.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── Items Modal ── */}
      <ItemsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

export default AdminOrders;
