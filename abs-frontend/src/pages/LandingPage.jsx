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

import banner from "../assets/banner/diwali-banner.jpg";

import delivery from "../assets/banner/free-delivery.jpg";

import combo from "../assets/banner/combo-box.jpg";

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

  const banners = [banner, delivery, combo]; // add more if needed

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
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
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
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      const res = await API.get("/categories");

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
      setProductsLoading(false); // STOP SPINNER
    }
  };

  const increaseQty = async (productId) => {
    try {
      setAddingProduct(productId);

      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);

      setCart((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));

      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Add to cart failed", error);
    } finally {
      setAddingProduct(null);
    }
  };

  // const increaseQty = async (productId) => {
  //   try {
  //     await API.post(`/api/cart/add?productId=${productId}&quantity=1`);

  //     // update local cart state

  //     setCart((prev) => ({
  //       ...prev,

  //       [productId]: (prev[productId] || 0) + 1,
  //     }));

  //     // update badge

  //     setCartCount((prev) => prev + 1);
  //   } catch (error) {
  //     console.error("Add to cart failed", error);
  //   }
  // };

  const decreaseQty = async (productId) => {
    const currentQty = cart[productId] || 0;

    try {
      if (currentQty <= 1) {
        // remove item completely

        await API.delete(`/api/cart/remove?productId=${productId}`);

        setCart((prev) => {
          const updated = { ...prev };

          delete updated[productId];

          return updated;
        });
      } else {
        // decrease quantity

        await API.put(
          `/api/cart/update?productId=${productId}&quantity=${currentQty - 1}`,
        );

        setCart((prev) => ({
          ...prev,

          [productId]: currentQty - 1,
        }));
      }

      setCartCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Decrease failed", error);
    }
  };

  function MenuItem({ icon, label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-red-50 transition"
      >
        <div className="text-red-500">{icon}</div>
        <span className="text-xs font-semibold">{label}</span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 min-h-screen pb-20">
      {/* HEADER */}

      <header className="bg-white/70 backdrop-blur-md border-b border-orange-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          {/* LOGO ONLY */}
          <div className="flex items-center cursor-pointer">
            <img
              src={logo}
              alt="ABS Crackers"
              className="h-12 object-contain"
            />
          </div>

          {/* HAMBURGER MENU */}
          <div className="relative">
            <button
              onClick={() => navigate("/cart")}
              className="relative text-red-500"
            >
              <ShoppingCart size={26} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* BANNER */}

      <section className="px-6 mt-6">
        <div className="relative overflow-hidden rounded-3xl shadow-lg">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
            onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              touchEndX.current = e.changedTouches[0].clientX;

              if (touchStartX.current - touchEndX.current > 50) {
                setCurrentSlide((prev) =>
                  prev === banners.length - 1 ? prev : prev + 1,
                );
              }

              if (touchEndX.current - touchStartX.current > 50) {
                setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));
              }
            }}
          >
            {banners.map((b, index) => (
              <img
                key={index}
                src={b}
                alt="banner"
                className="w-full h-44 object-contain flex-shrink-0"
              />
            ))}
          </div>

          {/* DOTS */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === i ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY + COMBO */}

      <section className="grid grid-cols-2 gap-4 px-6 mt-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img src={delivery} alt="Free Delivery" />

          <div className="p-3">
            <h3 className="font-semibold">Free Delivery</h3>

            <p className="text-sm text-gray-500">Across TamilNadu</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img src={combo} alt="Combo Boxes" />

          <div className="p-3">
            <h3 className="font-semibold">Combo Boxes</h3>

            <p className="text-sm text-gray-500">Festival Special Packs</p>
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}

      <section className="px-6 mt-12">
        <h2 className="text-4xl font-bold text-gray-200 mb-8">
          Explore Categories
        </h2>

        {/* BEFORE CATEGORIES */}

        <div className="grid grid-cols-2 gap-6">
          {beforeCategories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="relative bg-white rounded-3xl shadow-lg border border-orange-100 hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-between h-48 p-4 overflow-hidden"
            >
              <img
                src={categoryImages[cat.name]}
                alt={cat.name}
                className="w-28 h-28 object-contain"
              />

              <h3 className="text-center text-sm font-semibold text-gray-700 leading-tight px-1">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

        {/* PRODUCTS SECTION (FIXED POSITION) */}

        {selectedCategory && (
          <div ref={productSectionRef} className="col-span-2 mt-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-[2px] bg-gray-200"></div>

              <h3 className="px-4 text-xl font-bold text-red-600 tracking-wide">
                {selectedCategory}
              </h3>

              <div className="flex-1 h-[2px] bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {productsLoading ? (
                <div className="col-span-2 flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent"></div>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-24 object-contain"
                    />

                    <h4 className="text-sm font-semibold mt-2">
                      {product.name}
                    </h4>

                    <p className="text-gray-400 text-xs line-through">
                      ₹{product.mrp}
                    </p>

                    <p className="text-red-600 font-bold text-lg">
                      ₹{product.sellingPrice}
                    </p>

                    <div className="mt-2 flex justify-center">
                      {cart[product.id] ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decreaseQty(product.id)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded"
                          >
                            -
                          </button>

                          <span className="text-sm font-semibold">
                            {cart[product.id]}
                          </span>

                          <button
                            onClick={() => increaseQty(product.id)}
                            className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => increaseQty(product.id)}
                          disabled={addingProduct === product.id}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {addingProduct === product.id ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Adding
                            </span>
                          ) : (
                            "Add"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AFTER CATEGORIES */}

        <div className="grid grid-cols-2 gap-6 mt-8">
          {afterCategories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={categoryImages[cat.name]}
                alt={cat.name}
                className="w-full h-32 object-contain p-4"
              />

              <div className="text-center pb-4">
                <h3 className="font-semibold text-gray-700">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE NAV */}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around py-2 md:hidden">
        <button
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) {
              navigate("/login");
            } else {
              navigate("/profile");
            }
          }}
          className="flex flex-col items-center text-red-500 text-xs"
        >
          <User size={22} />

          <span>User</span>
        </button>

        <button
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) {
              navigate("/login");
            } else {
              navigate("/cart");
            }
          }}
          className="flex flex-col items-center text-red-500 text-xs relative"
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-green-500 text-white text-[10px] px-1 rounded-full">
              {cartCount}
            </span>
          )}

          <span>Cart</span>
        </button>

        <button
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) {
              navigate("/login");
            } else {
              navigate("/orders");
            }
          }}
          className="flex flex-col items-center text-red-500 text-xs"
        >
          <Truck size={22} />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setCategoryModalOpen(true)}
          className="flex flex-col items-center text-red-500 text-xs"
        >
          <Grid size={22} />

          <span>Categories</span>
        </button>
        {/* MORE */}
        <button
          onClick={() => setMoreModalOpen(true)}
          className="flex flex-col items-center text-red-500 text-xs"
        >
          <Menu size={22} />
          <span>More</span>
        </button>
      </nav>

      {/* CATEGORY MODAL */}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCategoryModalOpen(false)}
          ></div>

          {/* MODAL */}

          <div className="relative bg-white w-full rounded-t-3xl shadow-xl p-5 max-h-[70vh] overflow-y-auto animate-slide-up">
            {/* HEADER */}

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">
                Browse Categories
              </h3>

              <button onClick={() => setCategoryModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* CATEGORY GRID */}

            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCategoryModalOpen(false);
                    handleCategoryClick(cat.name);
                  }}
                  className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-red-50 transition cursor-pointer"
                >
                  <img
                    src={categoryImages[cat.name]}
                    className="w-14 h-14 object-contain"
                  />

                  <span className="text-xs text-center font-semibold">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {moreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMoreModalOpen(false)}
          ></div>

          {/* MODAL */}
          <div className="relative bg-white w-full rounded-t-3xl shadow-xl p-5 animate-slide-up">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">More Options</h3>

              <button onClick={() => setMoreModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* MENU GRID */}
            <div className="grid grid-cols-3 gap-4">
              <MenuItem
                icon={<Grid />}
                label="Home"
                onClick={() => navigate("/")}
              />

              {!isLoggedIn ? (
                <>
                  <MenuItem
                    icon={<User />}
                    label="Login"
                    onClick={() => navigate("/login")}
                  />
                  <MenuItem
                    icon={<User />}
                    label="Register"
                    onClick={() => navigate("/register")}
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    icon={<User />}
                    label="Profile"
                    onClick={() => navigate("/profile")}
                  />
                  <MenuItem
                    icon={<Package />}
                    label="Orders"
                    onClick={() => navigate("/orders")}
                  />
                  <MenuItem
                    icon={<Info />}
                    label="About"
                    onClick={() => navigate("/about")}
                  />
                  <MenuItem
                    icon={<Phone />}
                    label="Contact"
                    onClick={() => navigate("/contact")}
                  />
                  <MenuItem
                    icon={<LogOut />}
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
