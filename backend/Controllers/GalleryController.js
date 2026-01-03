import db from "../Config/db.js";

export const getGallery = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM gallery ORDER BY year DESC, created_at DESC"
    );

    const grouped = {};
    rows.forEach((item) => {
      if (!grouped[item.year]) grouped[item.year] = [];
      grouped[item.year].push(item);
    });

    res.json(grouped);
  } catch (err) {
    console.error("❌ Failed to fetch gallery:", err);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
};

// Add a new gallery item
export const addGalleryItem = async (req, res) => {
  try {
    const { year, title, description, image_url } = req.body;

    await db.execute(
      `INSERT INTO gallery (year, title, description, image_url) VALUES (?, ?, ?, ?)`,
      [year, title, description, image_url]
    );

    res.json({ status: "Success", message: "Gallery item added" });
  } catch (err) {
    console.error("❌ Failed to add gallery item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

// Update a gallery item
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, description, image_url } = req.body;

    await db.execute(
      `UPDATE gallery SET year = ?, title = ?, description = ?, image_url = ? WHERE id = ?`,
      [year, title, description, image_url, id]
    );

    res.json({ status: "Success", message: "Gallery item updated" });
  } catch (err) {
    console.error("❌ Failed to update gallery item:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Delete a gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(`DELETE FROM gallery WHERE id = ?`, [id]);

    res.json({ status: "Success", message: "Gallery item deleted" });
  } catch (err) {
    console.error("❌ Failed to delete gallery item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
