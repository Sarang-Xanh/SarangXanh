import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, ThumbsUp, User, MousePointerClick, Loader2,} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [trashData, setTrashData] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate trash total & progress
  const goalKg = 300;
  const totalCollected = trashData.reduce((acc, item) => acc + item.kg, 0);
  const progress = Math.min((totalCollected / goalKg) * 100, 100);

  const dashboardData = {
    metrics: [
      {
        icon: <User />,
        value: memberCount,
        label: "Total Members",
        color: "bg-orange-500",
      },
      {
        icon: <MousePointerClick />,
        value: viewCount,
        label: "Website Visit",
      },
      { icon: <ShoppingCart />, value: 2300, label: "Total Purchases" },
      {
        icon: <ThumbsUp />,
        value: 0,
        label: "Total Media Views(To be Updated)",
      },
    ],
    shops: [
      { name: "Eco Bottle", members: 4, budget: "$14,000", sales: 10 },
      { name: "Recycle Box", members: 2, budget: "$3,000", sales: 10 },
      { name: "Reusable Bag", members: 3, budget: "Not set", sales: 40 },
      { name: "Reusable Bag", members: 3, budget: "Not set", sales: 100 },
      { name: "Reusable Bag", members: 3, budget: "Not set", sales: 80 },
      { name: "Reusable Bag", members: 3, budget: "Not set", sales: 45 },
    ],
    socialStats: {
      platforms: {
        instagram: 0,
        facebook: 0,
        youtube: 0,
      },
      viewsByMonth: [
        { month: "Apr", value: 100 },
        { month: "May", value: 200 },
        { month: "Jun", value: 500 },
        { month: "Jul", value: 650 },
        { month: "Aug", value: 400 },
        { month: "Sep", value: 230 },
        { month: "Oct", value: 350 },
      ],
    },
    bottomStats: [
      { label: "Members", value: memberCount },
      { label: "Trash Collected", value: `${Math.round(totalCollected)} kg` },
      { label: "Donation", value: "To Be Updated" },
      { label: "Items", value: "43" },
    ],
  };

  useEffect(() => {
    // Fetch all data in parallel
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [viewsRes, statsRes, membersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/views/homepage`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/data`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`),
        ]);

        setViewCount(viewsRes.data.totalViews);

        const cleaned = statsRes.data.monthlyStats.map((m) => ({
          month: m.month,
          kg: m.plastic_collected,
        }));
        setTrashData(cleaned);

        setMemberCount(membersRes.data.length);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {loading ? <Loader2 className="animate-spin" /> : "Loading..."}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardData.metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 text-white shadow-md flex flex-col justify-between ${
              metric.color || "bg-zinc-900"
            }`}
          >
            <div className="text-3xl mb-3">{metric.icon}</div>
            <div className="text-3xl font-bold">{metric.value}</div>
            <div className="text-sm text-gray-200">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Reviews (now Trash Progress) & Shops */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Circular Trash Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-md col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4">
            Trash Collection Progress
          </h2>

          <div className="relative w-60 h-60">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="120"
                cy="120"
                r="100"
                stroke="#e5e7eb"
                strokeWidth="20"
                fill="transparent"
              />
              <circle
                cx="120"
                cy="120"
                r="100"
                stroke="#f97316"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(totalCollected)} kg
                </div>
                <div className="text-sm text-gray-500">Collected</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Goal: <strong>{goalKg} kg</strong>
            </p>
            <p className="text-sm text-gray-600">
              Progress: <strong>{Math.round(progress)}%</strong>
            </p>
          </div>
        </div>

        {/* Shops */}
        <div className="bg-white rounded-2xl p-6 shadow-md col-span-2">
          <h2 className="text-lg font-semibold mb-1">Shops</h2>
          <p className="text-sm text-gray-500 mb-4">30 done this month</p>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {dashboardData.shops.map((shop, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <div className="font-medium text-sm">{shop.name}</div>
                  <div className="text-xs text-gray-500">{shop.budget}</div>
                </div>
                <div className="w-1/2">
                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(shop.sales, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Media Graph */}
        <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm text-gray-300 mb-1">
            Social Media Stats - To Be Updated
          </h2>
          <p className="text-xs text-green-400 mb-4">(+23%) since last week</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dashboardData.socialStats.viewsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="month" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
            {Object.entries(dashboardData.socialStats.platforms).map(
              ([platform, value]) => (
                <div key={platform} className="bg-zinc-800 p-4 rounded-xl">
                  <h3 className="text-sm text-gray-400">{platform}</h3>
                  <p className="text-lg font-bold text-white">{value} views</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Trash Collected Graph */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-1">Trash Collected</h2>
          <p className="text-sm text-gray-500 mb-4">Monthly collection</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trashData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="kg"
                stroke="#ec4899"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-md text-center">
        {dashboardData.bottomStats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        &copy; 2025, made with ❤️ by Hieu.
      </p>
      <p className="text-center text-xs text-gray-400 mt-1">
        &copy; 2025, Design got inspired from Creative Tim.
      </p>
    </div>
  );
};

export default DashboardPage;
