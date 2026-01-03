import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


// Import routes
import authRoutes from "./routes/AuthRoutes.js";
import dataRoutes from "./routes/DataRoutes.js";
import uploadRoutes from "./routes/UploadRoutes.js";
import memberRoutes from "./routes/MemberRoutes.js";
import galleryRoutes from "./routes/GalleryRoutes.js";
import StatsRoutes from "./routes/ViewRoutes.js";
import helmet from "helmet";


const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
  "http://localhost:5173",
  "https://sarang-xanh.vercel.app",
].filter(Boolean); // remove undefined

console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);



// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Routes
app.use("/", authRoutes);
app.use("/data", dataRoutes);
app.use("/members", memberRoutes);
app.use("/gallery", galleryRoutes);
app.use("/views", StatsRoutes);
app.use("/upload", uploadRoutes); 

console.log("NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






