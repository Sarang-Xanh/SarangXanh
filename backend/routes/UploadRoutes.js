import express from "express";
import multer from "multer";
import storage from "../Utils/storage.js";

const router = express.Router();
const upload = multer({ storage });

// Route: POST /upload
router.post("/", upload.single("image"), (req, res) => {
  try {
    // This is the URL of the uploaded file on Cloudinary
    const fileUrl = req.file.path;

    res.status(200).json({
      message: "Upload successful",
      imageUrl: fileUrl,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
});

export default router;
