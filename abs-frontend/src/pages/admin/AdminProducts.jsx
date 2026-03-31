import { useEffect, useState } from "react";
import API from "../../api/api";
import Swal from "sweetalert2";

/* ═══════════════════════════════════════════════
   ABS CRACKERS WORLD — Admin Products
   Brand: Flame Orange #e8560a → Crimson #c0392b → Gold #f5a623
   Vibe: Festival warmth, premium, energetic
═══════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .ap-root {
    --flame:       #e8560a;
    --flame-deep:  #c0392b;
    --flame-light: #fff0e8;
    --flame-mid:   #ffd9c2;
    --gold:        #f5a623;
    --gold-light:  #fff8e8;
    --gold-deep:   #c47d0a;
    --cream:       #fffaf6;
    --warm-white:  #ffffff;
    --border:      #f0e0d0;
    --border-soft: #fae8d8;
    --ink:         #2d1a0e;
    --ink-mid:     #7a4f35;
    --ink-faint:   #c4a088;
    --green:       #16a34a;
    --green-light: #dcfce7;
    --red:         #dc2626;
    --red-light:   #fee2e2;
    --blue:        #2563eb;
    --blue-light:  #dbeafe;

    --grad-flame: linear-gradient(135deg, #f5a623 0%, #e8560a 50%, #c0392b 100%);
    --grad-flame-soft: linear-gradient(135deg, #fff0e8 0%, #ffd9c2 100%);
    --grad-header: linear-gradient(135deg, #c0392b 0%, #e8560a 60%, #f5a623 100%);

    --shadow-sm:   0 1px 4px rgba(232,86,10,0.08), 0 2px 8px rgba(192,57,43,0.05);
    --shadow-md:   0 4px 16px rgba(232,86,10,0.12), 0 1px 4px rgba(192,57,43,0.06);
    --shadow-lg:   0 12px 40px rgba(192,57,43,0.18), 0 4px 12px rgba(232,86,10,0.1);
    --shadow-fab:  0 6px 24px rgba(232,86,10,0.42);

    --radius:    18px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);

    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
  }

  /* ── Page Header ── */
  .ap-header {
    background: var(--grad-header);
    padding: 28px 20px 36px;
    position: relative;
    overflow: hidden;
  }
  .ap-header::before {
    content: '🎆';
    position: absolute;
    right: 16px; top: 12px;
    font-size: 56px;
    opacity: 0.18;
    transform: rotate(15deg);
  }
  .ap-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 20px;
    background: var(--cream);
    border-radius: 20px 20px 0 0;
  }
  .ap-header-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.75);
    margin-bottom: 4px;
  }
  .ap-header-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.4px;
    line-height: 1.15;
  }
  .ap-header-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
    font-weight: 500;
  }

  /* ── Mode Toggle ── */
  .ap-mode-bar {
    display: flex;
    margin: 14px 16px 12px;
    background: var(--border-soft);
    border-radius: 13px;
    padding: 4px;
    gap: 4px;
  }
  .ap-mode-btn {
    flex: 1;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all var(--transition);
    color: var(--ink-mid);
    background: transparent;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .ap-mode-btn.active {
    background: var(--warm-white);
    color: var(--flame);
    box-shadow: 0 2px 10px rgba(232,86,10,0.18);
  }

  /* ── Category Cards ── */
  .ap-body { padding: 0 0 110px; }

  .ap-cat-card {
    margin: 0 16px 12px;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition);
  }
  .ap-cat-card:hover { box-shadow: var(--shadow-md); }

  .ap-cat-header {
    padding: 15px 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    transition: background var(--transition);
    gap: 12px;
  }
  .ap-cat-header:hover { background: var(--flame-light); }
  .ap-cat-header.open { background: var(--grad-header); }

  .ap-cat-left { display: flex; align-items: center; gap: 10px; }
  .ap-cat-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: var(--flame-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all var(--transition);
  }
  .ap-cat-header.open .ap-cat-icon { background: rgba(255,255,255,0.2); }
  .ap-cat-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    transition: color var(--transition);
  }
  .ap-cat-header.open .ap-cat-name { color: #fff; }

  .ap-cat-right { display: flex; align-items: center; gap: 8px; }
  .ap-cat-count {
    font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 20px;
    background: var(--flame-light); color: var(--flame);
    transition: all var(--transition);
  }
  .ap-cat-header.open .ap-cat-count { background: rgba(255,255,255,0.25); color: #fff; }
  .ap-cat-chevron {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--flame-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--flame);
    transition: all var(--transition); flex-shrink: 0;
  }
  .ap-cat-header.open .ap-cat-chevron {
    background: rgba(255,255,255,0.2); color: #fff; transform: rotate(180deg);
  }

  /* ── Individual Product List ── */
  .ap-prod-list { border-top: 1.5px solid var(--border); }
  .ap-prod-row {
    display: flex; align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-soft);
    gap: 12px;
    transition: background var(--transition);
  }
  .ap-prod-row:last-child { border-bottom: none; }
  .ap-prod-row:hover { background: var(--flame-light); }

  .ap-prod-thumb {
    width: 46px; height: 46px; border-radius: var(--radius-sm);
    object-fit: cover; border: 1.5px solid var(--border);
    flex-shrink: 0; background: var(--cream);
  }
  .ap-prod-thumb-ph {
    width: 46px; height: 46px; border-radius: var(--radius-sm);
    background: var(--flame-light); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .ap-prod-info { flex: 1; min-width: 0; }
  .ap-prod-name {
    font-size: 13px; font-weight: 600; color: var(--ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ap-prod-meta { display: flex; gap: 6px; margin-top: 5px; flex-wrap: wrap; }
  .ap-pill { font-size: 10px; font-weight: 700; border-radius: 20px; padding: 2px 8px; }
  .ap-pill-price { background: var(--green-light); color: var(--green); }
  .ap-pill-stock { background: var(--blue-light); color: var(--blue); }
  .ap-pill-mrp   { background: var(--flame-light); color: var(--flame); }

  .ap-prod-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .ap-icon-btn {
    width: 32px; height: 32px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: var(--warm-white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 13px; transition: all var(--transition);
  }
  .ap-icon-btn:hover { transform: translateY(-1px); }
  .ap-icon-btn.edit:hover { background: var(--blue-light); border-color: var(--blue); }
  .ap-icon-btn.del:hover  { background: var(--red-light);  border-color: var(--red);  }

  /* ── Bulk Edit Table ── */
  .ap-bulk-wrap { border-top: 1.5px solid var(--border); overflow-x: auto; }

  .ap-bulk-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; background: var(--gold-light);
    border-bottom: 1px solid var(--border); gap: 8px; flex-wrap: wrap;
  }
  .ap-bulk-info { font-size: 12px; font-weight: 600; color: var(--gold-deep); }

  .ap-bulk-save-btn {
    padding: 7px 18px; border-radius: var(--radius-sm);
    background: var(--grad-flame); color: #fff;
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; cursor: pointer;
    box-shadow: 0 2px 10px rgba(232,86,10,0.3);
    transition: all var(--transition);
  }
  .ap-bulk-save-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(232,86,10,0.4); }
  .ap-bulk-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ap-bulk-discard-btn {
    padding: 7px 14px; border-radius: var(--radius-sm);
    background: var(--warm-white); color: var(--ink-mid);
    font-size: 12px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid var(--border); cursor: pointer;
    transition: all var(--transition);
  }
  .ap-bulk-discard-btn:hover { background: var(--border); }

  .ap-bulk-table { width: 100%; border-collapse: collapse; min-width: 520px; }
  .ap-bulk-table thead tr { background: var(--flame-light); }
  .ap-bulk-table th {
    padding: 9px 10px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.09em;
    color: var(--flame-deep); text-align: left;
    white-space: nowrap; border-bottom: 1.5px solid var(--border);
  }
  .ap-bulk-table td {
    padding: 8px 10px; border-bottom: 1px solid var(--border-soft); vertical-align: middle;
  }
  .ap-bulk-table tbody tr:last-child td { border-bottom: none; }
  .ap-bulk-table tbody tr:hover td { background: #fffaf6; }

  .ap-bulk-prod-cell { display: flex; align-items: center; gap: 8px; min-width: 130px; }
  .ap-bulk-thumb {
    width: 32px; height: 32px; border-radius: 6px;
    object-fit: cover; border: 1px solid var(--border); flex-shrink: 0;
  }
  .ap-bulk-thumb-ph {
    width: 32px; height: 32px; border-radius: 6px;
    background: var(--flame-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .ap-bulk-name {
    font-size: 12px; font-weight: 600; color: var(--ink);
    overflow: hidden; text-overflow: ellipsis;
    white-space: nowrap; max-width: 110px;
  }

  .ap-bulk-input {
    width: 82px; border: 1.5px solid var(--border); border-radius: 7px;
    padding: 6px 8px; font-size: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink);
    background: var(--warm-white); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    -moz-appearance: textfield;
  }
  .ap-bulk-input::-webkit-inner-spin-button,
  .ap-bulk-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .ap-bulk-input:focus { border-color: var(--flame); box-shadow: 0 0 0 3px rgba(232,86,10,0.12); }
  .ap-bulk-input.dirty { background: #fff8e8; border-color: var(--gold); }

  /* ── FAB ── */
  .ap-fab {
    position: fixed; bottom: 84px; right: 20px;
    width: 56px; height: 56px; border-radius: 18px;
    background: var(--grad-flame); color: #fff;
    font-size: 26px; display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-fab); cursor: pointer; border: none; z-index: 50;
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .ap-fab:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 10px 32px rgba(232,86,10,0.5); }
  .ap-fab:active { transform: scale(0.96); }

  /* ── Modal ── */
  .ap-overlay {
    position: fixed; inset: 0;
    background: rgba(44,26,14,0.52);
    backdrop-filter: blur(5px); z-index: 50;
    display: flex; align-items: flex-end;
  }
  .ap-modal {
    background: var(--warm-white); width: 100%;
    border-radius: 24px 24px 0 0;
    padding: 6px 20px 36px;
    box-shadow: 0 -10px 48px rgba(192,57,43,0.18);
    max-height: 92vh; overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .ap-modal-drag {
    width: 40px; height: 4px; border-radius: 2px;
    background: var(--border); margin: 12px auto 18px;
  }
  .ap-modal-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px; font-weight: 800; color: var(--ink);
    margin-bottom: 20px; letter-spacing: -0.3px;
  }
  .ap-modal-title span {
    background: var(--grad-flame);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ── Form ── */
  .ap-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-faint); margin-bottom: 5px; display: block;
  }
  .ap-field { margin-bottom: 14px; }
  .ap-input {
    width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius-md);
    padding: 11px 14px; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink);
    background: var(--cream); outline: none; box-sizing: border-box;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .ap-input:focus { border-color: var(--flame); background: var(--warm-white); box-shadow: 0 0 0 3px rgba(232,86,10,0.1); }
  .ap-input::placeholder { color: var(--ink-faint); }
  .ap-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .ap-price-preview {
    background: var(--grad-flame-soft); border: 1.5px solid var(--flame-mid);
    border-radius: var(--radius-md); padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
  }
  .ap-price-preview-lbl { font-size: 11px; font-weight: 600; color: var(--flame-deep); }
  .ap-price-preview-val {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; font-weight: 800;
    background: var(--grad-flame);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .ap-dd { position: relative; }
  .ap-dd-trigger {
    width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius-md);
    padding: 11px 14px; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink); background: var(--cream); cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    box-sizing: border-box; transition: border-color var(--transition);
  }
  .ap-dd-trigger.open, .ap-dd-trigger:hover { border-color: var(--flame); background: var(--warm-white); }
  .ap-dd-menu {
    position: absolute; left: 0; right: 0; top: calc(100% + 4px);
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
    max-height: 200px; overflow-y: auto; z-index: 100;
  }
  .ap-dd-item { padding: 10px 14px; font-size: 14px; cursor: pointer; color: var(--ink); transition: background var(--transition); }
  .ap-dd-item:hover { background: var(--flame-light); color: var(--flame); }

  .ap-img-prev { width: 68px; height: 68px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--flame-mid); margin-bottom: 12px; }

  .ap-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px; }
  .ap-btn { padding: 13px; border-radius: var(--radius-md); font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; transition: all var(--transition); }
  .ap-btn-primary { background: var(--grad-flame); color: #fff; box-shadow: 0 3px 14px rgba(232,86,10,0.35); }
  .ap-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,86,10,0.45); }
  .ap-btn-secondary { background: var(--cream); color: var(--ink-mid); border: 1.5px solid var(--border); }
  .ap-btn-secondary:hover { background: var(--border); }

  .ap-empty { text-align: center; padding: 28px 20px; color: var(--ink-faint); font-size: 13px; font-weight: 500; }

  .ap-unsaved-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--gold); display: inline-block; margin-left: 4px;
    animation: blink 1.2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
