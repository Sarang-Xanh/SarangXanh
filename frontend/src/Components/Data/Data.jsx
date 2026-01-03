// Updated Data.jsx with improved timeline (alternating layout, truncated text, popup modal)
// NOTE: Replace your existing Data.jsx with this file.

import React, { useState, useEffect } from "react";
import axios from "axios";
import Banner from "../Banner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
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
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data`, {
          withCredentials: true,
        });

        const backendStats = res.data.stats;
        const timeline = res.data.timeline;
        const monthly = [...res.data.monthlyStats].reverse();

        const labels = monthly.map((item) => item.month.slice(5));
        const collected = monthly.map((item) => item.plastic_collected);
        const recycled = monthly.map((item) => item.plastic_recycled);
        const volunteer = monthly.map((item) => item.volunteers);

        setTimelineEvents(timeline);

        setStats([
          {
            label: "Plastic Collected",
            value: `${backendStats.plastic_collected} kg`,
            chart: collected,
            labels,
          },
          {
            label: "Plastic Recycled",
            value: `${backendStats.plastic_recycled} kg`,
            chart: recycled,
            labels,
          },
          {
            label: "Volunteers",
            value: `${backendStats.volunteers} people`,
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
        <VerticalTimeline>
          {timelineEvents.map((event, idx) => (
            <VerticalTimelineElement
              key={event.id || idx}
              date={event.date}
              iconStyle={{ background: "#3b82f6", color: "#fff" }}
              position={idx % 2 === 0 ? "left" : "right"}
            >
              <div
                className="bg-white p-4 rounded-lg shadow cursor-pointer"
                onClick={() => setModalData(event)}
              >
                <h3 className="text-lg font-bold text-blue-700">{event.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {truncate(event.description)}
                </p>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-6 z-[999]">
          <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setModalData(null)}
            >
              ✕
            </button>

            {modalData.image && (
              <img src={modalData.image} alt={modalData.title} className="w-full rounded-lg mb-4" />
            )}

            <h3 className="text-xl font-bold text-blue-700 mb-2">{modalData.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{modalData.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Data;
