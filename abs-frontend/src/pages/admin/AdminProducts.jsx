import { useEffect, useState } from "react";
import API from "../../api/api";
import Swal from "sweetalert2";

function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    mrp: "",
    retailDiscountPercent: "",
    stockBoxes: "",
    imageUrl: "",
  });

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const loadProducts = async (categoryName) => {
    try {
      const res = await API.get(
        `/api/products/by-category?category=${encodeURIComponent(categoryName)}`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    if (selectedCategory === category.name) {
      setSelectedCategory(null);
      setProducts([]);
      return;
    }

    setSelectedCategory(category.name);
    await loadProducts(category.name);
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/admin/products/${id}`);
      await loadProducts(selectedCategory);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePrice = () => {
    const mrp = Number(formData.mrp);
    const discount = Number(formData.retailDiscountPercent);

    if (!mrp || !discount) return 0;

    return mrp - (mrp * discount) / 100;
  };

  const saveProduct = async () => {
    try {
      const payload = {
        name: formData.name,
        category: {
          id: formData.categoryId,
        },
        mrp: Number(formData.mrp),
        retailDiscountPercent: Number(formData.retailDiscountPercent),
        stockBoxes: Number(formData.stockBoxes),
        imageUrl: formData.imageUrl,
      };

      if (editingProduct) {
        await API.put(`/api/admin/products/${editingProduct.id}`, payload);
      } else {
        await API.post("/api/admin/products", payload);
      }

      setShowForm(false);
      setEditingProduct(null);

      if (selectedCategory) {
        loadProducts(selectedCategory);
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Manage Products</h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          setEditingProduct(null);
          setFormData({
            name: "",
            categoryId: "",
            mrp: "",
            retailDiscountPercent: "",
            stockBoxes: "",
            imageUrl: "",
          });
          setShowForm(true);
        }}
        className="fixed bottom-20 right-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg text-2xl flex items-center justify-center z-50"
      >
        +
      </button>

      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-xl border">
          <div
            onClick={() => handleCategoryClick(category)}
            className="p-3 font-semibold cursor-pointer flex justify-between"
          >
            {category.name}

            <span>{selectedCategory === category.name ? "▲" : "▼"}</span>
          </div>

          {selectedCategory === category.name && (
            <div className="border-t">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-3 border-b"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{p.sellingPrice} | Stock: {p.stock}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setFormData({
                          name: p.name,
                          categoryId:
                            categories.find((c) => c.name === p.category)?.id ||
                            "",
                          mrp: p.mrp,
                          retailDiscountPercent: p.retailDiscountPercent || "",
                          stockBoxes: p.stock || "",
                          imageUrl: p.imageUrl,
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-4 space-y-3">
            <h2 className="text-lg font-bold">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border p-2 rounded"
            />

            {/* CATEGORY DROPDOWN */}
            <div className="relative">
              <div
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full border p-2 rounded cursor-pointer bg-white"
              >
                {categories.find((c) => c.id === formData.categoryId)?.name ||
                  "Select Category"}
              </div>

              {categoryOpen && (
                <div className="absolute left-0 right-0 bg-white border rounded shadow max-h-60 overflow-y-auto z-50">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          categoryId: c.id,
                        });
                        setCategoryOpen(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="MRP"
              type="number"
              className="w-full border p-2 rounded"
            />

            <input
              name="retailDiscountPercent"
              value={formData.retailDiscountPercent}
              onChange={handleChange}
              placeholder="Retail Discount %"
              type="number"
              className="w-full border p-2 rounded"
            />

            <input
              name="stockBoxes"
              value={formData.stockBoxes}
              onChange={handleChange}
              placeholder="Stock Boxes"
              type="number"
              className="w-full border p-2 rounded"
            />

            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-2 rounded"
            />

            {/* IMAGE PREVIEW */}
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                className="w-24 rounded"
              />
            )}

            {/* PRICE PREVIEW */}
            <p className="text-sm text-gray-600">
              Calculated Selling Price: ₹{calculatePrice()}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveProduct}
                className="flex-1 bg-green-500 text-white p-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 p-2 rounded"
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
