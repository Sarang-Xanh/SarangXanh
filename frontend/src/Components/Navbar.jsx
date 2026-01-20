import React, { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const isLoggedIn = !!session;

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
      return;
    }

    navigate("/login");
  };

  const openGetInvolved = () => {
    setIsModalOpen(true);
  };

  const closeGetInvolved = () => {
    setIsModalOpen(false);
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

  return (
    <nav className="absolute top-0 left-0 w-full z-50 shadow-sm"
         style={{ backgroundColor: "rgb(136,188,199)" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <span className="text-white">Sarang</span>
          <span className="text-cyan-600">Xanh</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-1 justify-center gap-10 text-sm font-semibold tracking-widest uppercase text-white">
          <li>
            <a href="/" className="hover:text-blue-200">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-blue-200">
              About
            </a>
          </li>
          <li>
            <a href="/data" className="hover:text-blue-200">
              Data
            </a>
          </li>
          <li>
            <a href="/gallery" className="hover:text-blue-200">
              Gallery
            </a>
          </li>
          <li>
            <a href="/faqs" className="hover:text-blue-200">
              FAQs
            </a>
          </li>
          <li>
            <a href="/shop" className="hover:text-blue-200">
              Shop
            </a>
          </li>
          <li>
            <a href="/members" className="hover:text-blue-200">
              Members
            </a>
          </li>
                    <li>
            <a href="/research" className="hover:text-blue-200">
              Research
            </a>
          </li>
        </ul>

        {/* Right-side buttons */}
        <div className="flex items-center gap-7">
          {/* Cart Icon */}
          <div className="relative cursor-pointer">
            <ShoppingBag className="w-7 h-7 text-white" />
            <span className="absolute top-[-6px] right-[-6px] w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>

          {/* Login / Logout */}
          <button
            onClick={handleAuthClick}
            className="hidden md:block border border-white text-white hover:bg-white/20 px-4 py-2 rounded-md text-sm font-semibold transition ml-6"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>

          {/* Apply Button */}
          <button
            onClick={openGetInvolved}
            className="hidden md:block border border-white text-white hover:bg-white/20 px-4 py-2 rounded-md text-sm font-semibold transition"
          >
          Get Involved
          </button>


          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 text-sm font-semibold tracking-widest uppercase bg-white/20 p-4 rounded-xl text-white">
            <li><a href="/" className="hover:text-blue-200">Home</a></li>
            <li><a href="/about" className="hover:text-blue-200">About</a></li>
            <li><a href="/data" className="hover:text-blue-200">Datas</a></li>
            <li><a href="/gallery" className="hover:text-blue-200">Gallery</a></li>
            <li><a href="/faqs" className="hover:text-blue-200">FAQs</a></li>
            <li><a href="/members" className="hover:text-blue-200">Members</a></li>
            <li><a href="/shop" className="hover:text-blue-200">Shop</a></li>
            <li>
              <button
                onClick={openGetInvolved}
                className="w-full text-left hover:text-blue-200"
              >
                Get Involved
              </button>
            </li>
            <li>
              <button
                onClick={handleAuthClick}
                className="w-full text-left hover:text-blue-200"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeGetInvolved}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="p-8 md:p-10">
              <div className="text-center">
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  How would you like to get involved?
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Choose one option to continue.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-6 text-left shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Option 1
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    Volunteer
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Help us collect plastic waste and protect our local environment.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeGetInvolved();
                      navigate("/apply");
                    }}
                    className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition"
                  >
                    Apply to Volunteer
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-200 p-6 text-left shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Option 2
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    Donate
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Support our cleanup activities with a one-time or monthly donation.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeGetInvolved();
                      navigate("/donate");
                    }}
                    className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                  >
                    Donate Now
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-500">
                Thank you for supporting SarangXanh!
              </p>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close logout modal"
            onClick={() => setShowLogoutModal(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-gray-900">Logout?</h3>
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
    </nav>
  );
};

export default Navbar;
