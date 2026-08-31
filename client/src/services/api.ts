// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: 'User' | 'Administrator';
}

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface StaffUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: 'User' | 'Administrator';
}

export interface RoomDetail {
  _id: string;
  name: string;
  description?: string;
  price: number;
}

export interface Room {
  _id: string;
  roomNumber: number;
  roomType: RoomDetail | string;
  roomStatus: 'Vacant' | 'Occupied' | 'Maintenance' | 'Out Of Order';
  housekeeping?: HousekeepingTask | string | null;
  currentReservation?: Reservation | string | null;
}

export interface GuestDocument {
  _id: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
}

export interface Guest {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  identification: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  notes?: string;
  documents?: GuestDocument[];
}

export interface Reservation {
  _id: string;
  reservationId: string;
  customerId: Guest | string;
  numAdults: number;
  numChildren?: number;
  arrivalDate: string;
  departureDate: string;
  daysOfStay: number;
  roomType: RoomDetail | string;
  bookingChannel: string;
  checkedIn: boolean;
  checkedOut: boolean;
  cancelled: boolean;
  room?: Room | string | null;
  earlyCheckIn?: boolean;
  lateCheckOut?:  boolean;
  noShow?:        boolean;
  created_at: string;
}

export interface HousekeepingTask {
  _id: string;
  type: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  category?: 'Housekeeping' | 'Maintenance';
  assignedTo?: AuthUser | string | null;
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  roomId: Room | string;
}

export interface InventoryItem {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  amount: number;
  price: number;
}

export interface DashboardStats {
  occupancy?: { occupied: number; total: number; rate: number };
  currentGuests?: number;
  expectedArrivals?: number;
  expectedDepartures?: number;
  dailyRevenue?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive a human-readable status from boolean flags */
export function reservationStatus(r: Reservation): string {
  if (r.noShow) return 'No-Show';
  if (r.cancelled) return 'Cancelled';
  if (r.checkedOut) return 'Checked Out';
  if (r.checkedIn) return 'Checked In';
  return 'Confirmed';
}

/** Compute total price client-side since it's not stored in the schema */
export function reservationTotal(r: Reservation): number {
  const price = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).price : 0;
  return r.daysOfStay * price;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }),

  validate: () =>
    request<{ valid: boolean; user?: AuthUser }>('/auth/validate'),

  register: (data: { fname: string; lname: string; email: string; password: string }) =>
    request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getOccupancy: () =>
    request<{ occupied: number; total: number; rate: number }>('/api/dashboard/getOccupancy'),
  getCurrentGuests: () =>
    request<{ count: number }>('/api/dashboard/getCurrentGuests'),
  getArrivals: () =>
    request<{ count: number }>('/api/dashboard/getArrivals'),
  getDepartures: () =>
    request<{ count: number }>('/api/dashboard/getDepartures'),
  getDailyRevenue: () =>
    request<{ revenue: number }>('/api/dashboard/getDailyRevenue'),
};

// ─── Reservation API ──────────────────────────────────────────────────────────

// Calendar types
export interface CalendarReservation {
  _id: string;
  reservationId: string;
  customerId: { firstName: string; lastName: string } | null;
  roomType: { _id: string; name: string } | null;
  arrivalDate: string;
  departureDate: string;
  checkedIn: boolean;
  checkedOut: boolean;
}

export interface CalendarRoom {
  _id: string;
  roomNumber: number;
  roomType: { _id: string; name: string } | null;
  roomStatus: string;
  reservations: CalendarReservation[];
}

