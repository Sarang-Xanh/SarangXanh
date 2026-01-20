import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import Banner from "../Banner";

const GallerySection = ({ title, items }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
    {items.length === 0 ? (
      <div className="text-sm text-gray-500">No photos yet.</div>
    ) : (
      <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-5 2xl:columns-6 gap-2">
        {items.map((media) => (
          <div key={media.id} className="mb-2 break-inside-avoid">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={media.image_url}
                alt={media.title || `gallery-${media.id}`}
                className="w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const Gallery = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, year, image_url, title, description")
          .order("year", { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch gallery:", err);
      }
    };
    fetchGallery();
  }, []);

  const displayItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        displayDate: item.year ? String(item.year) : "Unknown",
        shortDescription: item.description
          ? item.description.slice(0, 80)
          : "",
      })),
    [items]
  );

  const groupedByYear = useMemo(() => {
    return displayItems.reduce((acc, item) => {
      const key = item.year ? String(item.year) : "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [displayItems]);
  const yearSections = useMemo(() => {
    const years = Object.keys(groupedByYear);
    return years.sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return Number(b) - Number(a);
    });
  }, [groupedByYear]);

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

      <div className="max-w-6xl mx-auto px-4 py-10" id="gallery-grid">
        <div className="rounded-3xl bg-white/70 p-4 sm:p-6 space-y-10">
          {yearSections.map((year) => (
            <GallerySection
              key={year}
              title={year}
              items={groupedByYear[year]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
