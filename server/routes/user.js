import express from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createUser);

router.get("/:id", requireAuth, getUser);

router.put("/:id", requireAuth, updateUser);

router.delete("/:id", requireAuth, deleteUser);

export default router;