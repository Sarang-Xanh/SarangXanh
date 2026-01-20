import React, { useEffect, useMemo, useState } from "react";
import {
  MousePointerClick,
  Recycle,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../../../lib/supabase";

const DashboardPage = () => {
  const [totals, setTotals] = useState({
    plastic_collected: 0,
    plastic_recycled: 0,
    volunteers: 0,
  });
  const [viewCount, setViewCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentTimeline, setRecentTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          statsTotalsRes,
          viewsTotalRes,
          monthlyStatsRes,
          timelineRes,
        ] = await Promise.all([
          supabase.rpc("get_stats_totals"),
          supabase.rpc("get_page_views_total"),
          supabase
            .from("stats_monthly")
            .select("month, plastic_collected")
            .order("month", { ascending: true }),
          supabase
            .from("timeline")
            .select("id, event_date, title, description")
            .order("event_date", { ascending: false })
            .limit(3),
        ]);

        if (statsTotalsRes.error) {
          console.error("Failed to load totals:", statsTotalsRes.error);
        } else {
          const rawTotals = Array.isArray(statsTotalsRes.data)
            ? statsTotalsRes.data[0]
            : statsTotalsRes.data;
          const getValue = (keys) =>
            keys.reduce(
              (acc, key) => (acc ?? rawTotals?.[key] ?? null),
              null
            ) ?? 0;

          setTotals({
            plastic_collected: getValue([
              "plastic_collected",
              "total_plastic_collected",
              "total_collected",
            ]),
            plastic_recycled: getValue([
              "plastic_recycled",
              "total_plastic_recycled",
              "total_recycled",
            ]),
            volunteers: getValue(["volunteers", "total_volunteers"]),
          });
        }

        if (viewsTotalRes.error) {
          console.error("Failed to load views:", viewsTotalRes.error);
        } else {
          const rawViews = Array.isArray(viewsTotalRes.data)
            ? viewsTotalRes.data[0]
            : viewsTotalRes.data;
          const totalViews =
            rawViews?.total_views ??
            rawViews?.views ??
            rawViews?.count ??
            rawViews ??
            0;
          setViewCount(totalViews);
        }

        if (monthlyStatsRes.error) {
          console.error("Failed to load monthly stats:", monthlyStatsRes.error);
        } else {
          const cleaned = (monthlyStatsRes.data || []).map((m) => ({
            month: m.month,
            kg: m.plastic_collected,
          }));
          setMonthlyStats(cleaned);
        }

        if (timelineRes.error) {
          console.error("Failed to load timeline:", timelineRes.error);
        } else {
          setRecentTimeline(timelineRes.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const metrics = [
    {
      icon: <Trash2 />,
      value: totals.plastic_collected,
      label: "Total Plastic Collected",
      color: "bg-orange-500",
    },
    {
      icon: <Recycle />,
      value: totals.plastic_recycled,
      label: "Total Recycled",
      color: "bg-green-600",
    },
    {
      icon: <Users />,
      value: totals.volunteers,
      label: "Total Volunteers",
      color: "bg-blue-600",
    },
    {
      icon: <MousePointerClick />,
      value: viewCount,
      label: "Total Page Views",
      color: "bg-zinc-900",
    },
  ];

  const chartData = useMemo(
    () =>
      monthlyStats.map((item) => ({
        month: item.month,
        kg: item.kg,
      })),
    [monthlyStats]
  );

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
        {metrics.map((metric, idx) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-1">Recent Timeline</h2>
          <p className="text-sm text-gray-500 mb-4">Latest 3 updates</p>
          <div className="space-y-4">
            {recentTimeline.length === 0 ? (
              <p className="text-sm text-gray-500">No timeline entries yet.</p>
            ) : (
              recentTimeline.map((item) => (
                <div key={item.id} className="border-b pb-3">
                  <div className="text-xs text-gray-400">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-1">Plastic Collected</h2>
          <p className="text-sm text-gray-500 mb-4">Monthly collection</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="kg"
                stroke="#f97316"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
