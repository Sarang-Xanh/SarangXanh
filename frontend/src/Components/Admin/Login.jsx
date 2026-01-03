import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    // Clear specific field error as user types
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/login`, values, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          setUser({
            name: res.data.user.name,
            email: res.data.user.email,
            id: res.data.user.id,
          });
          navigate(`/admin/dashboard`);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setErrors({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        } else {
          setErrors({ email: "Something went wrong. Please try again." });
        }
      });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand</h1>
          <p className="text-gray-500 text-sm mb-8">Welcome back!</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot Password? Asks Hieu :)
                </a>
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
            <a
              href="/signup"
              className="text-black font-medium hover:underline"
            >
              =)) IDK
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
