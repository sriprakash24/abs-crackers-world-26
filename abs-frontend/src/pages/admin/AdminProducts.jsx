import { useEffect, useState } from "react";
import API from "../../api/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await API.get("/api/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/api/admin/products/${id}`);
      loadProducts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Manage Products</h1>

        <button className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm">
          Add
        </button>
      </div>

      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-24 object-contain"
          />

          <h3 className="font-semibold mt-2">{p.name}</h3>

          <p className="text-xs text-gray-400 line-through">₹{p.mrp}</p>

          <p className="text-red-600 font-bold text-lg">₹{p.sellingPrice}</p>

          <p className="text-xs text-gray-500">Stock: {p.stock}</p>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-sm">
              Edit
            </button>

            <button
              onClick={() => deleteProduct(p.id)}
              className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;
