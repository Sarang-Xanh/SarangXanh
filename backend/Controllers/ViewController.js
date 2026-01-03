import db from "../Config/db.js";

// Utility to get date only (YYYY-MM-DD)
const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

// ✅ POST /views/homepage - Track a view
export const trackHomepageVisit = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const today = getToday();

    const [rows] = await db.execute(
      "SELECT * FROM PageViews WHERE ip_address = ? AND DATE(timestamp) = ?",
      [ip, today]
    );

    if (rows.length === 0) {
      await db.execute("INSERT INTO PageViews (ip_address) VALUES (?)", [ip]);
    }

    res.json({ message: "View tracked" });
  } catch (err) {
    console.error("❌ Error tracking view:", err);
    res.status(500).json({ error: "Failed to track view" });
  }
};

// ✅ GET /views/homepage - Fetch total views
export const getHomepageViews = async (req, res) => {
  try {
    const [count] = await db.execute("SELECT COUNT(*) as total FROM PageViews");
    res.json({ totalViews: count[0].total });
  } catch (err) {
    console.error("❌ Error getting total views:", err);
    res.status(500).json({ error: "Failed to get views" });
  }
};
