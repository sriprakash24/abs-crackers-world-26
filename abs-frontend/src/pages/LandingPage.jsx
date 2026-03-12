import { useNavigate } from "react-router-dom";

import { User, ShoppingCart, Truck, Grid, LogOut } from "lucide-react";

import { useEffect, useState, useRef } from "react";

import API from "../api/api";

import logo from "../assets/logo.jpg";

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

  const [cartCount, setCartCount] = useState(0);

  const productSectionRef = useRef(null);

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
      const response = await API.get(
        `/api/products/by-category?category=${encodeURIComponent(category)}`,
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const increaseQty = async (productId) => {
    try {
      await API.post(`/api/cart/add?productId=${productId}&quantity=1`);

      // update local cart state

      setCart((prev) => ({
        ...prev,

        [productId]: (prev[productId] || 0) + 1,
      }));

      // update badge

      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HEADER */}

      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="ABS Crackers" className="h-10 w-auto" />

            <span className="text-red-600 font-bold text-lg sm:text-xl">
              ABS Crackers World
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-500 text-sm"
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BANNER */}

      <section className="px-6 mt-6">
        <img
          src={banner}
          alt="Diwali Sale"
          className="rounded-xl shadow w-full object-cover"
        />
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
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-between h-48 p-4"
            >
              <img
                src={categoryImages[cat.name]}
                alt={cat.name}
                className="w-26 h-26 object-contain"
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
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow p-3"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-24 object-contain"
                  />

                  <h4 className="text-sm font-semibold mt-2">{product.name}</h4>

                  <p className="text-gray-400 text-xs line-through">
                    ₹{product.mrp}
                  </p>

                  <p className="text-red-600 font-bold">
                    ₹{product.sellingPrice}
                  </p>

                  <div className="mt-2 flex justify-center">
                    {cart[product.id] ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decreaseQty(product.id)}
                          className="bg-gray-200 px-2 rounded"
                        >
                          -
                        </button>

                        <span className="text-sm font-semibold">
                          {cart[product.id]}
                        </span>

                        <button
                          onClick={() => increaseQty(product.id)}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => increaseQty(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2 md:hidden">
        <button
          onClick={() => {
            if (!isLoggedIn) navigate("/login");
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
          onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
          className="flex flex-col items-center text-red-500 text-xs"
        >
          <Grid size={22} />

          <span>Categories</span>
        </button>
      </nav>
    </div>
  );
}

export default LandingPage;
