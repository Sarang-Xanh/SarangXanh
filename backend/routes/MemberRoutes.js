import express from "express";
import {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "../Controllers/MemberController.js";
import { verifyUser } from "../Middleware/verifyUser.js";

const router = express.Router();

//CRUD operations for members (admin-only)
router.get("/", getMembers);
router.post("/", verifyUser, addMember);
router.put("/:id", verifyUser, updateMember);
router.delete("/:id", verifyUser, deleteMember);

export default router;