export const reservationApi = {
  getAll: (page = 1, limit = 20, search = '', status = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return request<{ reservations: Reservation[]; total: number; page: number; pages: number }>(
      `/api/reservation-list?${params}`
    );
  },

  create: (data: {
    customerId: string;
    numAdults: number;
    numChildren?: number;
    arrivalDate: string;
    departureDate: string;
    daysOfStay: number;
    roomType: string;
    bookingChannel: string;
  }) =>
    request<{ message: string; reservation: Reservation }>('/api/reservation-list', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  edit: (id: string, data: {
    guestId?: string; roomType?: string;
    arrivalDate?: string; departureDate?: string;
    numAdults?: number; numChildren?: number; bookingChannel?: string;
  }) =>
    request<{ message: string; reservation: Reservation }>(`/api/reservation-list/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    request<{ message: string }>(`/api/reservation-list/${id}`, { method: 'PUT' }),

  extend: (id: string, departureDate: string) =>
    request<{ message: string }>(`/api/reservation-list/${id}/extend`, {
      method: 'PUT',
      body: JSON.stringify({ departureDate }),
    }),

  checkIn: (id: string, roomId: string) =>
    request<{ message: string }>(`/api/reservation-list/${id}/check-in`, {
      method: 'PUT',
      body: JSON.stringify({ roomId }),
    }),

  checkOut: (id: string) =>
    request<{ message: string }>(`/api/reservation-list/${id}/check-out`, { method: 'PUT' }),

  setFlags: (id: string, flags: { earlyCheckIn?: boolean; lateCheckOut?: boolean }) =>
    request<{ message: string; reservation: Reservation }>(`/api/reservation-list/${id}/flags`, {
      method: 'PATCH',
      body: JSON.stringify(flags),
    }),

  markNoShow: (id: string) =>
    request<{ message: string; reservation: Reservation }>(`/api/reservation-list/${id}/no-show`, { method: 'PATCH' }),

  scan: (code: string) =>
    request<{ reservation: Reservation; vacantRooms: Room[] }>(`/api/reservation-list/scan/${encodeURIComponent(code)}`),
};

// ─── Room API ─────────────────────────────────────────────────────────────────

export const roomApi = {
  getAll: () =>
    request<{ rooms: Room[] }>('/api/room-rack'),

  getTypes: () =>
    request<{ roomDetails: RoomDetail[] }>('/api/room-types'),

  create: (data: { roomNumber: number; roomType: string }) =>
    request<{ message: string; room: Room }>('/api/room-rack', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Room>) =>
    request<{ message: string; room: Room }>(`/api/room-rack/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/room-rack/${id}`, { method: 'DELETE' }),
};

// ─── Guest API ────────────────────────────────────────────────────────────────

export const guestApi = {
  getAll: (page = 1, limit = 20, search = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return request<{ guests: Guest[]; total: number; page: number; pages: number }>(
      `/api/guests?${params}`
    );
  },

  getReservations: (id: string) =>
    request<{ reservations: Reservation[] }>(`/api/guests/${id}/reservations`),

  create: (data: Omit<Guest, '_id' | 'customerId'>) =>
    request<{ message: string; guest: Guest }>('/api/guests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Guest>) =>
    request<{ message: string; guest: Guest }>(`/api/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/guests/${id}`, { method: 'DELETE' }),

  checkDuplicates: (firstName: string, lastName: string, identification: string) =>
    request<{ duplicates: Guest[] }>(
      `/api/guests/check-duplicates?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&identification=${encodeURIComponent(identification)}`
    ),

  uploadDocument: (id: string, file: File): Promise<{ message: string; guest: Guest }> =>
    fetch(`/api/guests/${id}/documents`, {
      method: 'POST',
      credentials: 'include',
      body: (() => { const f = new FormData(); f.append('document', file); return f; })(),
    }).then(async r => {
      if (!r.ok) { const b = await r.json().catch(() => ({})); throw new Error(b.message || `Upload failed: ${r.status}`); }
      return r.json();
    }),

  deleteDocument: (id: string, docId: string) =>
    request<{ message: string }>(`/api/guests/${id}/documents/${docId}`, { method: 'DELETE' }),
};

// ─── Housekeeping API ─────────────────────────────────────────────────────────

export const housekeepingApi = {
  getAll: (category?: 'Housekeeping' | 'Maintenance') =>
    request<{ tasks: HousekeepingTask[] }>(`/api/housekeeping${category ? `?category=${category}` : ''}`),

  create: (data: {
    type: string;
    description: string;
    priority: HousekeepingTask['priority'];
    roomId: string;
    assignedTo?: string;
    dueDate?: string;
    category?: 'Housekeeping' | 'Maintenance';
  }) =>
    request<{ message: string; task: HousekeepingTask }>('/api/housekeeping', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<HousekeepingTask>) =>
    request<{ message: string; task: HousekeepingTask }>(`/api/housekeeping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/housekeeping/${id}`, { method: 'DELETE' }),
};

// ─── Inventory API ────────────────────────────────────────────────────────────

export const inventoryApi = {
  getAll: (page = 1, limit = 20, search = '', type = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (type && type !== 'all') params.set('type', type);
    return request<{ inventory: InventoryItem[]; total: number; page: number; pages: number }>(
      `/api/inventory?${params}`
    );
  },

  create: (data: Omit<InventoryItem, '_id'>) =>
    request<{ message: string; inventory: InventoryItem }>('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<InventoryItem>) =>
    request<{ message: string; inventory: InventoryItem }>(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/inventory/${id}`, { method: 'DELETE' }),
};

// ─── Room Detail API (admin) ───────────────────────────────────────────────────

export const roomDetailApi = {
  getAll: () =>
    request<{ roomDetails: RoomDetail[] }>('/api/room-detail'),

  create: (data: Omit<RoomDetail, '_id'>) =>
    request<{ message: string; roomDetail: RoomDetail }>('/api/room-detail', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<RoomDetail>) =>
    request<{ message: string; roomDetail: RoomDetail }>(`/api/room-detail/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/room-detail/${id}`, { method: 'DELETE' }),
};

// ─── User Management API (admin) ──────────────────────────────────────────────

export const userApi = {
  getAll: () =>
    request<{ users: StaffUser[] }>('/api/users'),

  create: (data: { fname: string; lname: string; email: string; password: string; role: string }) =>
    request<{ message: string; user: StaffUser }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<StaffUser> & { password?: string }) =>
    request<{ message: string; user: StaffUser }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/users/${id}`, { method: 'DELETE' }),

  invalidateSessions: (userId: string) =>
    request<{ message: string }>(`/auth/sessions/${userId}`, { method: 'DELETE' }),

  invalidateAllSessions: () =>
    request<{ message: string }>('/auth/sessions', { method: 'DELETE' }),
};

// ─── Calendar API ─────────────────────────────────────────────────────────────

export const calendarApi = {
  get: (start: string, end: string) =>
    request<{ rooms: CalendarRoom[]; unassigned: CalendarReservation[] }>(
      `/api/calendar?start=${start}&end=${end}`
    ),
};

// ─── Staff list API (all authenticated users) ────────────────────────────────

export interface StaffMember {
  _id: string;
  fname: string;
  lname: string;
  role: string;
}

export const staffApi = {
  getList: () => request<{ staff: StaffMember[] }>('/api/staff'),
};

// ─── Notification API ─────────────────────────────────────────────────────────

export const notificationApi = {
  getAll: () =>
    request<{ notifications: NotificationItem[] }>('/api/notifications'),

  markRead: (id: string) =>
    request<{ message: string }>(`/api/notifications/${id}/read`, { method: 'PUT' }),

  markAllRead: () =>
    request<{ message: string }>('/api/notifications/read-all', { method: 'PUT' }),
};

// ─── Invoice API ──────────────────────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'void';
export type PaymentMethod = 'cash' | 'card' | 'ewallet' | 'bank_transfer' | 'other';

export interface InvoicePayment {
  _id: string;
  method: PaymentMethod;
  amount: number;
  reference: string;
  paidAt: string;
  recordedBy?: { fname: string; lname: string } | null;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  reservationId: Reservation | string;
  guestId: Guest | string | null;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  payments: InvoicePayment[];
  amountPaid: number;
  balance: number;
  dueDate?: string;
  notes?: string;
  sentAt?: string;
  createdAt: string;
}

export const invoiceApi = {
  getOrCreate: (reservationId: string) =>
    request<{ invoice: Invoice }>(`/api/invoices/reservation/${reservationId}`),

  recordPayment: (id: string, data: { method: PaymentMethod; amount: number; reference?: string }) =>
    request<{ invoice: Invoice }>(`/api/invoices/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  send: (id: string) =>
    request<{ message: string; invoice: Invoice }>(`/api/invoices/${id}/send`, { method: 'POST' }),

  void: (id: string) =>
    request<{ invoice: Invoice }>(`/api/invoices/${id}/void`, { method: 'PUT' }),

  pdfUrl: (id: string) => `/api/invoices/${id}/pdf`,
};

