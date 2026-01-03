// src/Components/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black text-center px-4">
      <h1 className="text-[120px] font-bold tracking-tight animate-pulse">OOPS!</h1>
      <p className="text-xl md:text-2xl mb-8 animate-fade-in">
        404 - THE PAGE CAN'T BE FOUND
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-cyan-300 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 animate-bounce"
      >
        GO TO HOMEPAGE
      </button>
    </div>
  );
};

export default NotFound;
