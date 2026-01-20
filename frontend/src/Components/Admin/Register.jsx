import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prev) => ({ ...prev, [name]: value }));

    // Clear error message when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoogleSignup = async () => {
    setFormError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });

    if (error) {
      console.error("Google signup error:", error);
      setFormError(error.message || "Google signup failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const trimmedEmail = users.email.trim();
    const { confirmPassword, ...dataToSend } = users;
    dataToSend.email = trimmedEmail;

    let newErrors = {};
    if (users.password !== users.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!users.firstName.trim()) newErrors.firstName = "First name is required";
    if (!users.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!trimmedEmail) newErrors.email = "Email is required";
    if (!users.password) newErrors.password = "Password is required";
    if (!users.confirmPassword) newErrors.confirmPassword = "Confirm your password";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullName = `${users.firstName.trim()} ${users.lastName.trim()}`.trim();
    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: dataToSend.password,
      options: {
        data: {
          name: fullName,
          first_name: users.firstName.trim(),
          last_name: users.lastName.trim(),
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      const message = error.message?.toLowerCase() || "";
      if (message.includes("already") || message.includes("exists")) {
        setErrors({ email: "Email already in use" });
      } else if (message) {
        setFormError(error.message);
      } else {
        setErrors({ email: "Registration error" });
      }
      return;
    }

    navigate("/login");
  };

  const inputClass = (field) =>
    `w-full px-4 py-2 rounded-lg border ${errors[field] ? "border-red-500" : "border-gray-300"} bg-gray-100 focus:outline-none focus:ring-2 ${
      errors[field] ? "focus:ring-red-500" : "focus:ring-black"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="w-full p-10 md:p-14">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">Join us and start your journey.</p>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition mb-6"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-sm text-gray-700">Sign up with Google</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-4 text-sm text-gray-400">OR SIGN UP WITH EMAIL</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p>
            )}
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={users.firstName}
                onChange={handleChange}
                className={inputClass("firstName")}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={users.lastName}
                onChange={handleChange}
                className={inputClass("lastName")}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={users.email}
                onChange={handleChange}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={users.password}
                onChange={handleChange}
                className={inputClass("password")}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={users.confirmPassword}
                onChange={handleChange}
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
