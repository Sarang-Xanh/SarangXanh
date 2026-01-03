import React, { useEffect, useState } from "react";
const DEFAULT_IMAGES = ["/Banner/Banner_Img1.jpeg", "/Banner/Banner_Img2.jpeg", "/Banner/Banner_Img3.jpeg"];

const Banner = ({
  images = [],
  title,
  subtitle,
  buttonText,
  onButtonClick,
  height = "h-[50vh]",
}) => {
  const effectiveImages =
    Array.isArray(images) && images.length > 0 ? images : DEFAULT_IMAGES;

  const [bannerIdx, setBannerIdx] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (effectiveImages.length < 2) return;
    const interval = setInterval(() => {
      setBannerIdx((idx) => (idx + 1) % effectiveImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [effectiveImages.length]);

  // Manual dot click
  const handleBannerDot = (idx) => {
    setBannerIdx(idx);
  };

  return (
    <div
      className={`w-full ${height} flex items-center justify-center bg-cover bg-center relative group transition-all duration-700`}
      style={{
        backgroundImage: `url('${effectiveImages[bannerIdx]}')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-blue-400/60 flex flex-col justify-center items-center text-center px-4 transition-all duration-700 group-hover:backdrop-blur-md">
        <h2 className="text-white text-4xl font-extrabold mb-4 drop-shadow-lg transition-all duration-500 group-hover:scale-105">
          {title}
        </h2>
        <p className="text-white text-lg max-w-3xl mb-4 transition-all duration-500 group-hover:text-blue-100">
          {subtitle}
        </p>
        {buttonText && (
          <button
            className="mt-2 px-6 py-2 bg-white/80 text-blue-700 font-semibold rounded-full shadow hover:bg-blue-600 hover:text-white transition-all duration-300"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
      {/* Banner dots for manual image selection */}
      {effectiveImages.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {effectiveImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition ${
                bannerIdx === idx
                  ? "bg-blue-500"
                  : "bg-white/60 hover:bg-blue-400"
              }`}
              aria-label={`Banner image ${idx + 1}`}
              tabIndex={0}
              onClick={() => handleBannerDot(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
