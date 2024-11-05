import express from 'express';
import { requireAuth, requireAdminAuth } from '../middleware/auth.middleware.js';
import { dashboard, getOccupancy, getExpectedArrivals, getCurrentGuests, getExpectedDepartures, getDailyRevenue } from '../controllers/dashboard.controller.js';
import { createReservation, getAllReservations, cancelReservation, checkOutReservation, checkInReservation } from '../controllers/reservation.controller.js';
import { getAvailableRooms, createRoom, updateRoom, getAllRooms, deleteRoom } from '../controllers/room.controller.js'
import { createGuest, deleteGuest, updateGuest, getAllGuests} from '../controllers/guest.controller.js'
import { createRoomDetail, getAllRoomDetails, updateRoomDetail, deleteRoomDetail } from '../controllers/roomdetail.controller.js';

const router = express.Router();

// Dashboard route
router.get('/dashboard', requireAuth, dashboard);
router.get('/dashboard/getOccupancy', requireAuth, getOccupancy);
router.get('/dashboard/getCurrentGuests', requireAuth, getCurrentGuests);
router.get('/dashboard/getArrivals', requireAuth, getExpectedArrivals);
router.get('/dashboard/getDepartures', requireAuth, getExpectedDepartures);
router.get('/dashboard/getDailyRevenue', requireAuth, getDailyRevenue);

// Reservation routes
router.get('/reservation-list', requireAuth, getAllReservations);
router.post('/reservation-list', requireAuth, createReservation);
router.put('/reservation-list/:id', requireAuth, cancelReservation);
router.put('/reservation-list/:id/check-in', requireAuth, checkInReservation);
router.put('/reservation-list/:id/check-out', requireAuth, checkOutReservation);

// Room routes
router.get('/rooms/available', requireAuth, getAvailableRooms);
router.get('/room-rack', requireAuth, getAllRooms);
router.post('/room-rack', requireAuth, createRoom);
router.put('/room-rack/:id', requireAuth, updateRoom);
router.delete('/room-rack/:id', requireAuth, deleteRoom);

// Room Settings routes
router.get('/room-detail', requireAdminAuth, getAllRoomDetails);
router.post('/room-detail', requireAdminAuth, createRoomDetail);
router.put('/room-detail/:id', requireAdminAuth, updateRoomDetail);
router.delete('/room-detail/:id', requireAdminAuth, deleteRoomDetail);

// Guests routes
router.get('/guests', getAllGuests);
router.post('/guests', createGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

export default router;