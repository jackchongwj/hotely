import Reservation from '../models/Reservation.js';
import Guest from '../models/Guest.js';
import Housekeeping from '../models/Housekeeping.js';

const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
const toCSV = (headers, rows) =>
  [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');

export const exportReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('customerId', 'firstName lastName customerId')
      .populate('roomType', 'name price')
      .lean();

    const headers = ['Reservation ID','Guest','Customer ID','Room Type','Arrival','Departure','Nights','Channel','Status','Total','Early Check-In','Late Check-Out','Created'];
    const rows = reservations.map(r => {
      const g = r.customerId;
      const rt = r.roomType;
      const status = r.cancelled ? 'Cancelled' : r.checkedOut ? 'Checked Out' : r.checkedIn ? 'Checked In' : 'Confirmed';
      return [
        r.reservationId,
        g ? `${g.firstName} ${g.lastName}` : '',
        g?.customerId ?? '',
        rt?.name ?? '',
        r.arrivalDate?.toISOString().slice(0,10) ?? '',
        r.departureDate?.toISOString().slice(0,10) ?? '',
        r.daysOfStay ?? '',
        r.bookingChannel ?? '',
        status,
        (rt?.price ?? 0) * (r.daysOfStay ?? 0),
        r.earlyCheckIn ? 'Yes' : 'No',
        r.lateCheckOut ? 'Yes' : 'No',
        r.created_at?.toISOString().slice(0,10) ?? '',
      ];
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reservations.csv"');
    res.send(toCSV(headers, rows));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportGuests = async (req, res) => {
  try {
    const guests = await Guest.find().lean();
    const headers = ['Customer ID','First Name','Last Name','Email','Phone','Nationality','Identification','Date of Birth','Address','Notes'];
    const rows = guests.map(g => [
      g.customerId, g.firstName, g.lastName, g.email, g.phone,
      g.nationality, g.identification,
      g.dateOfBirth instanceof Date ? g.dateOfBirth.toISOString().slice(0,10) : (g.dateOfBirth ?? ''),
      g.address, g.notes ?? '',
    ]);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="guests.csv"');
    res.send(toCSV(headers, rows));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportHousekeeping = async (req, res) => {
  try {
    const tasks = await Housekeeping.find().populate('roomId', 'roomNumber').populate('assignedTo', 'fname lname').lean();
    const headers = ['Type','Category','Description','Room','Priority','Status','Assigned To','Due Date','Created'];
    const rows = tasks.map(t => {
      const room = t.roomId;
      const user = t.assignedTo;
      return [
        t.type, t.category ?? 'Housekeeping', t.description,
        room?.roomNumber ?? '', t.priority, t.status,
        user ? `${user.fname} ${user.lname}` : '',
        t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : '',
        t.createdDate ? new Date(t.createdDate).toISOString().slice(0,10) : '',
      ];
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="housekeeping.csv"');
    res.send(toCSV(headers, rows));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
