import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const typeOptions = ["News", "Paper", "Report"];

const AdminResearch = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: "News",
    title: "",
    description: "",
    source: "",
    date: "",
    link: "",
  });

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [items]
  );

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("research")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Failed to load research:", error);
        setItems([]);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    setSubmitting(true);
    const payload = {
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      source: form.source.trim(),
      date: form.date,
      link: form.link.trim(),
    };

    if (editingId) {
      const { error } = await supabase
        .from("research")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error("Failed to update research:", error);
        setSubmitting(false);
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      );
      setEditingId(null);
    } else {
      const { data, error } = await supabase
        .from("research")
        .insert([payload])
        .select("*")
        .single();

      if (error) {
        console.error("Failed to create research:", error);
        setSubmitting(false);
        return;
      }

      setItems((prev) => [data, ...prev]);
    }

    setForm({
      type: "News",
      title: "",
      description: "",
      source: "",
      date: "",
      link: "",
    });
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("research").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete research:", error);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      type: item.type || "News",
      title: item.title || "",
      description: item.description || "",
      source: item.source || "",
      date: item.date || "",
      link: item.link || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      type: "News",
      title: "",
      description: "",
      source: "",
      date: "",
      link: "",
    });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">📚 Research Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
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
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="3"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60"
          >
            {submitting ? "Saving..." : editingId ? "Update Research" : "Add Research"}
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
          Existing Research
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : sortedItems.length === 0 ? (
          <p className="text-gray-500">No research items yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <div className="text-sm text-blue-600 font-medium">
                    {item.type}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {item.source} •{" "}
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
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

export default AdminResearch;
