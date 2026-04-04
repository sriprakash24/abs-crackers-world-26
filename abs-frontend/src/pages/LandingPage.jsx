import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Truck,
  Grid,
  LogOut,
  Menu,
  X,
  Package,
  Info,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import logo from "../assets/logo1.png";
import sparklers from "../assets/categories/sparklers.png";
import groundChakkaras from "../assets/categories/sparklers.png";
import flowerPot from "../assets/categories/sparklers.png";
import twinklingStar from "../assets/categories/sparklers.png";
import oneSound from "../assets/categories/sparklers.png";
import bomb from "../assets/categories/bombs.png";
import giantDeluxe from "../assets/categories/sparklers.png";
import redMagic from "../assets/categories/sparklers.png";
import megaFancy from "../assets/categories/sparklers.png";
import multiColour from "../assets/categories/sparklers.png";
import fancyFountains from "../assets/categories/sparklers.png";
import bijili from "../assets/categories/sparklers.png";
import rocket from "../assets/categories/sparklers.png";
import giftBox from "../assets/categories/sparklers.png";
import matchBox from "../assets/categories/sparklers.png";
import gun from "../assets/categories/sparklers.png";
import kidsCrackers from "../assets/categories/sparklers.png";
import newArrivals from "../assets/categories/sparklers.png";
import banner3 from "../assets/banner/ban2.png";
import delivery2 from "../assets/banner/del2.png";
import combo from "../assets/banner/combo-box.jpg";
import banner1 from "../assets/banner/ban1.png";

