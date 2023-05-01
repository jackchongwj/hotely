import express from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createUser);

router.get("/:id", authenticate, getUser);

router.put("/:id", authenticate, updateUser);

router.delete("/:id", authenticate, deleteUser);

export default router;