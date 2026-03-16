import { useEffect, useState } from "react";
import API from "../../api/api";
import { X } from "lucide-react";

function AdminStock() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("SPARKLERS");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // LOAD CATEGORIES
  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  // LOAD PRODUCTS BY CATEGORY
  const loadProducts = async (category) => {
    try {
      const res = await API.get(
        `/api/products/by-category?category=${encodeURIComponent(category)}`,
      );

      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };
  const updateStock = async (productId, newStock) => {
    if (newStock < 0) return;

    try {
      await API.put(`/api/admin/products/${productId}/stock`, {
        stock: newStock,
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
      );
    } catch (error) {
      console.error("Stock update failed", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts(selectedCategory);
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-24">
      {/* HEADER */}

      <h1 className="text-2xl font-bold mb-4">Stock Inventory</h1>

      {/* CATEGORY HEADER */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{selectedCategory}</h2>

        <button
          onClick={() => setCategoryModalOpen(true)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg"
        >
          Switch Category
        </button>
      </div>

      {/* PRODUCT LIST */}

      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-3 flex items-center gap-3"
          >
            <img
              src={p.imageUrl}
              className="w-12 h-12 object-contain border rounded"
            />

            <div className="flex-1">
              <p className="font-semibold text-sm">{p.name}</p>

              <p className="text-xs text-gray-500">MRP ₹{p.mrp}</p>

              {/* STOCK CONTROL */}

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-green-600">
                  Stock: {p.stock}
                </span>

                <button
                  onClick={() => updateStock(p.id, p.stock - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded"
                >
                  -
                </button>

                <button
                  onClick={() => updateStock(p.id, p.stock + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY MODAL */}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCategoryModalOpen(false)}
          />

          {/* MODAL */}

          <div className="relative bg-white w-full rounded-t-3xl shadow-xl p-5 max-h-[70vh] overflow-y-auto">
            {/* HEADER */}

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">
                Switch Category
              </h3>

              <button onClick={() => setCategoryModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* CATEGORY GRID */}

            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCategoryModalOpen(false);
                    loadProducts(cat.name);
                  }}
                  className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-red-50 cursor-pointer"
                >
                  <span className="text-xs text-center font-semibold">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStock;
