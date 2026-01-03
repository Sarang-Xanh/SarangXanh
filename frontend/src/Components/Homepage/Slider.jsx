import {
  Leaf,
  Recycle,
  Handshake,
  Sprout,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import AOS from "aos";
import { useNavigate } from 'react-router-dom';

export default function ActionSlider() {
  const navigate = useNavigate();
  const services = [
    {
      title: "Dust Recycling",
      desc: "Alternative innovation to ethical network environmental whiteboard",
      icon: <Recycle className="text-cyan-600 w-10 h-10" />,
      image: "/bg.jpg",
    },
    {
      title: "Cleaning Ocean",
      desc: "Alternative innovation to ethical network environmental whiteboard",
      icon: <Handshake className="text-cyan-600 w-10 h-10" />,
      image: "/bg.jpg",
    },
    {
      title: "Tree Plantation",
      desc: "Alternative innovation to ethical network environmental whiteboard",
      icon: <Sprout className="text-cyan-600 w-10 h-10" />,
      image: "/bg.jpg",
    },
    {
      title: "Renewable Energy",
      desc: "Empowering clean future with solar, wind, and sustainable power",
      icon: <Sprout className="text-cyan-600 w-10 h-10" />,
      image: "/bg.jpg",
    },
    {
      title: "Beach Cleanup",
      desc: "Coastal protection through regular ocean and beach sanitation drives",
      icon: <Recycle className="text-cyan-600 w-10 h-10" />,
      image: "/bg.jpg",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;
  const cardWidth = 300;
  const gap = 40;
  const maxIndex = services.length - visibleCount;

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // ✅ Init AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-25 px-6 md:px-20 relative max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10" data-aos="fade-down">
        <div className="text-cyan-700 font-semibold flex justify-center items-center gap-2 mb-2">
          <Leaf className="w-5 h-5" />
          <span>OUR SERVICES</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
          SarangXanh Provide Environment <br /> Best Leading Services
        </h2>
      </div>

      {/* Arrows with bounce animation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-cyan-100 transition z-10 hover:animate-bounce"
        data-aos="fade-right"
      >
        <ArrowLeft className="text-cyan-600 w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-cyan-100 transition z-10 hover:animate-bounce"
        data-aos="fade-left"
      >
        <ArrowRight className="text-cyan-600 w-6 h-6" />
      </button>

      {/* Slider */}
      <div className="w-full max-w-[980px] mx-auto overflow-hidden py-8">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (cardWidth + gap)}px)`,
            gap: `${gap}px`,
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/80 border border-gray-200 backdrop-blur-sm rounded-lg shadow-md flex-shrink-0 w-[300px] h-[380px] p-4 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 150} // ✅ stagger animation
            >
              {/* IMAGE WRAPPER */}
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-[160px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* 4 CORNER OVERLAY SWEEPS */}
                <span className="absolute top-0 left-0 w-1/2 h-1/2 bg-[rgba(0,146,184,0.25)] scale-0 opacity-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 ease-in-out origin-top-left"></span>
                <span className="absolute top-0 right-0 w-1/2 h-1/2 bg-[rgba(0,146,184,0.25)] scale-0 opacity-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 ease-in-out origin-top-right"></span>
                <span className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[rgba(0,146,184,0.25)] scale-0 opacity-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 ease-in-out origin-bottom-left"></span>
                <span className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[rgba(0,146,184,0.25)] scale-0 opacity-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 ease-in-out origin-bottom-right"></span>
              </div>

              {/* ICON */}
              <div className="mb-2 mt-4 transition-all duration-700 group-hover:translate-x-1">
                {service.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-bold text-blue-900 mb-1 relative overflow-hidden">
                <span className="relative z-10 inline-block transition-all duration-700 group-hover:translate-x-1">
                  {service.title}
                </span>
                {/* TITLE SWEEP */}
                <span className="absolute inset-0 bg-[rgba(0,146,184,0.15)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></span>
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-blue-700/80 transition-all duration-700 group-hover:translate-x-1">
                {service.desc}
              </p>

              {/* BUTTON */}
              <button onClick={() => navigate('/data')} className="group/button absolute bottom-4 left-4 px-4 py-1.5 flex items-center gap-2 rounded-md border-2 border-[rgb(0,146,184)] text-[rgb(0,146,184)] text-sm font-medium overflow-hidden transition-all duration-500 hover:-translate-y-1">
                {/* TEXT + ICON */}
                <span className="relative z-10 flex items-center gap-2 transition-transform duration-500">
                  Explore
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/button:translate-x-1" />
                </span>
                {/* BUTTON DIAGONAL SWEEP */}
                <span className="absolute inset-0 z-0 bg-[rgb(74,168,192)] opacity-0 translate-x-[-100%] translate-y-[100%] group-hover/button:opacity-100 group-hover/button:translate-x-[100%] group-hover/button:translate-y-[-100%] transition-all duration-800 ease-in-out"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
