import express from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { dashboard } from '../controllers/client.controller.js';

const router = express.Router();

// Dashboard route
router.get('/', requireAuth, dashboard);

export default router;