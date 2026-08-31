import { z } from 'zod';

/** Wrap a Zod schema into Express middleware. Returns 422 on validation failure. */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return res.status(422).json({ message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  fname:    z.string().min(1, 'First name is required').max(50),
  lname:    z.string().min(1, 'Last name is required').max(50),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const createGuestSchema = z.object({
  firstName:      z.string().min(1).max(100),
  lastName:       z.string().min(1).max(100),
  email:          z.string().email('Invalid email'),
  phone:          z.string().min(1),
  identification: z.string().min(1),
  dateOfBirth:    z.string().min(1),
  nationality:    z.string().min(1),
  address:        z.string().min(1),
  notes:          z.string().optional().default(''),
});

export const createReservationSchema = z.object({
  customerId:     z.string().min(1, 'Guest ID is required'),
  roomType:       z.string().min(1, 'Room type is required'),
  arrivalDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid arrival date'),
  departureDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid departure date'),
  numAdults:      z.coerce.number().int().min(1, 'At least 1 adult required'),
  numChildren:    z.coerce.number().int().min(0).optional().default(0),
  daysOfStay:     z.coerce.number().int().min(1),
  bookingChannel: z.string().min(1, 'Booking channel is required'),
  leadTime:       z.coerce.number().int().min(0).optional().default(0),
});

export const createInventorySchema = z.object({
  code:        z.string().min(1),
  name:        z.string().min(1),
  description: z.string().optional().default(''),
  type:        z.string().min(1),
  amount:      z.coerce.number().int().min(0),
  price:       z.coerce.number().min(0),
});

export const createUserSchema = z.object({
  fname:    z.string().min(1).max(50),
  lname:    z.string().min(1).max(50),
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.enum(['User', 'Administrator']).default('User'),
});
