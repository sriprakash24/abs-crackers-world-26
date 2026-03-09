import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/api";

function Products() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await API.get(`/api/products?category=${category}`);

      setProducts(response.data.content);
    } catch (error) {
      console.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {category} Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-32 mx-auto object-contain"
            />

            <h3 className="font-semibold mt-3 text-center">{product.name}</h3>

            <p className="text-red-500 font-bold text-center mt-2">
              ₹{product.price}
            </p>

            <button className="bg-red-500 text-white w-full mt-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
