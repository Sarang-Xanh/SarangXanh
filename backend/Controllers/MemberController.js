// controllers/MembersController.js
import db from "../Config/db.js";

// GET all members
export const getMembers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM members ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

// CREATE a new member
export const addMember = async (req, res) => {
    try {
      const { name, role, team, school, description, picture } = req.body;
      const [result] = await db.execute(
        "INSERT INTO members (name, role, team, school, description, picture) VALUES (?, ?, ?, ?, ?, ?)",
        [name, role, team, school, description, picture]
      );
  
      // Return new member with the correct ID
      res.json({
        id: result.insertId,
        name,
        role,
        team,
        school,
        description,
        picture,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add member" });
    }
  };

// UPDATE member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, team, school, description, picture } = req.body;

    await db.execute(
      "UPDATE members SET name = ?, role = ?, team = ?, school = ?, description = ?, picture = ? WHERE id = ?",
      [name, role, team, school, description, picture, id]
    );
    res.json({ status: "Success", message: "Member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update member" });
  }
};

// DELETE member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM members WHERE id = ?", [id]);
    res.json({ status: "Success", message: "Member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete member" });
  }
};
