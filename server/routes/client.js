import express from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { dashboard } from '../controllers/dashboard.controller.js';
import { createReservation, getAllReservations, cancelReservation } from '../controllers/reservation.controller.js';
import { createRoom, editRoom, getAllRooms, deleteRoom } from '../controllers/room.controller.js'

const router = express.Router();

// Dashboard route
router.get('/', requireAuth, dashboard);
router.get('/dashboard', requireAuth, dashboard);
router.get('/reservation-list', requireAuth, getAllReservations);
router.get('/room-rack', requireAuth, getAllRooms);
router.get('/guests', requireAuth, dashboard);
router.get('/inventory', requireAuth, dashboard);

// Reservation routes
router.post('/reservation-list', createReservation);
router.put('/reservation-list/:id', cancelReservation);

// Rooms routes
router.post('/room-rack', createRoom);
router.put('/room-rack/:id', editRoom);
router.delete('/room-rack/:id', deleteRoom);

export default router;