import React, { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

const DonationNotifyPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("donation_notify")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load donation notify list:", error);
        setEmails([]);
      } else {
        setEmails(data || []);
      }
      setLoading(false);
    };

    fetchEmails();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this email?");
    if (!confirmDelete) return;

    setDeletingId(id);
    const { error } = await supabase
      .from("donation_notify")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete email:", error);
      setDeletingId(null);
      return;
    }

    setEmails((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        📩 Donation Notify List
      </h1>

      {emails.length === 0 ? (
        <p className="text-gray-500">No emails collected yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-gray-800">{item.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationNotifyPage;
