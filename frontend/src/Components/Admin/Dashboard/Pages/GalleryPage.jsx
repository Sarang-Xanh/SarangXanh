import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Upload,
  Pencil,
  Save,
  Plus,
  X,
  Image,
} from "lucide-react";

const GalleryPage = () => {
  const [gallery, setGallery] = useState({});
  const [newItem, setNewItem] = useState({
    year: "",
    title: "",
    description: "",
    file: null,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/gallery`, {
        withCredentials: true,
      });
      setGallery(res.data || {});
    } catch (err) {
      alert("❌ Failed to load gallery.");
    }
  };

  const handleUploadImage = async (file) => {
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (err) {
      alert("❌ Failed to upload image.");
      throw err;
    }
  };

  const handleAdd = async () => {
    if (!newItem.file || !newItem.year || newItem.year >= 2100) {
      alert("⚠️ Enter a valid year and select an image.");
      return;
    }
    setLoading(true);
    try {
      const image_url = await handleUploadImage(newItem.file);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/gallery`, {
        year: newItem.year,
        title: newItem.title,
        description: newItem.description,
        image_url,
      }, {
        withCredentials: true,
      });
      alert("✅ Item added!");
      setNewItem({ year: "", title: "", description: "", file: null });
      fetchGallery();
    } catch {
      alert("❌ Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/gallery/${id}`, {
        withCredentials: true,
      });
      fetchGallery();
    } catch {
      alert("❌ Failed to delete item.");
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleEditSave = async () => {
    if (editingItem.year >= 2100) {
      alert("⚠️ Enter a valid year.");
      return;
    }
    setLoading(true);
    try {
      let image_url = editingItem.image_url;
      if (editFile) image_url = await handleUploadImage(editFile);
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/gallery/${editingItem.id}`, {
        ...editingItem,
        image_url,
      }, {
        withCredentials: true,
      });
      alert("✅ Item updated!");
      setShowModal(false);
      setEditFile(null);
      setEditingItem(null);
      fetchGallery();
    } catch {
      alert("❌ Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-10">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Image className="w-5 h-5 text-gray-800" /> Gallery Admin
      </h2>

      {/* Add New Item */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Item
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Year"
            value={newItem.year}
            max={2099}
            onChange={(e) =>
              setNewItem({ ...newItem, year: parseInt(e.target.value) })
            }
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Title"
            value={newItem.title}
            onChange={(e) =>
              setNewItem({ ...newItem, title: e.target.value })
            }
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="file"
            onChange={(e) =>
              setNewItem({ ...newItem, file: e.target.files[0] })
            }
            className="border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-700 transition"
          disabled={loading}
        >
          <Upload className="w-4 h-4 inline mr-1" /> {loading ? "Uploading..." : "Add"}
        </button>
      </div>

      {/* Gallery Items */}
      {Object.keys(gallery)
        .sort((a, b) => b - a)
        .map((year) => (
          <div key={year} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">{year}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.isArray(gallery[year]) &&
                gallery[year].map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 p-3 rounded-xl bg-white shadow hover:shadow-lg transition hover:scale-[1.01]"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {item.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-gray-800"
                      >
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-full hover:scale-110 hover:shadow-md transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

      {/* Modal for Edit */}
      {showModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            {editFile ? (
              <img
                src={URL.createObjectURL(editFile)}
                alt="Preview"
                className="rounded-lg mb-4 w-full h-auto object-cover"
              />
            ) : (
              <img
                src={editingItem.image_url}
                alt="Preview"
                className="rounded-lg mb-4 w-full h-auto object-cover max-h-64"
              />
            )}
            <input
              type="number"
              value={editingItem.year}
              onChange={(e) =>
                setEditingItem({ ...editingItem, year: parseInt(e.target.value) })
              }
              max={2099}
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />
            <input
              placeholder="Title"
              value={editingItem.title}
              onChange={(e) =>
                setEditingItem({ ...editingItem, title: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              rows={5}
              className="border border-gray-300 p-2 rounded-lg w-full mb-3 resize-y"
            />
            <input
              type="file"
              onChange={(e) => setEditFile(e.target.files[0])}
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Save className="w-4 h-4 inline" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
