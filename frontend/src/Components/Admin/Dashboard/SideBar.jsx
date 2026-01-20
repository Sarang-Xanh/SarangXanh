import React, { useState } from "react";
import {
  Smile,
  Home,
  Clock,
  BarChart3,
  Image,
  Users,
  User,
  LogOut,
  BookOpen,
  FileText,
  Mail,
} from "lucide-react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Failed to sign out:", error);
      return;
    }
    setShowLogoutModal(false);
    navigate("/");
  };

  // ✅ Shared style for menu items
  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 
    ${
      isActive
        ? "bg-white shadow-md text-gray-900" // ✅ White background, subtle shadow
        : "hover:bg-gray-100 text-gray-700"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-gray-50 p-4 flex flex-col justify-between">
      {/* Logo Section */}
      <div>
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
            <Smile className="w-5 h-5 text-gray-700" />
          </div>
          <h1 className="text-lg font-bold">SarangXanh Admin</h1>
        </Link>

        {/* Dashboard */}
        <ul className="space-y-2">
          <li>
            <NavLink to="/admin" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </span>
                  Dashboard
                </>
              )}
            </NavLink>
          </li>
        </ul>

        {/* Website Data Section */}
        <h2 className="mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Website Data
        </h2>
        <ul className="space-y-2">
          {/* Timeline */}
          <li>
            <NavLink to="/admin/timeline" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </span>
                  Timeline
                </>
              )}
            </NavLink>
          </li>

          {/* Stats */}
          <li>
            <NavLink to="/admin/stats" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </span>
                  Stats
                </>
              )}
            </NavLink>
          </li>

          {/* Gallery */}
          <li>
            <NavLink to="/admin/gallery" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Image className="w-4 h-4" />
                  </span>
                  Gallery
                </>
              )}
            </NavLink>
          </li>

          {/* Members */}
          <li>
            <NavLink to="/admin/members" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </span>
                  Members
                </>
              )}
            </NavLink>
          </li>

          {/* Research */}
          <li>
            <NavLink to="/admin/research" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </span>
                  Research
                </>
              )}
            </NavLink>
          </li>

          {/* Applications */}
          <li>
            <NavLink to="/admin/applications" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </span>
                  Applications
                </>
              )}
            </NavLink>
          </li>

          {/* Donation Notify */}
          <li>
            <NavLink to="/admin/donation-notify" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </span>
                  Donation Notify
                </>
              )}
            </NavLink>
          </li>
        </ul>

      </div>

      {/* Footer: Profile + Logout */}
      <div className="space-y-2">
        {/* Profile Button */}
        <button className="flex items-center gap-3 w-full hover:bg-gray-100 px-3 py-2 rounded-xl">
          <span className="bg-white p-2 rounded-lg">
            <User className="w-4 h-4 text-gray-700" />
          </span>
          {user?.email || "Account"}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full hover:bg-red-50 px-3 py-2 rounded-xl text-red-600 transition"
        >
          <span className="bg-white p-2 rounded-lg">
            <LogOut className="w-4 h-4 text-red-600" />
          </span>
          Log Out
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close logout modal"
            onClick={() => setShowLogoutModal(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-gray-900">Log out?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
