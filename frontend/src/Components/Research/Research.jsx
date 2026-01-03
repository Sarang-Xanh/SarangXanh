import React, { useState, useMemo } from "react";
import Banner from "../Banner";

const allResources = [
  {
    type: "News",
    title: "Vietnam’s Plastic Waste Crisis",
    description:
      "An in-depth article on the growing plastic pollution issue in Vietnam and its environmental impact.",
    source: "The Guardian",
    date: "2024-11-20",
    link: "https://www.theguardian.com/environment/vietnam-plastic-waste",
  },
  {
    type: "Paper",
    title: "Ocean Plastic Debris Accumulation Trends",
    description:
      "A scientific study tracking ocean plastic accumulation across Southeast Asia.",
    source: "Nature",
    date: "2023-06-10",
    link: "https://www.nature.com/articles/ocean-plastic-debris",
  },
  {
    type: "Report",
    title: "UNEP: Global Plastic Outlook",
    description:
      "United Nations Environment Programme report on global plastic usage and waste management trends.",
    source: "UNEP",
    date: "2025-01-05",
    link: "https://www.unep.org/reports/global-plastic-outlook",
  },
  {
    type: "News",
    title: "Vietnam Youth Lead River Cleanup",
    description:
      "A story covering Vietnamese students taking action to clean the Red River.",
    source: "VNExpress",
    date: "2025-03-15",
    link: "https://vnexpress.net/vietnam-youth-cleanup",
  },
];

const filterOptions = ["All", "News", "Paper", "Report"];

const Research = () => {
  const [selectedType, setSelectedType] = useState("All");

  const filtered = useMemo(() => {
    const base =
      selectedType === "All"
        ? allResources
        : allResources.filter((item) => item.type === selectedType);
    return [...base].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedType]);

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
          {filtered.map((item, index) => (
            <a
              key={index}
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
