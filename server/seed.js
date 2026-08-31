import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import Guest from './models/Guest.js';
import RoomDetail from './models/RoomDetail.js';
import Room from './models/Room.js';
import Reservation from './models/Reservation.js';
import Housekeeping from './models/Housekeeping.js';
import Inventory from './models/Inventory.js';
import Counter from './models/Counter.js';
import RefreshToken from './models/RefreshToken.js';
import ErrorLog from './models/ErrorLog.js';

const pad = (n) => String(n).padStart(4, '0');

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB');

  // ── Drop all collections ────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Guest.deleteMany({}),
    RoomDetail.deleteMany({}),
    Room.deleteMany({}),
    Reservation.deleteMany({}),
    Housekeeping.deleteMany({}),
    Inventory.deleteMany({}),
    Counter.deleteMany({}),
    RefreshToken.deleteMany({}),
    ErrorLog.deleteMany({}),
  ]);
  console.log('All collections cleared');

  // ── Counters ────────────────────────────────────────────────────────────────
  await mongoose.connection.collection('counters').insertMany([
    { _id: 'customer_id',    seq: 10, reference_value: 'customer_id' },
    { _id: 'reservation_id', seq: 15, reference_value: 'reservation_id' },
  ]);

  // ── Users ───────────────────────────────────────────────────────────────────
  const hash = (pw) => bcrypt.hash(pw, 10);
  await User.insertMany([
    { fname: 'Admin', lname: 'User',  email: 'admin@hotely.com',  role: 'Administrator', password: await hash('Admin@123') },
    { fname: 'Jack',  lname: 'Chong', email: 'jack@hotely.com',   role: 'User',          password: await hash('Staff@123') },
  ]);
  console.log('Users seeded');

  // ── Room Types ──────────────────────────────────────────────────────────────
  const [standard, deluxe, suite, executive] = await RoomDetail.insertMany([
    { name: 'Standard',  description: 'Cozy room with essential amenities.',          price: 99  },
    { name: 'Deluxe',    description: 'Spacious room with premium furnishings.',       price: 149 },
    { name: 'Suite',     description: 'Luxury suite with separate living area.',       price: 249 },
    { name: 'Executive', description: 'Top-floor executive room with panoramic view.', price: 349 },
  ]);
  console.log('Room types seeded');

  // ── Rooms ───────────────────────────────────────────────────────────────────
  const roomDefs = [
    // Standard  101–105
    { roomNumber: 101, roomType: standard._id,  roomStatus: 'Vacant'     },
    { roomNumber: 102, roomType: standard._id,  roomStatus: 'Vacant'     },
    { roomNumber: 103, roomType: standard._id,  roomStatus: 'Occupied'   },
    { roomNumber: 104, roomType: standard._id,  roomStatus: 'Maintenance'},
    { roomNumber: 105, roomType: standard._id,  roomStatus: 'Vacant'     },
    // Deluxe    201–205
    { roomNumber: 201, roomType: deluxe._id,    roomStatus: 'Vacant'     },
    { roomNumber: 202, roomType: deluxe._id,    roomStatus: 'Occupied'   },
    { roomNumber: 203, roomType: deluxe._id,    roomStatus: 'Vacant'     },
    { roomNumber: 204, roomType: deluxe._id,    roomStatus: 'Occupied'   },
    { roomNumber: 205, roomType: deluxe._id,    roomStatus: 'Vacant'     },
    // Suite     301–303
    { roomNumber: 301, roomType: suite._id,     roomStatus: 'Vacant'     },
    { roomNumber: 302, roomType: suite._id,     roomStatus: 'Occupied'   },
    { roomNumber: 303, roomType: suite._id,     roomStatus: 'Out Of Order'},
    // Executive 401–402
    { roomNumber: 401, roomType: executive._id, roomStatus: 'Vacant'     },
    { roomNumber: 402, roomType: executive._id, roomStatus: 'Vacant'     },
  ];
  const rooms = await Room.insertMany(roomDefs);
  const roomByNumber = Object.fromEntries(rooms.map(r => [r.roomNumber, r]));
  console.log('Rooms seeded');

  // ── Guests ──────────────────────────────────────────────────────────────────
  const guestData = [
    { customerId: 'C0001', firstName: 'James',    lastName: 'Carter',   phone: '+60112345001', email: 'james.carter@email.com',   identification: 'A12345671', dateOfBirth: '1985-03-12', nationality: 'Malaysian',    address: '12 Jalan Ampang, Kuala Lumpur' },
    { customerId: 'C0002', firstName: 'Priya',    lastName: 'Sharma',   phone: '+60112345002', email: 'priya.sharma@email.com',    identification: 'A12345672', dateOfBirth: '1990-07-22', nationality: 'Indian',       address: '45 Orchard Road, Singapore'   },
    { customerId: 'C0003', firstName: 'Wei',      lastName: 'Chen',     phone: '+60112345003', email: 'wei.chen@email.com',        identification: 'A12345673', dateOfBirth: '1988-11-05', nationality: 'Chinese',      address: '88 Bukit Bintang, KL'         },
    { customerId: 'C0004', firstName: 'Sarah',    lastName: 'Johnson',  phone: '+60112345004', email: 'sarah.j@email.com',         identification: 'A12345674', dateOfBirth: '1995-02-18', nationality: 'Australian',   address: '10 Collins St, Melbourne'     },
    { customerId: 'C0005', firstName: 'Ahmad',    lastName: 'Razali',   phone: '+60112345005', email: 'ahmad.razali@email.com',    identification: 'A12345675', dateOfBirth: '1982-09-30', nationality: 'Malaysian',    address: '7 Jalan Pudu, KL'             },
    { customerId: 'C0006', firstName: 'Emily',    lastName: 'Wong',     phone: '+60112345006', email: 'emily.wong@email.com',      identification: 'A12345676', dateOfBirth: '1993-06-14', nationality: 'Singaporean',  address: '23 Tanjong Pagar, Singapore'  },
    { customerId: 'C0007', firstName: 'David',    lastName: 'Müller',   phone: '+60112345007', email: 'david.muller@email.com',    identification: 'A12345677', dateOfBirth: '1979-12-01', nationality: 'German',       address: '5 Friedrichstrasse, Berlin'   },
    { customerId: 'C0008', firstName: 'Aisha',    lastName: 'Hassan',   phone: '+60112345008', email: 'aisha.hassan@email.com',    identification: 'A12345678', dateOfBirth: '1997-04-25', nationality: 'Malaysian',    address: '33 Jalan Tuanku Abdul Halt'   },
    { customerId: 'C0009', firstName: 'Michael',  lastName: 'Tan',      phone: '+60112345009', email: 'michael.tan@email.com',     identification: 'A12345679', dateOfBirth: '1986-08-09', nationality: 'Singaporean',  address: '18 Raffles Place, Singapore'  },
    { customerId: 'C0010', firstName: 'Nurul',    lastName: 'Ain',      phone: '+60112345010', email: 'nurul.ain@email.com',       identification: 'A12345680', dateOfBirth: '1991-01-17', nationality: 'Malaysian',    address: '99 Jalan Ipoh, KL'            },
  ];
  const guests = await Guest.insertMany(guestData);
  const g = guests; // shorthand
  console.log('Guests seeded');

  // ── Reservations ────────────────────────────────────────────────────────────
  // Today = 2026-05-29
  const d = (str) => new Date(str);

  const reservationData = [
    // Checked-out (past stays)
    { reservationId: 'R0001', customerId: g[0]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-05-10'), departureDate: d('2026-05-13'), daysOfStay: 3, roomType: deluxe._id,    bookingChannel: 'Online',       checkedIn: true,  checkedOut: true,  cancelled: false, room: roomByNumber[202]._id },
    { reservationId: 'R0002', customerId: g[1]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-05-15'), departureDate: d('2026-05-18'), daysOfStay: 3, roomType: standard._id,  bookingChannel: 'Walk-in',      checkedIn: true,  checkedOut: true,  cancelled: false, room: roomByNumber[103]._id },
    { reservationId: 'R0003', customerId: g[2]._id, numAdults: 2, numChildren: 1, arrivalDate: d('2026-05-18'), departureDate: d('2026-05-22'), daysOfStay: 4, roomType: suite._id,     bookingChannel: 'Travel Agent', checkedIn: true,  checkedOut: true,  cancelled: false, room: roomByNumber[301]._id },
    { reservationId: 'R0004', customerId: g[3]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-05-20'), departureDate: d('2026-05-23'), daysOfStay: 3, roomType: executive._id, bookingChannel: 'Phone',        checkedIn: true,  checkedOut: true,  cancelled: false, room: roomByNumber[401]._id },
    { reservationId: 'R0005', customerId: g[4]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-05-22'), departureDate: d('2026-05-25'), daysOfStay: 3, roomType: standard._id,  bookingChannel: 'Online',       checkedIn: true,  checkedOut: true,  cancelled: false, room: roomByNumber[101]._id },
    // Currently checked-in
    { reservationId: 'R0006', customerId: g[5]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-05-27'), departureDate: d('2026-05-31'), daysOfStay: 4, roomType: deluxe._id,    bookingChannel: 'Online',       checkedIn: true,  checkedOut: false, cancelled: false, room: roomByNumber[204]._id },
    { reservationId: 'R0007', customerId: g[6]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-05-28'), departureDate: d('2026-06-01'), daysOfStay: 4, roomType: suite._id,     bookingChannel: 'Phone',        checkedIn: true,  checkedOut: false, cancelled: false, room: roomByNumber[302]._id },
    { reservationId: 'R0008', customerId: g[7]._id, numAdults: 2, numChildren: 2, arrivalDate: d('2026-05-26'), departureDate: d('2026-05-30'), daysOfStay: 4, roomType: standard._id,  bookingChannel: 'Travel Agent', checkedIn: true,  checkedOut: false, cancelled: false, room: roomByNumber[103]._id },
    // Arriving today
    { reservationId: 'R0009', customerId: g[8]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-05-29'), departureDate: d('2026-06-02'), daysOfStay: 4, roomType: deluxe._id,    bookingChannel: 'Online',       checkedIn: false, checkedOut: false, cancelled: false },
    // Upcoming confirmed
    { reservationId: 'R0010', customerId: g[9]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-05-31'), departureDate: d('2026-06-03'), daysOfStay: 3, roomType: standard._id,  bookingChannel: 'Walk-in',      checkedIn: false, checkedOut: false, cancelled: false },
    { reservationId: 'R0011', customerId: g[0]._id, numAdults: 2, numChildren: 1, arrivalDate: d('2026-06-02'), departureDate: d('2026-06-07'), daysOfStay: 5, roomType: suite._id,     bookingChannel: 'Online',       checkedIn: false, checkedOut: false, cancelled: false },
    { reservationId: 'R0012', customerId: g[1]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-06-05'), departureDate: d('2026-06-08'), daysOfStay: 3, roomType: executive._id, bookingChannel: 'Phone',        checkedIn: false, checkedOut: false, cancelled: false },
    { reservationId: 'R0013', customerId: g[2]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-06-10'), departureDate: d('2026-06-12'), daysOfStay: 2, roomType: standard._id,  bookingChannel: 'Online',       checkedIn: false, checkedOut: false, cancelled: false },
    // Cancelled
    { reservationId: 'R0014', customerId: g[3]._id, numAdults: 2, numChildren: 0, arrivalDate: d('2026-05-25'), departureDate: d('2026-05-28'), daysOfStay: 3, roomType: deluxe._id,    bookingChannel: 'Online',       checkedIn: false, checkedOut: false, cancelled: true  },
    { reservationId: 'R0015', customerId: g[4]._id, numAdults: 1, numChildren: 0, arrivalDate: d('2026-06-01'), departureDate: d('2026-06-03'), daysOfStay: 2, roomType: standard._id,  bookingChannel: 'Walk-in',      checkedIn: false, checkedOut: false, cancelled: true  },
  ];
  await Reservation.insertMany(reservationData);
  console.log('Reservations seeded');

  // ── Update occupied rooms with currentReservation ───────────────────────────
  const reservations = await Reservation.find({ checkedIn: true, checkedOut: false });
  for (const res of reservations) {
    if (res.room) {
      await Room.findByIdAndUpdate(res.room, { currentReservation: res._id, roomStatus: 'Occupied' });
    }
  }

  // ── Housekeeping Tasks ──────────────────────────────────────────────────────
  await Housekeeping.insertMany([
    { type: 'Cleaning',     description: 'Full room cleaning after checkout.',         status: 'Pending',     priority: 'High',   roomId: roomByNumber[101]._id, dueDate: d('2026-05-29') },
    { type: 'Cleaning',     description: 'Daily turndown service.',                    status: 'In Progress', priority: 'Medium', roomId: roomByNumber[202]._id, dueDate: d('2026-05-29') },
    { type: 'Maintenance',  description: 'Fix air conditioning unit.',                 status: 'Pending',     priority: 'High',   roomId: roomByNumber[104]._id, dueDate: d('2026-05-29') },
    { type: 'Inspection',   description: 'Pre-arrival room inspection.',               status: 'Pending',     priority: 'Medium', roomId: roomByNumber[201]._id, dueDate: d('2026-05-30') },
    { type: 'Cleaning',     description: 'Deep clean after extended stay.',            status: 'Completed',   priority: 'High',   roomId: roomByNumber[302]._id, dueDate: d('2026-05-28'), completedDate: d('2026-05-28') },
    { type: 'Maintenance',  description: 'Replace shower head.',                       status: 'Completed',   priority: 'Low',    roomId: roomByNumber[303]._id, dueDate: d('2026-05-27'), completedDate: d('2026-05-27') },
    { type: 'Restocking',   description: 'Replenish minibar and toiletries.',          status: 'In Progress', priority: 'Low',    roomId: roomByNumber[401]._id, dueDate: d('2026-05-29') },
    { type: 'Cleaning',     description: 'Window and curtain cleaning.',               status: 'Pending',     priority: 'Low',    roomId: roomByNumber[301]._id, dueDate: d('2026-05-31') },
  ]);
  console.log('Housekeeping tasks seeded');

  // ── Inventory ───────────────────────────────────────────────────────────────
  await Inventory.insertMany([
    { code: 'LIN-001', name: 'Bath Towel (White)',      description: 'Large white bath towels.',          type: 'Linens',            amount: 120, price: 8.50  },
    { code: 'LIN-002', name: 'Hand Towel (White)',      description: 'Medium white hand towels.',         type: 'Linens',            amount: 85,  price: 5.00  },
    { code: 'LIN-003', name: 'Bed Sheet (King)',        description: 'King size cotton bed sheets.',      type: 'Linens',            amount: 60,  price: 25.00 },
    { code: 'LIN-004', name: 'Pillow Case',             description: 'Standard pillow cases.',            type: 'Linens',            amount: 150, price: 4.50  },
    { code: 'TOI-001', name: 'Shampoo (50ml)',          description: 'Hotel branded shampoo bottles.',    type: 'Toiletries',        amount: 28,  price: 1.20  },
    { code: 'TOI-002', name: 'Conditioner (50ml)',      description: 'Hotel branded conditioner.',        type: 'Toiletries',        amount: 25,  price: 1.20  },
    { code: 'TOI-003', name: 'Soap Bar (30g)',          description: 'Individually wrapped soap bars.',   type: 'Toiletries',        amount: 200, price: 0.80  },
    { code: 'TOI-004', name: 'Body Lotion (50ml)',      description: 'Moisturising body lotion.',         type: 'Toiletries',        amount: 8,   price: 1.50  },
    { code: 'CLN-001', name: 'All-Purpose Cleaner',     description: 'Multi-surface cleaning spray.',     type: 'Cleaning Supplies', amount: 18,  price: 6.00  },
    { code: 'CLN-002', name: 'Disinfectant Wipes',      description: 'Antibacterial surface wipes.',      type: 'Cleaning Supplies', amount: 40,  price: 4.00  },
    { code: 'MBA-001', name: 'Mineral Water (500ml)',   description: 'Complimentary bottled water.',      type: 'Minibar',           amount: 90,  price: 2.50  },
    { code: 'MBA-002', name: 'Cola Can (330ml)',        description: 'Assorted soft drinks.',             type: 'Minibar',           amount: 6,   price: 3.00  },
  ]);
  console.log('Inventory seeded');

  console.log('\n✓ Seed complete.');
  console.log('  Admin login : admin@hotely.com  / Admin@123');
  console.log('  Staff login : jack@hotely.com   / Staff@123');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