`;

/* helpers */
const calcSP = (mrp, disc) =>
  mrp && disc ? +(mrp - (mrp * disc) / 100).toFixed(2) : "";
const calcDisc = (mrp, sp) =>
  mrp && sp ? +(((mrp - sp) / mrp) * 100).toFixed(2) : "";

function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState("individual");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    mrp: "",
    retailDiscountPercent: "",
    sellingPrice: "",
    stockBoxes: "",
    imageUrl: "",
  });

  const [bulkRows, setBulkRows] = useState({});
  const [bulkDirty, setBulkDirty] = useState({});
  const [bulkSaving, setBulkSaving] = useState(false);

  const loadCategories = async () => {
    try {
      const r = await API.get("/categories");
      setCategories(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async (name) => {
    try {
      const r = await API.get(
        `/api/products/by-category?category=${encodeURIComponent(name)}`,
      );
      setProducts(r.data);
      const seed = {};
      r.data.forEach((p) => {
        seed[p.id] = {
          mrp: p.mrp ?? "",
          disc: p.retailDiscountPercent ?? "",
          sp: p.sellingPrice ?? "",
          stock: p.stock ?? "",
        };
      });
      setBulkRows(seed);
      setBulkDirty({});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = async (cat) => {
    if (selectedCategory === cat.name) {
      setSelectedCategory(null);
      setProducts([]);
      return;
    }
    setSelectedCategory(cat.name);
    await loadProducts(cat.name);
  };

  const deleteProduct = async (id) => {
    const r = await Swal.fire({
      title: "Delete product?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e8560a",
      cancelButtonColor: "#b09e8c",
      confirmButtonText: "Delete",
    });
    if (!r.isConfirmed) return;
    try {
      await API.delete(`/api/admin/products/${id}`);
      await loadProducts(selectedCategory);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let u = { ...formData, [name]: value };
    const mrp = Number(u.mrp);
    if (name === "retailDiscountPercent" && mrp && value)
      u.sellingPrice = calcSP(mrp, Number(value));
    if (name === "sellingPrice" && mrp && value)
      u.retailDiscountPercent = calcDisc(mrp, Number(value));
    if (name === "mrp") {
      if (u.retailDiscountPercent)
        u.sellingPrice = calcSP(Number(value), Number(u.retailDiscountPercent));
      else if (u.sellingPrice)
        u.retailDiscountPercent = calcDisc(
          Number(value),
          Number(u.sellingPrice),
        );
    }
    setFormData(u);
  };

  const saveProduct = async () => {
    try {
      const payload = {
        name: formData.name,
        category: { id: formData.categoryId },
        mrp: Number(formData.mrp),
        retailDiscountPercent: Number(formData.retailDiscountPercent),
        stockBoxes: Number(formData.stockBoxes),
        imageUrl: formData.imageUrl,
      };
      if (editingProduct)
        await API.put(`/api/admin/products/${editingProduct.id}`, payload);
      else await API.post("/api/admin/products", payload);
      setShowForm(false);
      setEditingProduct(null);
      if (selectedCategory) await loadProducts(selectedCategory);
      Swal.fire({
        icon: "success",
        title: editingProduct ? "Updated!" : "Added!",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkChange = (id, field, value) => {
    setBulkRows((prev) => {
      const row = { ...prev[id], [field]: value };
      const mrp = Number(field === "mrp" ? value : row.mrp);
      if (field === "mrp") {
        if (row.disc) row.sp = calcSP(mrp, Number(row.disc));
        else if (row.sp) row.disc = calcDisc(mrp, Number(row.sp));
      }
      if (field === "disc" && mrp && value) row.sp = calcSP(mrp, Number(value));
      if (field === "sp" && mrp && value)
        row.disc = calcDisc(mrp, Number(value));
      return { ...prev, [id]: row };
    });
    setBulkDirty((prev) => ({ ...prev, [id]: true }));
  };

  const saveBulk = async () => {
    const dirty = Object.keys(bulkDirty).filter((id) => bulkDirty[id]);
    if (!dirty.length) return;
    setBulkSaving(true);
    try {
      await Promise.all(
        dirty.map((id) => {
          const row = bulkRows[id];
          const p = products.find((x) => String(x.id) === String(id));
          return API.put(`/api/admin/products/${id}`, {
            name: p.name,
            category: { id: categories.find((c) => c.name === p.category)?.id },
            mrp: Number(row.mrp),
            retailDiscountPercent: Number(row.disc),
            stockBoxes: Number(row.stock),
            imageUrl: p.imageUrl,
          });
        }),
      );
      setBulkDirty({});
      await loadProducts(selectedCategory);
      Swal.fire({
        icon: "success",
        title: `${dirty.length} product(s) updated!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: "Please try again.",
      });
    }
    setBulkSaving(false);
  };

  const discardBulk = () => {
    setBulkDirty({});
    loadProducts(selectedCategory);
  };
  const dirtyCount = Object.values(bulkDirty).filter(Boolean).length;

  return (
    <div className="ap-root">
      <style>{styles}</style>

      {/* Header */}
      <div className="ap-header">
        <div className="ap-header-eyebrow">ABS Crackers World</div>
        <div className="ap-header-title">Manage Products</div>
        <div className="ap-header-sub">
          {categories.length} categories · Festival Fireworks Store
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="ap-mode-bar">
        <button
          className={`ap-mode-btn ${mode === "individual" ? "active" : ""}`}
          onClick={() => setMode("individual")}
        >
          ✏️ Individual Edit
        </button>
        <button
          className={`ap-mode-btn ${mode === "bulk" ? "active" : ""}`}
          onClick={() => setMode("bulk")}
        >
          ⚡ Bulk Edit{" "}
          {mode === "bulk" && dirtyCount > 0 && (
            <span className="ap-unsaved-dot" />
          )}
        </button>
      </div>

      {/* FAB */}
      {mode === "individual" && (
        <button
          className="ap-fab"
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              categoryId: "",
              mrp: "",
              retailDiscountPercent: "",
              sellingPrice: "",
              stockBoxes: "",
              imageUrl: "",
            });
            setShowForm(true);
          }}
        >
          +
        </button>
      )}

      {/* Category List */}
      <div className="ap-body">
        {categories.map((cat) => {
          const isOpen = selectedCategory === cat.name;
          return (
            <div key={cat.id} className="ap-cat-card">
              <div
                className={`ap-cat-header ${isOpen ? "open" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="ap-cat-left">
                  <div className="ap-cat-icon">🎇</div>
                  <span className="ap-cat-name">{cat.name}</span>
                </div>
                <div className="ap-cat-right">
                  {isOpen && (
                    <span className="ap-cat-count">
                      {products.length} items
                    </span>
                  )}
                  <span className="ap-cat-chevron">▾</span>
                </div>
              </div>

              {isOpen && (
                <>
                  {/* ─ Individual Mode ─ */}
                  {mode === "individual" && (
                    <div className="ap-prod-list">
                      {products.length === 0 ? (
                        <div className="ap-empty">No products here yet</div>
                      ) : (
                        products.map((p) => (
                          <div key={p.id} className="ap-prod-row">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="ap-prod-thumb"
                              />
                            ) : (
                              <div className="ap-prod-thumb-ph">🎆</div>
                            )}
                            <div className="ap-prod-info">
                              <div className="ap-prod-name">{p.name}</div>
                              <div className="ap-prod-meta">
                                <span className="ap-pill ap-pill-mrp">
                                  MRP ₹{p.mrp}
                                </span>
                                <span className="ap-pill ap-pill-price">
                                  ₹{p.sellingPrice}
                                </span>
                                <span className="ap-pill ap-pill-stock">
                                  Stock: {p.stock}
                                </span>
                              </div>
                            </div>
                            <div className="ap-prod-actions">
                              <button
                                className="ap-icon-btn edit"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setFormData({
                                    name: p.name,
                                    categoryId:
                                      categories.find(
                                        (c) => c.name === p.category,
                                      )?.id || "",
                                    mrp: p.mrp,
                                    retailDiscountPercent:
                                      p.retailDiscountPercent || "",
                                    sellingPrice: p.sellingPrice || "",
                                    stockBoxes: p.stock || "",
                                    imageUrl: p.imageUrl,
                                  });
                                  setShowForm(true);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                className="ap-icon-btn del"
                                onClick={() => deleteProduct(p.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* ─ Bulk Mode ─ */}
                  {mode === "bulk" && (
                    <div className="ap-bulk-wrap">
                      <div className="ap-bulk-toolbar">
                        <span className="ap-bulk-info">
                          {dirtyCount > 0
                            ? `${dirtyCount} unsaved change${dirtyCount > 1 ? "s" : ""}`
                            : `${products.length} products — edit any field below`}
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {dirtyCount > 0 && (
                            <button
                              className="ap-bulk-discard-btn"
                              onClick={discardBulk}
                            >
                              Discard
                            </button>
                          )}
                          <button
                            className="ap-bulk-save-btn"
                            onClick={saveBulk}
                            disabled={bulkSaving || dirtyCount === 0}
                          >
                            {bulkSaving
                              ? "Saving…"
                              : dirtyCount > 0
                                ? `Save (${dirtyCount})`
                                : "Save All"}
                          </button>
                        </div>
                      </div>

                      {products.length === 0 ? (
                        <div className="ap-empty">No products here yet</div>
                      ) : (
                        <table className="ap-bulk-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>MRP (₹)</th>
                              <th>Disc %</th>
                              <th>Sell Price (₹)</th>
                              <th>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((p) => {
                              const row = bulkRows[p.id] || {};
                              const dirty = bulkDirty[p.id];
                              return (
                                <tr key={p.id}>
                                  <td>
                                    <div className="ap-bulk-prod-cell">
                                      {p.imageUrl ? (
                                        <img
                                          src={p.imageUrl}
                                          alt=""
                                          className="ap-bulk-thumb"
                                        />
                                      ) : (
                                        <div className="ap-bulk-thumb-ph">
                                          🎆
                                        </div>
                                      )}
                                      <span
                                        className="ap-bulk-name"
                                        title={p.name}
                                      >
                                        {p.name}
                                      </span>
                                      {dirty && (
                                        <span className="ap-unsaved-dot" />
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className={`ap-bulk-input ${dirty ? "dirty" : ""}`}
                                      value={row.mrp ?? ""}
                                      onChange={(e) =>
                                        handleBulkChange(
                                          p.id,
                                          "mrp",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className={`ap-bulk-input ${dirty ? "dirty" : ""}`}
                                      value={row.disc ?? ""}
                                      onChange={(e) =>
                                        handleBulkChange(
                                          p.id,
                                          "disc",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className={`ap-bulk-input ${dirty ? "dirty" : ""}`}
                                      value={row.sp ?? ""}
                                      onChange={(e) =>
                                        handleBulkChange(
                                          p.id,
                                          "sp",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className={`ap-bulk-input ${dirty ? "dirty" : ""}`}
                                      value={row.stock ?? ""}
                                      onChange={(e) =>
                                        handleBulkChange(
                                          p.id,
                                          "stock",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="ap-overlay">
          <div className="ap-modal">
            <div className="ap-modal-drag" />
            <div className="ap-modal-title">
              {editingProduct ? (
                <>
                  Edit <span>Product</span>
                </>
              ) : (
                <>
                  New <span>Product</span>
                </>
              )}
            </div>

            <div className="ap-field">
              <label className="ap-label">Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sky Shot 10 pcs"
                className="ap-input"
              />
            </div>

            <div className="ap-field">
              <label className="ap-label">Category</label>
              <div className="ap-dd">
                <div
                  className={`ap-dd-trigger ${categoryOpen ? "open" : ""}`}
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  <span
                    style={{
                      color: formData.categoryId
                        ? "var(--ink)"
                        : "var(--ink-faint)",
                    }}
                  >
                    {categories.find((c) => c.id === formData.categoryId)
                      ?.name || "Select Category"}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                    ▾
                  </span>
                </div>
                {categoryOpen && (
                  <div className="ap-dd-menu">
                    {categories.map((c) => (
                      <div
                        key={c.id}
                        className="ap-dd-item"
                        onClick={() => {
                          setFormData({ ...formData, categoryId: c.id });
                          setCategoryOpen(false);
                        }}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ap-row2">
              <div className="ap-field">
                <label className="ap-label">MRP (₹)</label>
                <input
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  className="ap-input"
                />
              </div>
              <div className="ap-field">
                <label className="ap-label">Stock Boxes</label>
                <input
                  name="stockBoxes"
                  value={formData.stockBoxes}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  className="ap-input"
                />
              </div>
            </div>

            <div className="ap-row2">
              <div className="ap-field">
                <label className="ap-label">Discount %</label>
                <input
                  name="retailDiscountPercent"
                  value={formData.retailDiscountPercent}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  className="ap-input"
                />
              </div>
              <div className="ap-field">
                <label className="ap-label">Selling Price (₹)</label>
                <input
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  className="ap-input"
                />
              </div>
            </div>

            {formData.sellingPrice > 0 && (
              <div className="ap-price-preview">
                <span className="ap-price-preview-lbl">
                  Final Selling Price
                </span>
                <span className="ap-price-preview-val">
                  ₹{formData.sellingPrice}
                </span>
              </div>
            )}

            <div className="ap-field">
              <label className="ap-label">Image URL</label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://…"
                className="ap-input"
              />
            </div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                className="ap-img-prev"
              />
            )}

            <div className="ap-btn-row">
              <button onClick={saveProduct} className="ap-btn ap-btn-primary">
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="ap-btn ap-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
