import React, { useEffect, useMemo, useState } from "react";
import Banner from "../Banner";
import { supabase } from "../../lib/supabase";

const filterOptions = ["All", "News", "Paper", "Report"];

const Research = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [resources, setResources] = useState([]);

  const filtered = useMemo(() => {
    const base =
      selectedType === "All"
        ? resources
        : resources.filter((item) => item.type === selectedType);
    return [...base].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [resources, selectedType]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("research")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Failed to load research:", error);
        setResources([]);
        return;
      }

      setResources(data || []);
    };

    fetchResources();
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Research & Insights"
        subtitle="Explore our curated collection of research papers, news articles, and environmental reports."
        buttonText="Explore Research"
        onButtonClick={() =>
          document
            .getElementById("resources")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-16" id="resources">
        {/* Filter buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {filterOptions.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border ${
                selectedType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-400 hover:bg-blue-100"
              } transition`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-200 p-5 rounded-xl hover:shadow-lg transition flex flex-col bg-white hover:bg-blue-50"
            >
              <span className="text-sm text-blue-600 font-medium mb-2">
                {item.type}
              </span>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-blue-700 flex-1">{item.description}</p>
              <div className="text-xs text-blue-400 mt-4">
                {item.source} •{" "}
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;
