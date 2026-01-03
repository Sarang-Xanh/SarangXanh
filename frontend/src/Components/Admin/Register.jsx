import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Signup = () => {
  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prev) => ({ ...prev, [name]: value }));

    // Clear error message when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { confirmPassword, ...dataToSend } = users;

    let newErrors = {};
    if (users.password !== users.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!users.name.trim()) newErrors.name = "Name is required";
    if (!users.email.trim()) newErrors.email = "Email is required";
    if (!users.password) newErrors.password = "Password is required";
    if (!users.confirmPassword) newErrors.confirmPassword = "Confirm your password";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post("/api/register", dataToSend)
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .get("/api/user", { withCredentials: true })
            .then((userRes) => {
              setUser(userRes.data);
              setAuth(true);
              navigate(`/admin/dashboard`);
            })
            .catch(() => {
              setAuth(true);
              navigate("/login");
            });
        }
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          const errorMsg = err.response.data.error?.toLowerCase() || "";
          if (errorMsg.includes("email")) {
            setErrors({ email: "Email already in use" });
          } else if (errorMsg.includes("name")) {
            setErrors({ name: "Username already taken" });
          } else {
            setErrors({ email: "Registration error" });
          }
        } else {
          setErrors({ email: "Something went wrong. Please try again." });
        }
      });
  };

  const inputClass = (field) =>
    `w-full px-4 py-2 rounded-lg border ${errors[field] ? "border-red-500" : "border-gray-300"} bg-gray-100 focus:outline-none focus:ring-2 ${
      errors[field] ? "focus:ring-red-500" : "focus:ring-black"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="hidden md:block md:w-1/2">
          <img
            src="/login.jpg"
            alt="Signup Visual"
            className="h-full w-full object-cover"
            style={{ minHeight: "400px", maxHeight: "600px" }}
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">Join us and start your journey.</p>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition mb-6">
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={users.name}
                onChange={handleChange}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              className="w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-black font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
