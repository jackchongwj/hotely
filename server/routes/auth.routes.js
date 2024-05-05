import express from 'express'
import { validateRegister } from '../middleware/auth.middleware.js'
import { login, logout, refreshAccessToken, register, validateTokens } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.get('/validate', validateTokens)

export default router
