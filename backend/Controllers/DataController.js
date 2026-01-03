import db from "../Config/db.js";

// Get all data (monthly breakdown + totals + timeline)
export const getData = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get all current stats
    const [monthlyStats] = await db.execute(
      `SELECT * FROM Stats ORDER BY month DESC`
    );

    // Check if current month already exists
    const exists = monthlyStats.some((m) => m.month === currentMonth);

    if (!exists) {
      // Always insert a NEW month with 0 values
      await db.execute(
        `INSERT INTO Stats (month, plastic_collected, plastic_recycled, volunteers)
         VALUES (?, 0, 0, 0)`,
        [currentMonth]
      );
    }

    // Fetch fresh data (after insert)
    const [updatedStats] = await db.execute(
      `SELECT * FROM Stats ORDER BY month DESC`
    );
    const [totals] = await db.execute(`
      SELECT 
        SUM(plastic_collected) AS plastic_collected,
        SUM(plastic_recycled) AS plastic_recycled,
        SUM(volunteers) AS volunteers
      FROM Stats
    `);
    const [timeline] = await db.execute(
      `SELECT * FROM Timeline ORDER BY id DESC`
    );

    res.json({
      stats: totals[0],
      monthlyStats: updatedStats,
      timeline,
    });
  } catch (err) {
    console.error("❌ Failed to fetch data:", err);
    res.status(500).json({ error: "Failed to load data" });
  }
};

// Update or insert monthly stat
export const updateMonthlyStat = async (req, res) => {
  try {
    const { month } = req.params;
    const { plastic_collected, plastic_recycled, volunteers } = req.body;

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    // Check if month exists
    const [existing] = await db.execute("SELECT * FROM Stats WHERE month = ?", [
      month,
    ]);

    if (existing.length > 0) {
      // Update existing record
      await db.execute(
        `UPDATE Stats
         SET plastic_collected = ?, plastic_recycled = ?, volunteers = ?
         WHERE month = ?`,
        [plastic_collected, plastic_recycled, volunteers, month]
      );
    } else {
      // Insert clean new month
      await db.execute(
        `INSERT INTO Stats (month, plastic_collected, plastic_recycled, volunteers)
         VALUES (?, 0, 0, 0)`,
        [month]
      );
    }

    res.json({ status: "Success", message: "Monthly stats saved" });
  } catch (err) {
    console.error("❌ Failed to update monthly stats:", err);
    res.status(500).json({ error: "Failed to update monthly stats" });
  }
};

// Add timeline event
export const addTimeline = async (req, res) => {
  try {
    const { date, title, description, image } = req.body;

    await db.execute(
      "INSERT INTO Timeline (date, title, description, image) VALUES (?, ?, ?, ?)",
      [date, title, description, image]
    );

    res.json({ status: "Success", message: "Timeline event added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add timeline event" });
  }
};

// Delete timeline event
export const deleteTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM Timeline WHERE id = ?", [id]);

    res.json({ status: "Success", message: "Timeline event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete timeline event" });
  }
};

// Update timeline event
export const editTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, description, image } = req.body;

    await db.execute(
      "UPDATE Timeline SET date = ?, title = ?, description = ?, image = ? WHERE id = ?",
      [date, title, description, image, id]
    );

    res.json({ status: "Success", message: "Timeline event updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update timeline event" });
  }
};
