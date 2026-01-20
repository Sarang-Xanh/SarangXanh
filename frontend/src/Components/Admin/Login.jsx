import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    // Clear specific field error as user types
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleGoogleLogin = async () => {
    setFormError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });

    if (error) {
      console.error("Google login error:", error);
      setFormError(error.message || "Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
      setFormError(error.message || "Login failed");
      return;
    }

    navigate("/admin");
  };

  const inputClass = (field) =>
    `w-full px-4 py-2 rounded-lg border ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } bg-gray-100 focus:outline-none focus:ring-2 ${
      errors[field] ? "focus:ring-red-500" : "focus:ring-black"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/bg.jpg"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10 md:p-14">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-500 text-sm mb-8">Welcome back!</p>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition mb-6"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-sm text-gray-700">
              Log in with Google
            </span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-4 text-sm text-gray-400">
              OR LOG IN WITH EMAIL
            </span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p>
            )}
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className={inputClass("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            OR{" "}
            <Link
              to="/signup"
              className="text-black font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
