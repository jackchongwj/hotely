import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { dashboard } from '../controllers/dashboard.controller.js';
import { createReservation, getAllReservations, cancelReservation, getAllAvailableReservations, checkOutFromReservations } from '../controllers/reservation.controller.js';
import { createRoom, updateRoom, getAllRooms, deleteRoom, getAvailableRoomNumberForType, checkOutFromRoom, checkIn, changeStatus } from '../controllers/room.controller.js'
import { createGuest, deleteGuest, updateGuest, getAllGuests} from '../controllers/guest.controller.js'
import { createInventoryItem, deleteInventoryItem, getAlInventoryItem, updateInventoryItem } from '../controllers/inventory.controller.js';

const router = express.Router();

// Dashboard route
router.get('/dashboard', requireAuth, dashboard);

// Reservation routes
router.get('/reservation-list',  requireAuth,getAllReservations);
router.post('/reservation-list', requireAuth, createReservation);
router.put('/reservation-list/:id' , requireAuth, cancelReservation);
router.put('/reservation-list/:id', requireAuth, cancelReservation);
router.get('/reservation-list/getAllAvailableReservations/:type', requireAuth, getAllAvailableReservations);
router.put('/reservation-list/checkOutFromReservations/:revId', requireAuth, checkOutFromReservations);

// Rooms routes
router.get('/room-rack', requireAuth, getAllRooms);
router.post('/room-rack', requireAuth, createRoom);
router.put('/room-rack/:id', requireAuth, updateRoom);
router.delete('/room-rack/:id', requireAuth, deleteRoom);
router.get('/room-rack/:type', requireAuth, getAvailableRoomNumberForType);
router.get('/room-rack/checkIn/:revId/:roomId', requireAuth, checkIn);
router.put('/room-rack/checkOutFromRoom/:roomId', requireAuth, checkOutFromRoom);
router.get('/room-rack/getAllAvailableRoomForType/:type', requireAuth, getAvailableRoomNumberForType);
router.put('/room-rack/changeStatus/:roomId/:type', requireAuth, changeStatus);

// Guests routes
router.get('/guests',requireAuth, getAllGuests);
router.post('/guests',requireAuth, createGuest);
router.put('/guests/:id',requireAuth, updateGuest);
router.delete('/guests/:id',requireAuth, deleteGuest);

// Inventory routes
router.get('/inventory',requireAuth, getAlInventoryItem);
router.post('/inventory', requireAuth,createInventoryItem);
router.put('/inventory/:id', requireAuth,updateInventoryItem);
router.delete('/inventory/:id', requireAuth,deleteInventoryItem);

export default router;