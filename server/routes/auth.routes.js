import express from 'express'
import rateLimit from 'express-rate-limit'
import { validateRegister, requireAdminAuth } from '../middleware/auth.middleware.js'
import { login, logout, refreshAccessToken, register, validateTokens, invalidateUserSessions, invalidateAllSessions } from '../controllers/auth.controller.js'
import { validate, loginSchema, registerSchema } from '../middleware/validate.middleware.js'

const router = express.Router()

// Strict limiter for login — 10 attempts per 15 min per IP before lockout
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts from this IP, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for other auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(registerSchema), validateRegister, register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', authLimiter, refreshAccessToken)
router.get('/validate', validateTokens)

router.delete('/sessions/:userId', requireAdminAuth, invalidateUserSessions)
router.delete('/sessions', requireAdminAuth, invalidateAllSessions)

export default router
