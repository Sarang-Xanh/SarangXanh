import express from "express";
import {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../Controllers/GalleryController.js";

import { verifyUser } from "../Middleware/verifyUser.js";

const router = express.Router();

router.get("/", getGallery); // public
router.post("/", verifyUser, addGalleryItem); // add
router.put("/:id", verifyUser, updateGalleryItem); // edit
router.delete("/:id", verifyUser, deleteGalleryItem); // delete

export default router;
