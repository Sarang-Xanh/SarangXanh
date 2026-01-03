import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";

const AdminData = () => {
  const [data, setData] = useState(null);
  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [editEvent, setEditEvent] = useState({
    date: "",
    title: "",
    description: "",
    image: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data`, { withCredentials: true });
    setData(res.data);
    setLoading(false);
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data.imageUrl;
    } catch (err) {
      alert("❌ Failed to upload image");
      return "";
    }
  };

  const handleMonthlyChange = (month, field, value) => {
    const updated = data.monthlyStats.map((m) =>
      m.month === month ? { ...m, [field]: value } : m
    );
    setData({ ...data, monthlyStats: updated });
  };

  const handleAddEvent = async () => {
    if (!newEvent.date || !newEvent.title || !newEvent.description) {
      alert("⚠️ Please fill in all fields before adding!");
      return;
    }
    let uploadedImageUrl = "";
    if (imageFile) uploadedImageUrl = await uploadImage(imageFile);

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/data/timeline`,
      { ...newEvent, image: uploadedImageUrl },
      { withCredentials: true }
    );

    setNewEvent({ date: "", title: "", description: "", image: "" });
    setImageFile(null);
    fetchData();
  };

  const handleDeleteEvent = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/data/timeline/${id}`, { withCredentials: true });
    fetchData();
  };

  const startEdit = (event) => {
    setEditEventId(event.id);
    setEditEvent(event);
    setShowEditModal(true);
  };

  const saveEditEvent = async () => {
    if (!editEvent.date || !editEvent.title || !editEvent.description) {
      alert("⚠️ Please fill in all fields before saving!");
      return;
    }
    let uploadedImageUrl = editEvent.image;
    if (editImageFile) uploadedImageUrl = await uploadImage(editImageFile);

    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/data/timeline/${editEventId}`,
      { ...editEvent, image: uploadedImageUrl },
      { withCredentials: true }
    );
    setEditEventId(null);
    setEditImageFile(null);
    setShowEditModal(false);
    fetchData();
  };

  const cancelEdit = () => {
    setEditEventId(null);
    setEditImageFile(null);
    setShowEditModal(false);
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {loading ? <Loader2 className="animate-spin" /> : "Loading..."}
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-14">
      {/* Monthly Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-gray-800">
          <FileText className="w-5 h-5 text-gray-900" /> Monthly Stats
        </h2>

        <div className="max-h-[420px] overflow-y-auto pr-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="text-left p-3">Month</th>
                <th className="text-center">Trash</th>
                <th className="text-center">Recycled</th>
                <th className="text-center">Volunteers</th>
                <th className="text-center">Save</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyStats.map((m) => (
                <tr
                  key={m.month}
                  className="border-b transition hover:shadow-md hover:scale-[1.01] duration-150"
                >
                  <td className="p-3 font-medium text-gray-800">{m.month}</td>
                  {["plastic_collected", "plastic_recycled", "volunteers"].map(
                    (field) => (
                      <td key={field} className="text-center">
                        <input
                          type="number"
                          value={m[field]}
                          onChange={(e) =>
                            handleMonthlyChange(m.month, field, e.target.value)
                          }
                          className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-center"
                        />
                      </td>
                    )
                  )}
                  <td className="text-center">
                    <button
                      className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition"
                      onClick={() => {
                        const current = data.monthlyStats.find(
                          (x) => x.month === m.month
                        );
                        axios
                          .put(
                            `${import.meta.env.VITE_API_BASE_URL}/data/monthly/${m.month}`,
                            {
                              month: m.month,
                              plastic_collected: current.plastic_collected,
                              plastic_recycled: current.plastic_recycled,
                              volunteers: current.volunteers,
                            },
                            { withCredentials: true }
                          )
                          .then(fetchData)
                          .then(() =>
                            alert("✅ Successfully updated monthly stats!")
                          )
                          .catch(() =>
                            alert("❌ Failed to update monthly stats")
                          );
                      }}
                    >
                      <Save className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
          <Calendar className="w-5 h-5 text-gray-900" /> Timeline Events
        </h2>

        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
          {[...data.timeline]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 p-4 rounded-xl transition hover:shadow-md hover:scale-[1.01] duration-150"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {event.date} – {event.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {event.description}
                    </p>
                    {event.image && (
                      <img
                        src={event.image}
                        alt=""
                        className="mt-2 w-32 rounded-lg shadow"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 items-center">
                    <button
                      onClick={() => startEdit(event)}
                      className="bg-gray-100 px-4 py-1.5 rounded-lg hover:bg-gray-200 text-gray-800 transition"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 hover:scale-110 hover:shadow-md transition rounded-full"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Add new event */}
        <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-gray-800">
          <Plus className="w-5 h-5 text-gray-900" /> Add New Event
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-lg"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            placeholder="Title"
            className="border border-gray-300 p-2 rounded-lg"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <input
            placeholder="Description"
            className="border border-gray-300 p-2 rounded-lg"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 p-2 rounded-lg"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button
          onClick={handleAddEvent}
          className="bg-gray-800 text-white px-5 py-2 rounded-xl mt-4 hover:bg-gray-700 transition"
        >
          <Plus className="w-4 h-4 inline" /> Add Event
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <button
              onClick={cancelEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {editImageFile ? (
              <img
                src={URL.createObjectURL(editImageFile)}
                alt="Preview"
                className="rounded-lg mb-4 w-full h-auto object-cover"
              />
            ) : editEvent.image ? (
              <img
                src={editEvent.image}
                alt="Preview"
                className="rounded-lg mb-4 w-full h-auto object-cover"
              />
            ) : null}

            <input
              type="date"
              value={editEvent.date}
              onChange={(e) =>
                setEditEvent({ ...editEvent, date: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />
            <input
              placeholder="Title"
              value={editEvent.title}
              onChange={(e) =>
                setEditEvent({ ...editEvent, title: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={editEvent.description}
              onChange={(e) =>
                setEditEvent({ ...editEvent, description: e.target.value })
              }
              rows={5}
              className="border border-gray-300 p-2 rounded-lg w-full mb-3 resize-y"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files[0])}
              className="border border-gray-300 p-2 rounded-lg w-full mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEditEvent}
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

export default AdminData;
