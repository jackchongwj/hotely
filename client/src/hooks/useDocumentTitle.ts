import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/booking/reservations':'Reservation List',
  '/booking/new':         'New Booking',
  '/booking/calendar':    'Booking Calendar',
  '/booking/walk-in':     'Walk-In Check-In',
  '/rooms/availability':  'Room Availability',
  '/rooms/matrix':        'Room Assignment',
  '/rooms/management':    'Room Management',
  '/rooms/housekeeping':  'Housekeeping',
  '/rooms/inventory':     'Inventory',
  '/rooms/types':         'Room Types',
  '/guests/check-in-out': 'Check-In / Out',
  '/guests/management':   'Guest Management',
  '/finance/billing':     'Billing & Invoicing',
  '/finance/reports':     'Reports & Analytics',
  '/staff/announcements': 'Announcements',
  '/staff/shifts':        'Shift Schedule',
  '/staff/activity-log':  'Activity Log',
  '/settings/users':      'User Management',
  '/settings/hotel':      'Hotel Settings',
};

const BASE = 'Hotel Admin';

const useDocumentTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = PAGE_TITLES[pathname];
    document.title = page ? `${page} — ${BASE}` : BASE;
  }, [pathname]);
};

export default useDocumentTitle;
