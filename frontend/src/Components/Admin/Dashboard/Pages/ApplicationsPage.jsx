import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Failed to load applications:", error);
        setApplications([]);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const handleDelete = async (appId) => {
    const confirmDelete = window.confirm(
      "Delete this application? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeletingId(appId);
    const { error } = await supabase
      .from("volunteer_applications")
      .delete()
      .eq("id", appId);

    if (error) {
      console.error("Failed to delete application:", error);
      setDeletingId(null);
      return;
    }

    setApplications((prev) => prev.filter((app) => app.id !== appId));
    setDeletingId(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        📝 Volunteer Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {app.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {app.email} · {app.phone}
                  </p>
                  <p className="text-sm text-gray-600">{app.school}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Location:</span>{" "}
                    {app.location}
                  </div>
                  <div>
                    <span className="font-semibold">Interview:</span>{" "}
                    {app.interview_time
                      ? new Date(app.interview_time).toLocaleString()
                      : "Not set"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(app.id)}
                    disabled={deletingId === app.id}
                    className="mt-3 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 disabled:text-red-300"
                  >
                    {deletingId === app.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">
                {app.motivation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
