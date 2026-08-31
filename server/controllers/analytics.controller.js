import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';
import HotelSettings from '../models/HotelSettings.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

const dayStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const addDays  = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// Revenue pipeline: joins roomType, multiplies daysOfStay × price
const revenuePipeline = (matchStage) => [
  { $match: matchStage },
  { $lookup: { from: 'roomdetails', localField: 'roomType', foreignField: '_id', as: 'rt' } },
  { $unwind: { path: '$rt', preserveNullAndEmpty: true } },
  { $addFields: { revenue: { $multiply: ['$daysOfStay', { $ifNull: ['$rt.price', 0] }] } } },
];

// ─── Occupancy trend (existing, kept) ────────────────────────────────────────

export const getOccupancyTrend = async (req, res) => {
  try {
    const days = req.query.period === '90d' ? 90 : 30;
    const totalRooms = await Room.countDocuments();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = dayStart(addDays(new Date(), -i));
      const next = addDays(date, 1);
      const occupied = await Reservation.countDocuments({
        cancelled: false, checkedIn: true, checkedOut: false,
        arrivalDate: { $lt: next }, departureDate: { $gt: date },
      });
      result.push({
        date: date.toISOString().slice(0, 10),
        occupied, total: totalRooms,
        rate: totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0,
      });
    }
    res.json({ trend: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Revenue by room type (existing, kept) ───────────────────────────────────

export const getRevenueByType = async (req, res) => {
  try {
    const rows = await Reservation.aggregate([
      ...revenuePipeline({ cancelled: false }),
      { $group: { _id: '$rt.name', revenue: { $sum: '$revenue' }, count: { $sum: 1 } } },
      { $project: { _id: 0, name: { $ifNull: ['$_id', 'Unknown'] }, revenue: 1, count: 1 } },
      { $sort: { revenue: -1 } },
    ]);
    res.json({ breakdown: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const getKPIs = async (req, res) => {
  try {
    const days = req.query.period === '90d' ? 90 : req.query.period === 'all' ? null : 30;
    const totalRooms = await Room.countDocuments();
    const settings   = await HotelSettings.findOne().lean() ?? {};

    const matchBase = { cancelled: false };
    if (days) matchBase.arrivalDate = { $gte: addDays(new Date(), -days) };

    const [agg, currentOcc] = await Promise.all([
      Reservation.aggregate([
        ...revenuePipeline(matchBase),
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalBookings: { $sum: 1 },
            totalNights:   { $sum: '$daysOfStay' },
          },
        },
      ]),
      Reservation.countDocuments({
        cancelled: false, checkedIn: true, checkedOut: false,
      }),
    ]);

    const data         = agg[0] ?? { totalRevenue: 0, totalBookings: 0, totalNights: 0 };
    const periodDays   = days ?? 365;
    const availableRoomNights = totalRooms * periodDays;
    const revPAR       = availableRoomNights > 0 ? data.totalRevenue / availableRoomNights : 0;
    const adr          = data.totalNights > 0 ? data.totalRevenue / data.totalNights : 0;
    const avgStay      = data.totalBookings > 0 ? data.totalNights / data.totalBookings : 0;
    const occupancyRate = totalRooms > 0 ? Math.round((currentOcc / totalRooms) * 100) : 0;

    res.json({
      totalRevenue:   data.totalRevenue,
      totalBookings:  data.totalBookings,
      totalNights:    data.totalNights,
      revPAR:         Math.round(revPAR * 100) / 100,
      adr:            Math.round(adr * 100) / 100,
      avgStay:        Math.round(avgStay * 10) / 10,
      occupancyRate,
      occupiedRooms:  currentOcc,
      totalRooms,
      currencySymbol: settings.currencySymbol ?? 'RM',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Daily revenue trend ──────────────────────────────────────────────────────

export const getRevenueTrend = async (req, res) => {
  try {
    const days = req.query.period === '90d' ? 90 : 30;
    const from = dayStart(addDays(new Date(), -(days - 1)));

    const rows = await Reservation.aggregate([
      ...revenuePipeline({ cancelled: false, arrivalDate: { $gte: from } }),
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$arrivalDate', timezone: process.env.TZ ?? 'UTC' } },
          revenue:  { $sum: '$revenue' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', revenue: 1, bookings: 1 } },
    ]);

    // Fill in missing days with 0
    const map = Object.fromEntries(rows.map(r => [r.date, r]));
    const trend = [];
    for (let i = 0; i < days; i++) {
      const date = dayStart(addDays(from, i)).toISOString().slice(0, 10);
      trend.push(map[date] ?? { date, revenue: 0, bookings: 0 });
    }
    res.json({ trend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Booking channel breakdown ────────────────────────────────────────────────

export const getBookingChannels = async (req, res) => {
  try {
    const rows = await Reservation.aggregate([
      ...revenuePipeline({ cancelled: false }),
      {
        $group: {
          _id:      '$bookingChannel',
          count:    { $sum: 1 },
          revenue:  { $sum: '$revenue' },
        },
      },
      { $project: { _id: 0, channel: { $ifNull: ['$_id', 'Unknown'] }, count: 1, revenue: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json({ channels: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Monthly summary (last 12 months) ────────────────────────────────────────

export const getMonthlySummary = async (req, res) => {
  try {
    const from = new Date();
    from.setMonth(from.getMonth() - 11);
    from.setDate(1);
    from.setHours(0, 0, 0, 0);

    const rows = await Reservation.aggregate([
      ...revenuePipeline({ cancelled: false, arrivalDate: { $gte: from } }),
      {
        $group: {
          _id: {
            year:  { $year:  { date: '$arrivalDate', timezone: process.env.TZ ?? 'UTC' } },
            month: { $month: { date: '$arrivalDate', timezone: process.env.TZ ?? 'UTC' } },
          },
          revenue:  { $sum: '$revenue' },
          bookings: { $sum: 1 },
          nights:   { $sum: '$daysOfStay' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: { year: '$_id.year', month: '$_id.month', day: 1 },
              },
            },
          },
          revenue: 1, bookings: 1, nights: 1,
        },
      },
    ]);

    // Ensure all 12 months are present
    const map = Object.fromEntries(rows.map(r => [r.month, r]));
    const summary = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(from);
      d.setMonth(d.getMonth() + i);
      const key = d.toISOString().slice(0, 7);
      summary.push(map[key] ?? { month: key, revenue: 0, bookings: 0, nights: 0 });
    }
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
