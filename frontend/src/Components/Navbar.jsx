import React, { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import {useNavigate} from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

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

          {/* Donate Button */}
          <button
            onClick={() => navigate("/donate")} className="hidden md:block border border-white text-white hover:bg-white/20 px-4 py-2 rounded-md text-sm font-semibold transition" >

          Donate
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
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
