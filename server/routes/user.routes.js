import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/:id", requireAuth, getUser);

router.put("/user/:id", requireAuth, updateUser);

router.delete("/user/:id", requireAuth, deleteUser);

export default router;