import React, { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Upload,
  Image,
} from "lucide-react";
import { supabase } from "../../../../lib/supabase";

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const yearTabs = useMemo(() => {
    const years = new Set([2025, 2026]);
    items.forEach((item) => {
      if (item.year) years.add(Number(item.year));
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [items]);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("year", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("❌ Failed to load gallery.", err);
      setItems([]);
    }
  };

  const handleUploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public-media")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("public-media")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error("❌ Failed to upload image.", err);
      throw err;
    }
  };

  const handleAdd = async () => {
    if (!files.length || !selectedYear || Number(selectedYear) >= 2100) {
      alert("⚠️ Select a valid year and at least one image.");
      return;
    }
    setLoading(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const image_url = await handleUploadImage(file);
          return {
            year: Number(selectedYear),
            image_url,
          };
        })
      );
      const { error } = await supabase.from("gallery").insert(uploads);
      if (error) throw error;
      setFiles([]);
      await fetchGallery();
    } catch {
      alert("❌ Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      fetchGallery();
    } catch {
      alert("❌ Failed to delete item.");
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-10">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Image className="w-5 h-5 text-gray-800" /> Gallery Admin
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-6">
        <div className="flex flex-wrap gap-3">
          {yearTabs.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                selectedYear === year
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="border border-gray-300 p-2 rounded-lg"
          />
          <div className="text-sm text-gray-500">
            Uploading to year <strong>{selectedYear}</strong>
          </div>
          <button
            onClick={handleAdd}
            className="bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-700 transition"
            disabled={loading}
          >
            <Upload className="w-4 h-4 inline mr-1" />{" "}
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          {selectedYear}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items
            .filter((item) => Number(item.year) === Number(selectedYear))
            .map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 p-3 rounded-xl bg-white"
              >
                <img
                  src={item.image_url}
                  alt={`gallery-${item.id}`}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-full hover:scale-110 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
