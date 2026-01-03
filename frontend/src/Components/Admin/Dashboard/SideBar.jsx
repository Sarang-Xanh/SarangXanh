import React, { useContext } from "react";
import {
  Smile,
  Home,
  Table,
  Image,
  Users,
  User,
  LogOut,
  Pencil,
} from "lucide-react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setAuth, user, setUser, setWasLoggedInBefore } =
    useContext(AuthContext);

  const handleLogout = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true })
      .then(() => {
        setAuth(false);
        setUser({});
        setWasLoggedInBefore(false);
        navigate("/");
      })
      .catch((err) => console.log(err));
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
          <h1 className="text-lg font-bold">SarangXanh</h1>
        </Link>

        {/* Dashboard */}
        <ul className="space-y-2">
          <li>
            <NavLink to="/admin/dashboard/dashboard" className={menuItemClass}>
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
          {/* Data */}
          <li>
            <NavLink to="/admin/dashboard/data" className={menuItemClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Table className="w-4 h-4" />
                  </span>
                  Data
                </>
              )}
            </NavLink>
          </li>

          {/* Gallery */}
          <li>
            <NavLink to="/admin/dashboard/gallery" className={menuItemClass}>
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
            <NavLink to="/admin/dashboard/members" className={menuItemClass}>
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
        </ul>

      </div>

      {/* Footer: Profile + Logout */}
      <div className="space-y-2">
        {/* Profile Button */}
        <button className="flex items-center gap-3 w-full hover:bg-gray-100 px-3 py-2 rounded-xl">
          <span className="bg-white p-2 rounded-lg">
            <User className="w-4 h-4 text-gray-700" />
          </span>
          {user.name}
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
    </aside>
  );
};

export default Sidebar;
