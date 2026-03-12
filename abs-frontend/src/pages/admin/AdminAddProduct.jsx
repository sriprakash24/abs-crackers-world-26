import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const saveProduct = async () => {
    try {
      await API.post("/api/admin/products", product);
      navigate("/admin/products");
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">Add Product</h1>

      <input
        name="name"
        placeholder="Product name"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="mrp"
        placeholder="MRP"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="sellingPrice"
        placeholder="Selling price"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="stock"
        placeholder="Stock"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="imageUrl"
        placeholder="Image URL"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={saveProduct}
        className="w-full bg-green-500 text-white py-2 rounded-lg"
      >
        Save Product
      </button>
    </div>
  );
}

export default AdminAddProduct;
