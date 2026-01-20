import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, isAdmin, profile, profileComplete, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(profile?.first_name || "");
    setLastName(profile?.last_name || "");
  }, [profile]);

  useEffect(() => {
    if (profileComplete) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [profileComplete, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!firstName.trim()) nextErrors.firstName = "First name is required";
    if (!lastName.trim()) nextErrors.lastName = "Last name is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError("");
    setSaving(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        name: fullName,
      })
      .eq("id", user?.id);

    if (error) {
      console.error("Failed to update profile:", error);
      setFormError(error.message || "Failed to update profile");
      setSaving(false);
      return;
    }

    await refreshProfile();
    navigate(isAdmin ? "/admin" : "/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden bg-white p-10 md:p-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete your profile
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Tell us your name to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.firstName ? "focus:ring-red-500" : "focus:ring-black"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.lastName ? "focus:ring-red-500" : "focus:ring-black"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
