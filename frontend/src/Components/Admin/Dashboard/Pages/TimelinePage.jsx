import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const emptyForm = {
  event_date: "",
  title: "",
  description: "",
  image_url: "",
};

const TimelinePage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timeline")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Failed to load timeline:", error);
      setItems([]);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = `timeline/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("public-media")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.event_date || !form.title.trim() || !form.description.trim()) {
      return;
    }

    setSaving(true);
    try {
      let image_url = form.image_url || "";
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const payload = {
        event_date: form.event_date,
        title: form.title.trim(),
        description: form.description.trim(),
        image_url,
      };

      if (editingId) {
        const { error } = await supabase
          .from("timeline")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("timeline").insert([payload]);
        if (error) throw error;
      }

      setForm(emptyForm);
      setImageFile(null);
      setEditingId(null);
      await fetchItems();
    } catch (error) {
      console.error("Failed to save timeline item:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      event_date: item.event_date || "",
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
    });
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("timeline").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete timeline item:", error);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">🕒 Timeline Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60"
          >
            {editingId ? "Update Event" : "Add Event"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Timeline Events
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No timeline events yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full md:w-64 rounded-lg border border-gray-200"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
