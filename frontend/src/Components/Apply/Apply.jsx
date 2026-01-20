import React, { useState } from "react";
import Banner from "../Banner";
import { supabase } from "../../lib/supabase";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  school: "",
  motivation: "",
  location: "",
  interview_time: "",
};

const Apply = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!form.school.trim()) nextErrors.school = "School is required.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    if (!form.motivation.trim()) nextErrors.motivation = "Motivation is required.";
    if (!form.interview_time) nextErrors.interview_time = "Interview time is required.";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        school: form.school.trim(),
        motivation: form.motivation.trim(),
        location: form.location.trim(),
        interview_time: form.interview_time,
      };

      const { data, error } = await supabase
        .from("volunteer_applications")
        .insert([payload])
        .select("*")
        .single();
      if (error) throw error;

      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      console.error("Failed to submit application:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
        <Banner
          title="Apply to Volunteer"
          subtitle="Thank you for stepping up to help collect plastic waste."
          buttonText="Back to Home"
          onButtonClick={() => (window.location.href = "/")}
        />
        <div className="py-20 px-6 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-2xl w-full p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Thank you for your support!
            </h2>
            <p className="text-gray-600 mt-4">
              We received your application and will reach out to confirm your
              interview time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Apply to Volunteer"
        subtitle="Join our team of volunteers collecting plastic waste across the community."
        buttonText="Start Application"
        onButtonClick={() =>
          document
            .getElementById("apply-form")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div id="apply-form" className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Volunteer Application
          </h2>
          <p className="text-gray-600 mb-6">
            Please share your details so we can schedule a short interview and
            confirm your volunteer activity.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                School
              </label>
              <input
                name="school"
                value={form.school}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="School name"
              />
              {errors.school && (
                <p className="text-sm text-red-600 mt-1">{errors.school}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location (City/Area)
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Where are you based?"
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Motivation
              </label>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={4}
                placeholder="Why do you want to volunteer?"
              />
              {errors.motivation && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.motivation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Preferred Interview Time
              </label>
              <input
                type="datetime-local"
                name="interview_time"
                value={form.interview_time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
              {errors.interview_time && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.interview_time}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Apply;
