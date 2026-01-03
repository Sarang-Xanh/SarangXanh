import express from "express";
import {
  trackHomepageVisit,
  getHomepageViews,
} from "../Controllers/ViewController.js";

const router = express.Router();

router.post("/homepage", trackHomepageVisit);  // 👈 POST for tracking
router.get("/homepage", getHomepageViews);     // 👈 GET for retrieving total

export default router;
