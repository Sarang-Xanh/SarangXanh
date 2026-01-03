import React, { useState, useEffect } from "react";
import axios from "axios";
import Banner from "../Banner";

const Gallery = () => {
  const [galleryData, setGalleryData] = useState({});
  const [selectedYear, setSelectedYear] = useState("All");
  const [modalMedia, setModalMedia] = useState(null);

  const imageBase = "/uploads"; // or full URL if needed

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/gallery`, { withCredentials: true });
        setGalleryData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch gallery:", err);
      }
    };
    fetchGallery();
  }, []);

  // Build flat media array
  const allMedia = Object.entries(galleryData)
    .map(([year, items]) => items.map((item) => ({ ...item, year })))
    .flat();

  const filteredMedia =
    selectedYear === "All"
      ? allMedia
      : allMedia.filter((item) => item.year === String(selectedYear));

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="SarangXanh Gallery"
        subtitle="A snapshot of our sustainability journey – from cleanups to campaigns across Vietnam."
        buttonText="Explore Gallery"
        onButtonClick={() =>
          document
            .getElementById("gallery-grid")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Year Filter */}
      <div className="flex justify-center gap-6 mt-10 mb-6 flex-wrap">
        {["All", ...Object.keys(galleryData).sort().reverse()].map((year) => (
          <button
            key={year}
            className={`px-4 py-2 text-sm font-semibold rounded-full border ${
              selectedYear === year
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-400 hover:bg-blue-100"
            } transition`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      <div
        id="gallery-grid"
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 px-4"
      >
        {filteredMedia.map((media, idx) => (
          <div
            key={idx}
            className="mb-4 break-inside-avoid cursor-pointer group"
            onClick={() => setModalMedia(media)}
          >
            {media.image_url?.includes("youtube") ? (
              <div className="w-full aspect-video rounded-md overflow-hidden">
                <iframe
                  src={media.image_url}
                  title={media.title}
                  className="w-full h-full pointer-events-none"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={
                  media.image_url.startsWith("http")
                    ? media.image_url
                    : `${imageBase}/${media.image_url}`
                }
                alt={media.title}
                className="w-full rounded-md hover:brightness-90 transition duration-200"
              />
            )}
            <div className="bg-black/50 text-white text-xs p-2 rounded-b-md mt-1">
              {media.title}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalMedia && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setModalMedia(null)}
        >
          <div
            className="max-w-3xl w-full mx-4 relative bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {modalMedia.image_url?.includes("youtube") ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                <iframe
                  src={modalMedia.image_url}
                  title={modalMedia.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={
                  modalMedia.image_url.startsWith("http")
                    ? modalMedia.image_url
                    : `${imageBase}/${modalMedia.image_url}`
                }
                alt={modalMedia.title}
                className="w-full rounded-lg shadow-lg object-contain max-h-[80vh]"
              />
            )}
            <p className="mt-4 text-white text-sm bg-black/50 px-4 py-2 rounded w-fit mx-auto">
              <p className = "text-center font-bold">{modalMedia.title}</p>
              <br />
              {modalMedia.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
