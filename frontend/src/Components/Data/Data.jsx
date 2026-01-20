// Updated Data.jsx with improved timeline (alternating layout, truncated text, popup modal)
// NOTE: Replace your existing Data.jsx with this file.

import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Banner from "../Banner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const collectedLocations = [
  { city: "Hanoi", lat: 21.0285, lng: 105.8542 },
  { city: "Da Nang", lat: 16.0544, lng: 108.2022 },
  { city: "Ho Chi Minh City", lat: 10.7769, lng: 106.7009 },
];

const Data = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [hoveredTimelineId, setHoveredTimelineId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, timelineRes, monthlyRes] = await Promise.all([
          supabase.rpc("get_stats_totals"),
          supabase
            .from("timeline")
            .select("id, event_date, title, description, image_url")
            .order("event_date", { ascending: true }),
          supabase
            .from("stats_monthly")
            .select("month, plastic_collected, plastic_recycled, volunteers")
            .order("month", { ascending: true }),
        ]);

        if (statsRes.error) throw statsRes.error;
        if (timelineRes.error) throw timelineRes.error;
        if (monthlyRes.error) throw monthlyRes.error;

        const rawStats = Array.isArray(statsRes.data)
          ? statsRes.data[0]
          : statsRes.data;
        const getValue = (keys) =>
          keys.reduce(
            (acc, key) => (acc ?? rawStats?.[key] ?? null),
            null
          ) ?? 0;

        const timeline = timelineRes.data || [];
        const monthly = (monthlyRes.data || []).slice().reverse();

        const labels = monthly.map((item) => item.month.slice(5));
        const collected = monthly.map((item) => item.plastic_collected);
        const recycled = monthly.map((item) => item.plastic_recycled);
        const volunteer = monthly.map((item) => item.volunteers);

        setTimelineEvents(timeline);

        setStats([
          {
            label: "Plastic Collected",
            value: `${getValue([
              "plastic_collected",
              "total_plastic_collected",
              "total_collected",
            ])} kg`,
            chart: collected,
            labels,
          },
          {
            label: "Plastic Recycled",
            value: `${getValue([
              "plastic_recycled",
              "total_plastic_recycled",
              "total_recycled",
            ])} kg`,
            chart: recycled,
            labels,
          },
          {
            label: "Volunteers",
            value: `${getValue(["volunteers", "total_volunteers"])} people`,
            chart: volunteer,
            labels,
          },
        ]);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeChart !== null) {
      setShowChart(false);
      const timer = setTimeout(() => setShowChart(true), 100);
      return () => clearTimeout(timer);
    }
    setShowChart(false);
  }, [activeChart]);

  const truncate = (text, n = 120) => {
    if (!text) return "";
    return text.length > n ? text.slice(0, n) + "..." : text;
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Real-Time Data"
        subtitle="Track our plastic collection, recycling, and volunteer growth across Vietnam."
        buttonText="Explore Data"
        onButtonClick={() =>
          document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="max-w-6xl mx-auto py-20 px-6" id="overview">
        {/* Stat Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => setActiveChart(idx)}
              onMouseEnter={() => setHoveredStat(idx)}
              onMouseLeave={() => setHoveredStat(null)}
              className={`cursor-pointer bg-white p-6 rounded-xl shadow text-center transition border-2
              ${activeChart === idx ? "border-blue-600 bg-blue-100 scale-105" : ""}
              ${hoveredStat === idx && activeChart !== idx ? "bg-blue-50 scale-105 shadow-lg" : ""}
            `}
            >
              <p className="text-blue-800 text-sm font-semibold">{stat.label}</p>
              <h3 className="text-3xl font-bold text-blue-700">{stat.value}</h3>
              <span className="block mt-2 text-xs text-blue-400">
                {activeChart === idx ? "Showing chart" : "Click to view chart"}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        {activeChart !== null && (
          <div
            className={`bg-white p-6 mb-20 rounded-lg shadow-lg ${showChart ? "opacity-100" : "opacity-0"}`}
            style={{ transition: "opacity 0.5s" }}
          >
            <h4 className="text-lg font-semibold text-center mb-4 text-blue-700">
              {stats[activeChart].label} - Monthly Progress
            </h4>
            <Bar
              data={{
                labels: stats[activeChart].labels,
                datasets: [
                  {
                    label: stats[activeChart].label,
                    data: stats[activeChart].chart,
                    backgroundColor: "rgba(59, 130, 246, 0.6)",
                    borderColor: "#3b82f6",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        )}

        {/* Map */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">🗺️ Collected Areas</h3>
          <MapContainer
            center={[16.0544, 108.2022]}
            zoom={5}
            className="h-96 rounded-lg shadow z-10"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {collectedLocations.map((loc, idx) => (
              <Marker key={idx} position={[loc.lat, loc.lng]}>
                <Popup>
                  <span className="font-bold text-blue-700">{loc.city}</span>
                </Popup>
              </Marker>
            ))}
            <Polyline positions={collectedLocations.map((loc) => [loc.lat, loc.lng])} color="blue" />
          </MapContainer>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-blue-200"></div>
            <div className="flex gap-6 overflow-x-auto pb-6">
              {timelineEvents.map((event) => {
                const dateLabel = event.event_date
                  ? new Date(event.event_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "No date";
                return (
                  <button
                    key={event.id}
                    type="button"
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      setHoveredTimelineId(event.id);
                    }}
                    onMouseLeave={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      hoverTimeoutRef.current = setTimeout(() => {
                        setHoveredTimelineId(null);
                      }, 250);
                    }}
                    className="relative flex flex-col items-center min-w-[160px] text-center"
                  >
                    <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md z-10"></span>
                    <span className="mt-3 text-xs text-gray-500">{dateLabel}</span>
                    <span className="mt-1 text-sm font-semibold text-blue-800">
                      {event.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[220px] relative overflow-hidden">
            {(() => {
              const hovered = timelineEvents.find(
                (event) => event.id === hoveredTimelineId
              );
              return (
                <>
                  <div
                    className={`absolute inset-0 flex items-center justify-center text-sm text-gray-500 transition-opacity duration-300 ${
                      hovered ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Hover a timeline item to see details.
                  </div>
                  <div
                    className={`transition-all duration-300 ease-out ${
                      hovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    {hovered && (
                      <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500">
                            {hovered.event_date
                              ? new Date(hovered.event_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "No date"}
                          </div>
                          <h3 className="text-lg font-bold text-blue-700">
                            {hovered.title}
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {hovered.description}
                          </p>
                        </div>
                        <div className="w-full">
                          <img
                            src={hovered.image_url || "/bg.jpg"}
                            alt={hovered.title}
                            className="w-full rounded-lg object-cover max-h-64"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Data;
