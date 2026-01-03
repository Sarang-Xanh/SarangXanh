import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const shoes = [
  {
    name: "SarangXanh Keychain",
    price: "$12.99",
    img: "/Merch.png",
  },
  {
    name: "Eco Green Tag",
    price: "$9.99",
    img: "/Merch2.png",
  },
  {
    name: "Plastic-Free Label",
    price: "$14.99",
    img: "/Merch.png",
  },
  {
    name: "Limited Edition Key",
    price: "$17.99",
    img: "/Merch2.png",
  },
];

export default function MerchStore() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shoes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + shoes.length) % shoes.length);
  };

  return (
    <section className="w-full py-20 bg-gradient-to-br from-white to-cyan-50 flex flex-col items-center">
      {/* Title and Subtitle */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-2">Merch Shop</h2>
        <p className="text-md text-slate-500">
          Support us through eco-friendly merchandise
        </p>
      </div>

      <div className="relative w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Product Image with Vertical Transition */}
        <div className="relative w-[240px] h-[420px] overflow-hidden">
          <div
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${currentIndex * 420}px)` }}
          >
            {shoes.map((shoe, index) => (
              <div
                key={index}
                className="w-full h-[420px] flex items-center justify-center"
              >
                <img
                  src={shoe.img}
                  alt={shoe.name}
                  className="h-[380px] w-auto object-contain transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text and Controls */}
        <div className="flex flex-col justify-between h-[420px] w-[300px]">
          <div>
            <h2 className="text-3xl font-semibold text-blue-950 tracking-tight mb-2">
              {shoes[currentIndex].name}
            </h2>
            <p className="text-sm text-slate-400 mb-1">Eco Collection 2025</p>
            <p className="text-2xl font-bold text-cyan-600 mb-6">
              {shoes[currentIndex].price}
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-md shadow-lg transition-all">
              Add to Cart
            </button>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white shadow hover:bg-blue-100 text-blue-800 transition"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white shadow hover:bg-blue-100 text-blue-800 transition"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
