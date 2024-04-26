import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { dashboard } from '../controllers/dashboard.controller.js';
import { createReservation, getAllReservations, cancelReservation } from '../controllers/reservation.controller.js';
import { createRoom, updateRoom, getAllRooms, deleteRoom } from '../controllers/room.controller.js'
import { createGuest, deleteGuest, updateGuest, getAllGuests} from '../controllers/guest.controller.js'

const router = express.Router();

// Dashboard route
router.get('/dashboard', requireAuth, dashboard);
router.get('/inventory', requireAuth, dashboard);

// Reservation routes
router.get('/reservation-list', requireAuth, getAllReservations);
router.post('/reservation-list', requireAuth, createReservation);
router.put('/reservation-list/:id', requireAuth, cancelReservation);

// Rooms routes
router.get('/room-rack', requireAuth, getAllRooms);
router.post('/room-rack', requireAuth, createRoom);
router.put('/room-rack/:id', requireAuth, updateRoom);
router.delete('/room-rack/:id', requireAuth, deleteRoom);

// Guests routes
router.get('/guests', getAllGuests);
router.post('/guests', createGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

export default router;