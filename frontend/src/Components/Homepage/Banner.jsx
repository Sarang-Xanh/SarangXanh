import React, { useEffect, useState } from "react";
import AOS from "aos";
import { Globe } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const Banner = () => {
  const [stats, setStats] = useState({
    trash_collected: 0,
    plastic_recycled: 0,
    volunteers: 0,
  });

  // ✅ Fetch stats from backend directly
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });

    const trackView = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/views/homepage`);
      } catch (err) {
        console.error("❌ Failed to track view:", err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data`);
        const backendStats = res.data.stats;

        setStats({
          trash_collected: Number(backendStats.plastic_collected || 0),
          plastic_recycled: Number(backendStats.plastic_recycled || 0),
          volunteers: Number(backendStats.volunteers || 0),
        });
      } catch (err) {
        console.error("❌ Failed to fetch stats:", err);
      }
    };

    trackView();
    fetchStats();
  }, []);

  // ✅ Count-up animation hook
  function useCountUp(target, duration = 1500) {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, [target, duration]);

    return value;
  }

  const animatedCollected = useCountUp(stats.trash_collected, 6000);
  const animatedRecycled = useCountUp(stats.plastic_recycled, 6000);
  const animatedVolunteers = useCountUp(stats.volunteers, 6000);

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center text-white relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none select-none"></div>

      {/* Content wrapper (text + image) */}
      <div className="relative py-16 md:py-24 w-full px-6 z-10 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-6xl mx-auto">
          {/* Left Text */}
          <div className="flex-1 text-left" data-aos="fade-up">
            <h5 className="uppercase text-base md:text-lg font-bold tracking-widest text-gray-300">
              Together for a cleaner future
            </h5>
            <h1 className="text-5xl md:text-7xl 2xl:text-8xl font-extrabold leading-tight">
              Sarang<span className="text-cyan-600">Xanh</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl 2xl:text-2xl leading-relaxed text-gray-200 max-w-2xl">
              The platform "SarangXanh" is designed to raise awareness and
              support environmental health. Let's work together to create a
              cleaner and greener world.
            </p>

            <Link to="/donate">
              <button className="mt-8 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 2xl:px-8 2xl:py-4 rounded-full text-sm 2xl:text-base font-semibold shadow-md">
                Save The Environment
              </button>
            </Link>
          </div>

          {/* Right Image */}
          <div
            className="flex-1 w-full flex justify-center md:justify-end"
            data-aos="zoom-in"
          >
            <img
              src="/banner-right.jpg"
              alt="Environment"
              className="w-full max-w-lg md:max-w-xs xl:max-w-xl 2xl:max-w-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl 2xl:max-w-[1200px] z-20"
        data-aos="fade-up"
      >
        <div className="bg-blue-200/50 rounded-xl px-4 sm:px-6 2xl:px-10 py-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 shadow-lg backdrop-blur-md w-full">
          {/* Icon + Title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-0">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 text-blue-700" />
            <h2 className="text-base sm:text-lg md:text-xl 2xl:text-2xl font-semibold tracking-wide text-blue-800">
              Live Environmental Stats
            </h2>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 2xl:gap-10">
            {/* Trash Collected */}
            <div
              className="bg-white text-center px-4 sm:px-6 2xl:px-8 py-4 2xl:py-6 rounded-lg shadow-md w-48 sm:w-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <p className="text-gray-600 text-sm 2xl:text-base">
                Trash Collected
              </p>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-black">
                {animatedCollected.toLocaleString()} Kg
              </h3>
            </div>

            {/* Plastic Recycled */}
            <div
              className="bg-white text-center px-4 sm:px-6 2xl:px-8 py-4 2xl:py-6 rounded-lg shadow-md w-48 sm:w-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="text-gray-600 text-sm 2xl:text-base">
                Plastic Recycled
              </p>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-black">
                {animatedRecycled.toLocaleString()} Kg
              </h3>
            </div>

            {/* Volunteers */}
            <div
              className="bg-white text-center px-4 sm:px-6 2xl:px-8 py-4 2xl:py-6 rounded-lg shadow-md w-48 sm:w-auto"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <p className="text-gray-600 text-sm 2xl:text-base">Volunteers</p>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-black">
                {animatedVolunteers.toLocaleString()} People
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