function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [addingProduct, setAddingProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [productsLoading, setProductsLoading] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const menuRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [banner3, delivery2, combo];
  const productSectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const selectedIndex = categories.findIndex(
    (c) => c.name === selectedCategory,
  );
  const beforeCategories =
    selectedIndex >= 0 ? categories.slice(0, selectedIndex) : categories;
  const afterCategories =
    selectedIndex >= 0 ? categories.slice(selectedIndex + 1) : [];

  const categoryImages = {
    SPARKLERS: sparklers,
    "GROUND CHAKKARAS": groundChakkaras,
    "FLOWER POT": flowerPot,
    "TWINKLING STAR": twinklingStar,
    "ONE SOUND CRACKERS": oneSound,
    BOMB: bomb,
    "GIANT & DELUXE": giantDeluxe,
    "RED MAGIC CRACKERS": redMagic,
    "MEGA FANCY OUT": megaFancy,
    "MULTI COLOUR SKY SHOT": multiColour,
    "FANCY FOUNTAINS": fancyFountains,
    BIJILI: bijili,
    ROCKET: rocket,
    "GIFT BOX": giftBox,
    "MATCH BOX": matchBox,
    GUN: gun,
    "KIDS CRACKERS": kidsCrackers,
    "NEW ARRIVALS": newArrivals,
  };

  // ── ALL ORIGINAL LOGIC UNCHANGED ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMoreModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUserProfile = async () => {
    try {
      const res = await API.get("/api/auth/profile");
      setUserName(res.data.name);
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const loadCart = async () => {
    try {
      const res = await API.get("/api/cart");
      const items = res.data.items || [];
      const cartMap = {};
      let total = 0;
      items.forEach((item) => {
        cartMap[item.productId] = item.quantity;
        total += item.quantity;
      });
      setCart(cartMap);
      setCartCount(total);
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories/active");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadCart();
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (selectedCategory && productSectionRef.current) {
      const yOffset = -80;
      const y =
        productSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleCategoryClick = async (category) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setProducts([]);
      return;
    }
    setSelectedCategory(category);
    try {
      setProductsLoading(true);
      const response = await API.get(
        `/api/products/by-category?category=${encodeURIComponent(category)}`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const increaseQty = async (productId) => {
    try {
      setAddingProduct(productId);
      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);
      setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Add to cart failed", error);
    } finally {
      setAddingProduct(null);
    }
  };

  const decreaseQty = async (productId) => {
    const currentQty = cart[productId] || 0;
    try {
      if (currentQty <= 1) {
        await API.delete(`/api/cart/remove?productId=${productId}`);
        setCart((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } else {
        await API.put(
          `/api/cart/update?productId=${productId}&quantity=${currentQty - 1}`,
        );
        setCart((prev) => ({ ...prev, [productId]: currentQty - 1 }));
      }
      setCartCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Decrease failed", error);
    }
  };
  // ── END ORIGINAL LOGIC ────────────────────────────────────────────────────

  function MenuItem({ icon, label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 rounded-2xl p-4 hover:bg-red-50 transition-all duration-200 group"
      >
        <div className="text-red-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-600 group-hover:text-red-600">
          {label}
        </span>
      </button>
    );
  }

  function CategoryCard({ cat, onClick, isSelected }) {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 group
          ${
            isSelected
              ? "ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-[0.98]"
              : "hover:shadow-xl hover:-translate-y-1"
          }`}
        style={{
          background: isSelected
            ? "linear-gradient(135deg,#fff1f1,#fff8f0)"
            : "white",
        }}
      >
        {/* glow blob */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-br from-red-50 to-orange-50`}
        />
        {/* top accent bar */}
        <div
          className={`h-1 w-full transition-all duration-300 ${
            isSelected
              ? "bg-gradient-to-r from-red-500 to-orange-400"
              : "bg-gradient-to-r from-red-200 to-orange-200 group-hover:from-red-400 group-hover:to-orange-400"
          }`}
        />
        <div className="relative flex flex-col items-center justify-center p-4 gap-2">
          <div
            className={`rounded-xl p-2 transition-all duration-300 ${isSelected ? "bg-red-50" : "bg-gray-50 group-hover:bg-red-50"}`}
          >
            <img
              src={categoryImages[cat.name]}
              alt={cat.name}
              className="w-20 h-20 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-center text-xs font-bold text-gray-700 leading-tight px-1 group-hover:text-red-600 transition-colors">
            {cat.name}
          </p>
          {isSelected && (
            <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Browsing ▾
            </span>
          )}
        </div>
      </div>
    );
  }

  function ProductCard({ product }) {
    const qty = cart[product.id] || 0;
    const isAdding = addingProduct === product.id;
    const discount =
      product.mrp && product.sellingPrice
        ? Math.round((1 - product.sellingPrice / product.mrp) * 100)
        : 0;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* product image */}
        <div className="relative bg-gradient-to-br from-orange-50 to-red-50 p-3">
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
              {discount}% OFF
            </span>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-28 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* details */}
        <div className="p-3">
          <h4 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 mb-2">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-red-600 font-extrabold text-base">
              ₹{product.sellingPrice}
            </span>
            {product.mrp && (
              <span className="text-gray-400 text-xs line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
          {/* qty control */}
          {qty > 0 ? (
            <div className="flex items-center justify-between bg-red-50 rounded-xl px-2 py-1">
              <button
                onClick={() => decreaseQty(product.id)}
                className="w-7 h-7 rounded-lg bg-white shadow-sm text-red-600 font-bold text-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                −
              </button>
              <span className="text-sm font-extrabold text-red-600 w-6 text-center">
                {qty}
              </span>
              <button
                onClick={() => increaseQty(product.id)}
                className="w-7 h-7 rounded-lg bg-red-500 text-white font-bold text-lg flex items-center justify-center hover:bg-red-600 transition-all"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => increaseQty(product.id)}
              disabled={isAdding}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold
                hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-60
                shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.4)]"
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding…
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: "#FAFAFA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .banner-track { display:flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); }

        .product-panel {
          animation: panelOpen 0.35s cubic-bezier(.4,0,.2,1);
          transform-origin: top center;
        }
        @keyframes panelOpen {
          from { opacity:0; transform: scaleY(0.94) translateY(-10px); }
          to   { opacity:1; transform: scaleY(1)   translateY(0); }
        }

        .slide-up { animation: slideUp 0.3s cubic-bezier(.4,0,.2,1); }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity:0; }
          to   { transform: translateY(0);    opacity:1; }
        }

        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card:hover { transform: translateY(-3px); }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <img src={logo} alt="ABS Crackers" className="h-11 object-contain" />
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-500 text-white text-[10px] font-bold
                rounded-full flex items-center justify-center px-1 shadow-sm"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── BANNER SLIDER ───────────────────────────────────────────────── */}
      <section className="px-4 pt-4">
        <div
          className="relative rounded-3xl overflow-hidden shadow-lg bg-white"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            touchEndX.current = e.changedTouches[0].clientX;
            if (touchStartX.current - touchEndX.current > 50)
              setCurrentSlide((p) => (p === banners.length - 1 ? p : p + 1));
            if (touchEndX.current - touchStartX.current > 50)
              setCurrentSlide((p) => (p === 0 ? 0 : p - 1));
          }}
        >
          <div
            className="banner-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((b, i) => (
              <img
                key={i}
                src={b}
                alt="banner"
                className="w-full h-44 object-cover flex-shrink-0"
                style={{ minWidth: "100%" }}
              />
            ))}
          </div>
          {/* dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-6 h-2 bg-red-500"
                    : "w-2 h-2 bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO STRIP ──────────────────────────────────────────────────── */}
      <section className="px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-[160px] shadow-md">
          <img
            src={banner1}
            alt="Direct from Sivakasi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-100/40 via-transparent to-transparent" />
        </div>
      </section>

      {/* ── DELIVERY + COMBO CARDS ──────────────────────────────────────── */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-3">
        {[
          { img: delivery2, title: "Free Delivery", sub: "Across Tamil Nadu" },
          { img: combo, title: "Combo Boxes", sub: "Festival Packs" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-3 py-2.5">
              <p className="font-bold text-xs text-gray-800">{item.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── EXPLORE CATEGORIES ──────────────────────────────────────────── */}
      <section className="px-4 mt-8">
        {/* section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-orange-400" />
          <div>
            <p className="text-[11px] font-semibold text-red-400 uppercase tracking-widest">
              Shop By
            </p>
            <h2 className="text-xl font-extrabold text-gray-900 leading-none">
              Explore Categories
            </h2>
          </div>
        </div>

        {/* BEFORE categories */}
        <div className="grid grid-cols-2 gap-3">
          {beforeCategories.map((cat, i) => (
            <CategoryCard
              key={i}
              cat={cat}
              isSelected={selectedCategory === cat.name}
              onClick={() => handleCategoryClick(cat.name)}
            />
          ))}
        </div>

        {/* INLINE PRODUCT PANEL */}
        {selectedCategory && (
          <div ref={productSectionRef} className="product-panel mt-4">
            {/* panel header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl px-4 py-3 flex items-center justify-between mb-3 shadow-[0_4px_16px_rgba(239,68,68,0.25)]">
              <div>
                <p className="text-white/80 text-[10px] font-semibold uppercase tracking-widest">
                  Browsing
                </p>
                <h3 className="text-white font-extrabold text-sm leading-tight">
                  {selectedCategory}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setProducts([]);
                }}
                className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* products grid */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-red-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm font-medium">
                No products found in this category
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* AFTER categories */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {afterCategories.map((cat, i) => (
            <CategoryCard
              key={i}
              cat={cat}
              isSelected={selectedCategory === cat.name}
              onClick={() => handleCategoryClick(cat.name)}
            />
          ))}
        </div>
      </section>

      {/* ── FEATURES STRIP ──────────────────────────────────────────────── */}
      <section className="mt-10 px-4">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 shadow-[0_8px_32px_rgba(239,68,68,0.3)]">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <Truck size={22} />,
                title: "Timely Delivery",
                sub: "On-Time Guaranteed",
              },
              {
                icon: <Package size={22} />,
                title: "Quality Assured",
                sub: "Fine raw materials",
              },
              {
                icon: <CheckCircle size={22} />,
                title: "Safety Tested",
                sub: "Quality & safety checked",
              },
              {
                icon: <Package size={22} />,
                title: "Min Order ₹3000",
                sub: "Delivery before Diwali",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card flex items-start gap-3 bg-white/10 rounded-2xl p-3"
              >
                <div className="text-white/90 mt-0.5 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-xs leading-snug">
                    {f.title}
                  </p>
                  <p className="text-white/70 text-[10px] mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="relative bg-gray-950 text-gray-400 px-5 pt-10 pb-8 mt-10">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400" />
        <div className="mb-7">
          <h2 className="text-white text-lg font-extrabold tracking-tight">
            ABS Crackers World
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Premium quality crackers with safe and reliable delivery across
            Tamil Nadu.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm mb-7">
          <div>
            <p className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {[
                ["Home", "/"],
                ["Orders", "/orders"],
                ["Profile", "/profile"],
              ].map(([l, p]) => (
                <li
                  key={l}
                  onClick={() => navigate(p)}
                  className="hover:text-white cursor-pointer transition-colors text-sm"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              Support
            </p>
            <ul className="space-y-2.5">
              {[
                ["About Us", "/about"],
                ["Contact", "/contact"],
              ].map(([l, p]) => (
                <li
                  key={l}
                  onClick={() => navigate(p)}
                  className="hover:text-white cursor-pointer transition-colors text-sm"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-sm space-y-1.5 mb-6">
          <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
            Contact
          </p>
          <p>📞 +91 XXXXX XXXXX</p>
          <p>📍 Sivakasi, Tamil Nadu</p>
        </div>
        <div className="flex gap-3 mb-7">
          {/* Instagram */}
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-red-500 transition-all cursor-pointer">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
            </svg>
          </div>
          {/* YouTube */}
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-red-500 transition-all cursor-pointer">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.8-1.5-.8-1.9-.9C17.7 2.7 12 2.7 12 2.7h0s-5.7 0-8.8.3c-.4.1-1.2.1-1.9.9C.7 4.6.5 6.2.5 6.2S.3 8 .3 9.7v1.6C.3 13 .5 14.8.5 14.8s.2 1.6.8 2.3c.7.8 1.6.8 2 .9 1.5.1 6.7.3 6.7.3s5.7 0 8.8-.3c.4-.1 1.2-.1 1.9-.9.6-.7.8-2.3.8-2.3s.2-1.8.2-3.5V9.7c0-1.7-.2-3.5-.2-3.5zM9.7 14.3V7.7l6.4 3.3-6.4 3.3z" />
            </svg>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} ABS Crackers World. All rights reserved.
        </div>
      </footer>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100
        shadow-[0_-8px_32px_rgba(0,0,0,0.06)] flex justify-around py-1 md:hidden"
      >
        {[
          {
            icon: <User size={20} />,
            label: "Profile",
            onClick: () =>
              navigate(localStorage.getItem("token") ? "/profile" : "/login"),
          },
          {
            icon: (
              <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
            ),
            label: "Cart",
            onClick: () =>
              navigate(localStorage.getItem("token") ? "/cart" : "/login"),
          },
          {
            icon: <Truck size={20} />,
            label: "Orders",
            onClick: () =>
              navigate(localStorage.getItem("token") ? "/orders" : "/login"),
          },
          {
            icon: <Grid size={20} />,
            label: "Categories",
            onClick: () => setCategoryModalOpen(true),
          },
          {
            icon: <Menu size={20} />,
            label: "More",
            onClick: () => setMoreModalOpen(true),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-gray-400 hover:text-red-500 transition-colors active:scale-95"
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── CATEGORY MODAL ──────────────────────────────────────────────── */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCategoryModalOpen(false)}
          />
          <div className="relative bg-white w-full rounded-t-[28px] shadow-2xl p-5 max-h-[75vh] overflow-y-auto slide-up">
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-gray-900">
                Browse Categories
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCategoryModalOpen(false);
                    handleCategoryClick(cat.name);
                  }}
                  className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-3 hover:bg-red-50 transition cursor-pointer group"
                >
                  <img
                    src={categoryImages[cat.name]}
                    className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] text-center font-bold text-gray-700 group-hover:text-red-600 leading-tight">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MORE MODAL ──────────────────────────────────────────────────── */}
      {moreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMoreModalOpen(false)}
          />
          <div className="relative bg-white w-full rounded-t-[28px] shadow-2xl p-5 slide-up">
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-gray-900">
                More Options
              </h3>
              <button
                onClick={() => setMoreModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MenuItem
                icon={<Grid size={20} />}
                label="Home"
                onClick={() => navigate("/")}
              />
              {!isLoggedIn ? (
                <>
                  <MenuItem
                    icon={<User size={20} />}
                    label="Login"
                    onClick={() => navigate("/login")}
                  />
                  <MenuItem
                    icon={<User size={20} />}
                    label="Register"
                    onClick={() => navigate("/register")}
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    icon={<User size={20} />}
                    label="Profile"
                    onClick={() => navigate("/profile")}
                  />
                  <MenuItem
                    icon={<Package size={20} />}
                    label="Orders"
                    onClick={() => navigate("/orders")}
                  />
                  <MenuItem
                    icon={<Info size={20} />}
                    label="About"
                    onClick={() => navigate("/about")}
                  />
                  <MenuItem
                    icon={<Phone size={20} />}
                    label="Contact"
                    onClick={() => navigate("/contact")}
                  />
                  <MenuItem
                    icon={<LogOut size={20} />}
                    label="Logout"
                    onClick={handleLogout}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
