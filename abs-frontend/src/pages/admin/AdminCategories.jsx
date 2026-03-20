import { useEffect, useState } from "react";
import API from "../../api/api";
import Swal from "sweetalert2";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load categories", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ✅ Add Category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      return Swal.fire("Warning", "Category name required", "warning");
    }

    try {
      await API.post("/categories", { name: newCategory });
      setNewCategory("");
      Swal.fire("Success", "Category added", "success");
      loadCategories();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Add failed", "error");
    }
  };

  // ✅ Update Category
  const updateCategory = async (id) => {
    try {
      await API.put(`/categories/${id}`, {
        name: editingName,
        active: true,
      });
      setEditingId(null);
      Swal.fire("Updated", "Category updated", "success");
      loadCategories();
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // ✅ Toggle Active
  const toggleStatus = async (id, active) => {
    const action = active ? "deactivate" : "activate";

    try {
      await API.patch(`/categories/${id}/${action}`);
      Swal.fire("Success", `Category ${action}d`, "success");
      loadCategories();
    } catch (err) {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>

      {/* Add Category */}
      <div className="flex gap-3 bg-white p-4 rounded-xl shadow">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name..."
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={addCategory}
          className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div className="flex flex-col">
              {editingId === c.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border p-1 rounded"
                />
              ) : (
                <span className="font-semibold text-gray-800">{c.name}</span>
              )}

              <span
                className={`text-xs mt-1 ${
                  c.active ? "text-green-500" : "text-red-500"
                }`}
              >
                {c.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              {editingId === c.id ? (
                <button
                  onClick={() => updateCategory(c.id)}
                  className="text-green-600"
                >
                  Save
                </button>
              ) : (
                <Pencil
                  size={18}
                  className="cursor-pointer text-blue-500"
                  onClick={() => {
                    setEditingId(c.id);
                    setEditingName(c.name);
                  }}
                />
              )}

              {c.active ? (
                <XCircle
                  size={18}
                  className="cursor-pointer text-red-500"
                  onClick={() => toggleStatus(c.id, true)}
                />
              ) : (
                <CheckCircle
                  size={18}
                  className="cursor-pointer text-green-500"
                  onClick={() => toggleStatus(c.id, false)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;
