import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const emptyForm = {
  month: "",
  plastic_collected: "",
  plastic_recycled: "",
  volunteers: "",
};

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stats_monthly")
      .select("*")
      .order("month", { ascending: false });

    if (error) {
      console.error("Failed to load stats:", error);
      setStats([]);
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.month) return;

    setSaving(true);
    const payload = {
      month: form.month,
      plastic_collected: Number(form.plastic_collected) || 0,
      plastic_recycled: Number(form.plastic_recycled) || 0,
      volunteers: Number(form.volunteers) || 0,
    };

    const { error } = await supabase
      .from("stats_monthly")
      .upsert(payload, { onConflict: "month" });

    if (error) {
      console.error("Failed to save stats:", error);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    await fetchStats();
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({
      month: item.month || "",
      plastic_collected: item.plastic_collected ?? "",
      plastic_recycled: item.plastic_recycled ?? "",
      volunteers: item.volunteers ?? "",
    });
  };

  const handleDelete = async (item) => {
    const query = supabase.from("stats_monthly").delete();
    const { error } =
      item.id != null ? await query.eq("id", item.id) : await query.eq("month", item.month);

    if (error) {
      console.error("Failed to delete stats:", error);
      return;
    }
    setStats((prev) =>
      prev.filter((row) => (item.id != null ? row.id !== item.id : row.month !== item.month))
    );
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">📈 Monthly Stats</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <input
            type="number"
            name="plastic_collected"
            value={form.plastic_collected}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Plastic Collected"
          />
          <input
            type="number"
            name="plastic_recycled"
            value={form.plastic_recycled}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Plastic Recycled"
          />
          <input
            type="number"
            name="volunteers"
            value={form.volunteers}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Volunteers"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Stats"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Records
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats.length === 0 ? (
          <p className="text-gray-500">No stats yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.map((item) => (
              <div
                key={item.id ?? item.month}
                className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="text-sm text-gray-700">
                  <div className="font-semibold">{item.month}</div>
                  <div>Collected: {item.plastic_collected}</div>
                  <div>Recycled: {item.plastic_recycled}</div>
                  <div>Volunteers: {item.volunteers}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
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

export default StatsPage;
