import express from 'express'
import { validateRegister } from '../middleware/auth.middleware.js'
import { login, logout, register } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', login)
router.post('/logout', logout)

export default router
