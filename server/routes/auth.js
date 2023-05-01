import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { dashboard } from "../controllers/client.controller.js"

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', requireAuth, dashboard);

export default router;