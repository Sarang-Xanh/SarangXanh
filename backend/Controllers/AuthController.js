import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Config/db.js";

const SALT_ROUNDS = 10;
const isProd = process.env.NODE_ENV === "production";

// 📝 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const sql = "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [name, email, hash]);
    const id = result.insertId;

    const accessToken = jwt.sign({ name, email, id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id, email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    return res.status(201).json({ status: "Success", user: { name, email, id } });
  } catch (err) {
    console.error("Duplicate error message:", err.message);
    if (err.message.includes("for key 'users.email'")) {
      return res.status(409).json({ error: "Email already registered!" });
    } else if (err.message.includes("for key 'users.name'")) {
      return res.status(409).json({ error: "Name already taken!" });
    } else {
      return res.status(409).json({ error: "Account already exists" });
    }
  }
};

// 📝 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { id, name } = rows[0];
    const refreshToken = jwt.sign(
      { name, email, id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    const accessToken = jwt.sign(
      { name, email, id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    return res.status(200).json({ status: "Success", user: { name, email, id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// 📝 GET LOGGED-IN USER
export const getUser = (req, res) => {
  return res.json({ Status: "Success", name: req.name, email: req.email, id: req.id });
};

// 📝 LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  });
  return res.json({ Status: "Success" });
};

// 📝 REFRESH TOKEN
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const [rows] = await db.execute("SELECT name FROM Users WHERE id = ?", [
      user.id,
    ]);
    const name = rows[0].name;

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    return res.json({ status: "Success" });
  });
};
