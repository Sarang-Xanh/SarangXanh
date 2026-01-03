import express from "express";
import {
  getData,
  updateMonthlyStat,
  addTimeline,
  deleteTimeline,
  editTimeline,
} from "../Controllers/DataController.js";
import { verifyUser } from "../Middleware/verifyUser.js";

const router = express.Router();

// Public: Fetch all data (totals + monthly + timeline)
router.get("/", getData);

// Monthly stat management
router.put("/monthly/:month", verifyUser, updateMonthlyStat);

// Timeline management
router.post("/timeline", verifyUser, addTimeline);
router.put("/timeline/:id", verifyUser, editTimeline);
router.delete("/timeline/:id", verifyUser, deleteTimeline);

export default router;