// ─── Activity Log API ─────────────────────────────────────────────────────────

export interface ActivityLogEntry {
  _id: string;
  userId: { _id: string; fname: string; lname: string; role: string } | null;
  action: string;
  description: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export const activityApi = {
  getAll: (page = 1, limit = 50, action = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (action) params.set('action', action);
    return request<{ logs: ActivityLogEntry[]; total: number; page: number; pages: number }>(
      `/api/activity-log?${params}`
    );
  },
};

// ─── Hotel Settings API ───────────────────────────────────────────────────────

export interface HotelSettings {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  checkInTime: string;
  checkOutTime: string;
  taxRate: number;
  currency: string;
  currencySymbol: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
}

export const hotelSettingsApi = {
  get: () => request<{ settings: HotelSettings }>('/api/settings/hotel'),
  update: (data: Partial<HotelSettings>) =>
    request<{ message: string; settings: HotelSettings }>('/api/settings/hotel', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Announcements API ────────────────────────────────────────────────────────

export interface Announcement {
  _id: string;
  authorId: { _id: string; fname: string; lname: string } | null;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export const announcementApi = {
  getAll: () => request<{ announcements: Announcement[] }>('/api/announcements'),
  create: (data: { title: string; content: string; pinned?: boolean }) =>
    request<{ message: string; announcement: Announcement }>('/api/announcements', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Announcement>) =>
    request<{ message: string; announcement: Announcement }>(`/api/announcements/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/announcements/${id}`, { method: 'DELETE' }),
};

// ─── Shifts API ───────────────────────────────────────────────────────────────

export interface Shift {
  _id: string;
  userId: { _id: string; fname: string; lname: string; role: string } | null;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  notes: string;
  createdAt: string;
}

export const shiftApi = {
  getAll: (start?: string, end?: string) =>
    request<{ shifts: Shift[] }>(`/api/shifts${start ? `?start=${start}&end=${end}` : ''}`),
  create: (data: { userId: string; date: string; startTime: string; endTime: string; department: string; notes?: string }) =>
    request<{ message: string; shift: Shift }>('/api/shifts', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Shift>) =>
    request<{ message: string; shift: Shift }>(`/api/shifts/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),
  delete: (id: string) => request<{ message: string }>(`/api/shifts/${id}`, { method: 'DELETE' }),
};

// ─── Analytics API ────────────────────────────────────────────────────────────

export const analyticsApi = {
  getOccupancyTrend: (period?: '30d' | '90d') =>
    request<{ trend: Array<{ date: string; occupied: number; total: number; rate: number }> }>(
      `/api/analytics/occupancy-trend${period ? `?period=${period}` : ''}`
    ),
  getRevenueByType: () =>
    request<{ breakdown: Array<{ name: string; revenue: number; count: number }> }>(
      '/api/analytics/revenue-by-type'
    ),
  getKPIs: (period?: '30d' | '90d' | 'all') =>
    request<{
      totalRevenue: number; totalBookings: number; totalNights: number;
      revPAR: number; adr: number; avgStay: number;
      occupancyRate: number; occupiedRooms: number; totalRooms: number;
      currencySymbol: string;
    }>(`/api/analytics/kpis${period ? `?period=${period}` : ''}`),
  getRevenueTrend: (period?: '30d' | '90d') =>
    request<{ trend: Array<{ date: string; revenue: number; bookings: number }> }>(
      `/api/analytics/revenue-trend${period ? `?period=${period}` : ''}`
    ),
  getBookingChannels: () =>
    request<{ channels: Array<{ channel: string; count: number; revenue: number }> }>(
      '/api/analytics/booking-channels'
    ),
  getMonthlySummary: () =>
    request<{ summary: Array<{ month: string; revenue: number; bookings: number; nights: number }> }>(
      '/api/analytics/monthly'
    ),
};

// ─── Folio API ────────────────────────────────────────────────────────────────

export interface FolioCharge {
  _id: string;
  reservationId: string;
  description: string;
  amount: number;
  category: string;
  addedBy?: { fname: string; lname: string } | null;
  createdAt: string;
}

export const folioApi = {
  getAll: (reservationId: string) =>
    request<{ charges: FolioCharge[]; total: number }>(`/api/folio?reservationId=${reservationId}`),

  add: (data: { reservationId: string; description: string; amount: number; category?: string }) =>
    request<{ charge: FolioCharge }>('/api/folio', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/folio/${id}`, { method: 'DELETE' }),
};

// ─── Maintenance API ──────────────────────────────────────────────────────────

export type TicketStatus   = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'plumbing' | 'electrical' | 'hvac' | 'furniture' | 'appliance' | 'cleaning' | 'other';

export interface MaintenanceTicket {
  _id: string;
  ticketNumber: string;
  roomId?: { _id: string; roomNumber: number; roomStatus: string } | null;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy?: { fname: string; lname: string } | null;
  assignedTo?: { fname: string; lname: string } | null;
  resolutionNotes: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  resolved: number;
  urgent: number;
}

export const maintenanceApi = {
  getAll: (params?: { status?: string; priority?: string; category?: string; roomId?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status)   q.set('status',   params.status);
    if (params?.priority) q.set('priority', params.priority);
    if (params?.category) q.set('category', params.category);
    if (params?.roomId)   q.set('roomId',   params.roomId);
    if (params?.page)     q.set('page',     String(params.page));
    if (params?.limit)    q.set('limit',    String(params.limit));
    return request<{ tickets: MaintenanceTicket[]; total: number; pages: number; page: number }>(
      `/api/maintenance?${q.toString()}`
    );
  },

  getStats: () => request<TicketStats>('/api/maintenance/stats'),

  create: (data: {
    title: string;
    description?: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    roomId?: string;
    assignedTo?: string;
  }) => request<{ ticket: MaintenanceTicket }>('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<{
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    assignedTo: string | null;
    resolutionNotes: string;
  }>) => request<{ ticket: MaintenanceTicket }>(`/api/maintenance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => request<{ message: string }>(`/api/maintenance/${id}`, { method: 'DELETE' }),
};
