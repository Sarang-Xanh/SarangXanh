
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full h-auto py-10 font-[inter] bg-[#2C708A] text-amber-50">
      <div className="flex flex-col gap-10 min-w-[300px] max-w-[1000px] w-auto h-auto mx-auto">
        {/* Horizontal Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-center sm:text-left mx-6">
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "#" },
            { label: "Data", href: "#" },
            { label: "Gallery", href: "#" },
            { label: "Faqs", href: "#" },
            { label: "Shop", href: "#" },
            { label: "Members", href: "#" },
          ].map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="text-amber-50 hover:text-amber-300 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Info */}
        <div className="h-auto flex flex-col gap-2 mx-4">
          <h2 className="border-3 px-3 w-fit mx-auto uppercase text-2xl font-black">  
            SARANGXANH
          </h2>
          <p className="w-fit mx-auto text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
            sint.
          </p>
          <div className="flex flex-row justify-center gap-x-8 w-fit mx-auto text-3xl">
            <a
              href="https://github.com/kerbthecurb/SarangXanh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors duration-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.instagram.com/sarangxanh/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors duration-200"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
