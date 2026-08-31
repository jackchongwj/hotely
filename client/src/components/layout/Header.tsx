import React, { useEffect, useRef, useState } from 'react';
import {
  BellIcon, UserIcon, MenuIcon, MoonIcon, SunIcon, LogOutIcon,
  CheckCircleIcon, CalendarPlusIcon, LogInIcon, XCircleIcon,
  CalendarDaysIcon, AlertTriangleIcon, ClipboardListIcon, CheckSquareIcon,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/booking/reservations': 'Reservation List',
  '/booking/new': 'New Booking',
  '/rooms/availability': 'Room Availability',
  '/rooms/management': 'Room Management',
  '/rooms/housekeeping': 'Housekeeping',
  '/rooms/inventory': 'Inventory',
  '/guests/check-in-out': 'Check-In / Out',
  '/guests/management': 'Guest Management',
  '/finance/billing': 'Billing & Invoicing',
  '/finance/reports': 'Reports & Analytics',
  '/rooms/types': 'Room Types',
  '/settings/users': 'User Management',
  '/booking/walk-in': 'Walk-In Check-In',
  '/rooms/matrix': 'Room Assignment',
  '/staff/activity-log': 'Activity Log',
  '/staff/announcements': 'Announcements',
  '/staff/shifts': 'Shift Schedule',
  '/settings/hotel': 'Hotel Settings',
};

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  new_booking:             <CalendarPlusIcon   className="w-4 h-4 text-blue-500" />,
  check_in:                <LogInIcon          className="w-4 h-4 text-green-500" />,
  check_out:               <LogOutIcon         className="w-4 h-4 text-gray-500" />,
  cancelled:               <XCircleIcon        className="w-4 h-4 text-red-500" />,
  extended:                <CalendarDaysIcon   className="w-4 h-4 text-blue-400" />,
  low_stock:               <AlertTriangleIcon  className="w-4 h-4 text-amber-500" />,
  housekeeping_created:    <ClipboardListIcon  className="w-4 h-4 text-purple-500" />,
  housekeeping_completed:  <CheckSquareIcon    className="w-4 h-4 text-green-500" />,
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

interface HeaderProps { onMobileMenuToggle?: () => void; }

const Header = ({ onMobileMenuToggle }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } = useSocket();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const title = PAGE_TITLES[location.pathname] ?? 'Hotel Management System';
  const displayName = user ? `${user.fname} ${user.lname}` : '';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleNotifClick = (notif: typeof notifications[0]) => {
    if (!notif.read) markNotificationRead(notif._id);
    if (notif.link) {
      navigate(notif.link);
      setNotifOpen(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center">
        <button onClick={onMobileMenuToggle} className="p-1 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700">
          <MenuIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 ml-2 md:ml-0">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <SunIcon className="h-5 w-5 text-yellow-400" />
            : <MoonIcon className="h-5 w-5 text-gray-500" />}
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="p-1 rounded-md relative hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</span>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCircleIcon className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto scrollbar-hide divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">No notifications</p>
                ) : [...notifications].reverse().map(n => (
                  <button
                    key={n._id}
                    onClick={() => handleNotifClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors ${
                      !n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {NOTIF_ICONS[n.type] ?? <BellIcon className="w-4 h-4 text-gray-400" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-1">
            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
            {displayName}
          </span>
          {user?.role === 'Administrator' && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded hidden md:inline">
              Admin
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Logout"
        >
          <LogOutIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;
