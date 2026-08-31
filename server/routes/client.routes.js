import express from 'express';
import { requireAuth, requireAdminAuth } from '../middleware/auth.middleware.js';
import { validate, createReservationSchema, createGuestSchema, createInventorySchema, createUserSchema } from '../middleware/validate.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { dashboard, getOccupancy, getExpectedArrivals, getCurrentGuests, getExpectedDepartures, getDailyRevenue } from '../controllers/dashboard.controller.js';
import { createReservation, getAllReservations, cancelReservation, editReservation, extendReservation, checkOutReservation, checkInReservation, setReservationFlags, markNoShow, scanReservation } from '../controllers/reservation.controller.js';
import { getCalendar } from '../controllers/calendar.controller.js';
import { getAvailableRooms, createRoom, updateRoom, getAllRooms, deleteRoom } from '../controllers/room.controller.js';
import { createGuest, deleteGuest, updateGuest, getAllGuests, getGuestReservations, checkDuplicates, uploadDocument, deleteDocument } from '../controllers/guest.controller.js';
import { getStaffList, getAllUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { createTask, getAllTasks, getTasksByRoomId, updateTask, deleteTask } from '../controllers/housekeeping.controller.js';
import { createRoomDetail, getAllRoomDetails, updateRoomDetail, deleteRoomDetail } from '../controllers/roomdetail.controller.js';
import { getAllInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/inventory.controller.js';
import { getNotifications, markRead, markAllRead } from '../controllers/notification.controller.js';
import { getActivityLogs } from '../controllers/activityLog.controller.js';
import { getHotelSettings, updateHotelSettings } from '../controllers/hotelSettings.controller.js';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { getShifts, createShift, updateShift, deleteShift } from '../controllers/shift.controller.js';
import { getOccupancyTrend, getRevenueByType, getKPIs, getRevenueTrend, getBookingChannels, getMonthlySummary } from '../controllers/analytics.controller.js';
import { getFolioCharges, addFolioCharge, deleteFolioCharge } from '../controllers/folio.controller.js';
import { exportReservations, exportGuests, exportHousekeeping } from '../controllers/export.controller.js';
import { getOrCreateInvoice, recordPayment, voidInvoice, sendInvoice, getInvoicePDF } from '../controllers/invoice.controller.js';
import { getAllTickets, createTicket, updateTicket, deleteTicket, getTicketStats } from '../controllers/maintenance.controller.js';

const router = express.Router();

// Dashboard routes
router.get('/dashboard', requireAuth, dashboard);
router.get('/dashboard/getOccupancy', requireAuth, getOccupancy);
router.get('/dashboard/getCurrentGuests', requireAuth, getCurrentGuests);
router.get('/dashboard/getArrivals', requireAuth, getExpectedArrivals);
router.get('/dashboard/getDepartures', requireAuth, getExpectedDepartures);
router.get('/dashboard/getDailyRevenue', requireAuth, getDailyRevenue);

// Reservation routes
router.get('/reservation-list', requireAuth, getAllReservations);
router.post('/reservation-list', requireAuth, validate(createReservationSchema), createReservation);
router.put('/reservation-list/:id', requireAuth, cancelReservation);
router.patch('/reservation-list/:id', requireAuth, editReservation);
router.patch('/reservation-list/:id/flags', requireAuth, setReservationFlags);
router.put('/reservation-list/:id/extend', requireAuth, extendReservation);
router.get('/calendar', requireAuth, getCalendar);
router.put('/reservation-list/:id/check-in', requireAuth, checkInReservation);
router.put('/reservation-list/:id/check-out', requireAuth, checkOutReservation);
router.patch('/reservation-list/:id/no-show', requireAuth, markNoShow);
router.get('/reservation-list/scan/:code',   requireAuth, scanReservation);

// Room routes
router.get('/rooms/available', requireAuth, getAvailableRooms);
router.get('/room-rack', requireAuth, getAllRooms);
router.post('/room-rack', requireAuth, createRoom);
router.put('/room-rack/:id', requireAuth, updateRoom);
router.delete('/room-rack/:id', requireAuth, deleteRoom);

// Room types — non-admin read access for booking forms
router.get('/room-types', requireAuth, getAllRoomDetails);

// Room settings routes (admin only)
router.get('/room-detail', requireAdminAuth, getAllRoomDetails);
router.post('/room-detail', requireAdminAuth, createRoomDetail);
router.put('/room-detail/:id', requireAdminAuth, updateRoomDetail);
router.delete('/room-detail/:id', requireAdminAuth, deleteRoomDetail);

// Housekeeping routes
router.get('/housekeeping', requireAuth, getAllTasks);
router.get('/housekeeping/:roomId', requireAuth, getTasksByRoomId);
router.post('/housekeeping', requireAuth, createTask);
router.put('/housekeeping/:id', requireAuth, updateTask);
router.delete('/housekeeping/:id', requireAuth, deleteTask);

// Guests routes — static sub-paths before /:id param routes
router.get('/guests/check-duplicates', requireAuth, checkDuplicates);
router.get('/guests', requireAuth, getAllGuests);
router.get('/guests/:id/reservations', requireAuth, getGuestReservations);
router.post('/guests', requireAuth, validate(createGuestSchema), createGuest);
router.put('/guests/:id', requireAuth, updateGuest);
router.delete('/guests/:id', requireAuth, deleteGuest);
router.post('/guests/:id/documents', requireAuth, upload.single('document'), uploadDocument);
router.delete('/guests/:id/documents/:docId', requireAuth, deleteDocument);

// Staff list (all authenticated users)
router.get('/staff', requireAuth, getStaffList);

// User management routes (admin only)
router.get('/users', requireAdminAuth, getAllUsers);
router.post('/users', requireAdminAuth, validate(createUserSchema), createUser);
router.get('/users/:id', requireAdminAuth, getUser);
router.put('/users/:id', requireAdminAuth, updateUser);
router.delete('/users/:id', requireAdminAuth, deleteUser);

// Inventory routes
router.get('/inventory', requireAuth, getAllInventoryItems);
router.post('/inventory', requireAuth, validate(createInventorySchema), createInventoryItem);
router.put('/inventory/:id', requireAuth, updateInventoryItem);
router.delete('/inventory/:id', requireAuth, deleteInventoryItem);

// Notification routes
router.get('/notifications', requireAuth, getNotifications);
router.put('/notifications/read-all', requireAuth, markAllRead);
router.put('/notifications/:id/read', requireAuth, markRead);

// Activity log
router.get('/activity-log', requireAuth, getActivityLogs);

// Folio / in-stay charges
router.get('/folio', requireAuth, getFolioCharges);
router.post('/folio', requireAuth, addFolioCharge);
router.delete('/folio/:id', requireAuth, deleteFolioCharge);

// Hotel settings (admin only for write)
router.get('/settings/hotel', requireAuth, getHotelSettings);
router.put('/settings/hotel', requireAdminAuth, updateHotelSettings);

// Announcements
router.get('/announcements', requireAuth, getAnnouncements);
router.post('/announcements', requireAuth, createAnnouncement);
router.put('/announcements/:id', requireAuth, updateAnnouncement);
router.delete('/announcements/:id', requireAuth, deleteAnnouncement);

// Shifts
router.get('/shifts', requireAuth, getShifts);
router.post('/shifts', requireAdminAuth, createShift);
router.put('/shifts/:id', requireAdminAuth, updateShift);
router.delete('/shifts/:id', requireAdminAuth, deleteShift);

// Analytics
router.get('/analytics/occupancy-trend',  requireAuth, getOccupancyTrend);
router.get('/analytics/revenue-by-type',  requireAuth, getRevenueByType);
router.get('/analytics/kpis',             requireAuth, getKPIs);
router.get('/analytics/revenue-trend',    requireAuth, getRevenueTrend);
router.get('/analytics/booking-channels', requireAuth, getBookingChannels);
router.get('/analytics/monthly',          requireAuth, getMonthlySummary);

// Data export
router.get('/export/reservations', requireAuth, exportReservations);
router.get('/export/guests', requireAuth, exportGuests);
router.get('/export/housekeeping', requireAuth, exportHousekeeping);

// Invoice management
router.get( '/invoices/reservation/:reservationId', requireAuth,      getOrCreateInvoice);
router.post('/invoices/:id/payment',                requireAuth,      recordPayment);
router.post('/invoices/:id/send',                   requireAuth,      sendInvoice);
router.put( '/invoices/:id/void',                   requireAdminAuth, voidInvoice);
router.get( '/invoices/:id/pdf',                    requireAuth,      getInvoicePDF);

// Maintenance tickets
router.get('/maintenance',          requireAuth,      getAllTickets);
router.get('/maintenance/stats',    requireAuth,      getTicketStats);
router.post('/maintenance',         requireAuth,      createTicket);
router.put('/maintenance/:id',      requireAuth,      updateTicket);
router.delete('/maintenance/:id',   requireAdminAuth, deleteTicket);

export default router;
