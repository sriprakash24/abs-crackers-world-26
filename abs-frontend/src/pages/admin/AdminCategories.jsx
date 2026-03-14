import { useEffect, useState } from "react";
import API from "../../api/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    try {
      await API.post("/api/admin/categories", { name: newCategory });
      setNewCategory("");
      loadCategories();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await API.put(`/api/admin/categories/${id}`, { name });
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/api/admin/categories/${id}`);
      loadCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Manage Categories</h1>

      <div className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addCategory}
          className="bg-green-500 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      {categories.map((c) => (
        <div
          key={c.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          {editingId === c.id ? (
            <input
              defaultValue={c.name}
              onBlur={(e) => updateCategory(c.id, e.target.value)}
              className="border p-1 rounded"
            />
          ) : (
            <span>{c.name}</span>
          )}

          <div className="flex gap-3 text-sm">
            <button
              onClick={() => setEditingId(c.id)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={() => deleteCategory(c.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCategories;
