import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

setInterval(async () => {
  try {
    await db.query("SELECT 1");
    console.log("DB keep-alive ping successful");
  } catch (error) {
    console.error("DB keep-alive ping error:", error);
  }
}, 5 * 60 * 1000); // every 5 minutes


export default db;
