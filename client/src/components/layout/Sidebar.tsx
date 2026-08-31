import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  BedIcon,
  UsersIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
  ShieldIcon,
  ClipboardListIcon,
  ChevronsUpDownIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hotelSettingsApi } from '../../services/api';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';
  const location = useLocation();
  const [hotelName, setHotelName] = useState('Hotel Admin');

  useEffect(() => {
    hotelSettingsApi.get()
      .then(({ settings }) => { if (settings.name) setHotelName(settings.name); })
      .catch(() => {});
  }, []);
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'booking',
  'rooms',
  'guests',
  'finance',
  'staff',
  'settings']
  );
  // Auto-expand section based on active route
  // Close mobile drawer on navigation
  useEffect(() => { onMobileClose?.(); }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/booking') && !expandedSections.includes('booking')) {
      setExpandedSections((prev) => [...prev, 'booking']);
    } else if (path.includes('/staff') && !expandedSections.includes('staff')) {
      setExpandedSections((prev) => [...prev, 'staff']);
    } else if ((path === '/rooms/management' || path === '/rooms/types' || path === '/settings/users' || path === '/settings/hotel') && !expandedSections.includes('settings')) {
      setExpandedSections((prev) => [...prev, 'settings']);
    } else if ((path.includes('/rooms') || path === '/rooms/maintenance') && !expandedSections.includes('rooms')) {
      setExpandedSections((prev) => [...prev, 'rooms']);
    } else if (path.includes('/guests') && !expandedSections.includes('guests')) {
      setExpandedSections((prev) => [...prev, 'guests']);
    } else if (path.includes('/finance') && !expandedSections.includes('finance')) {
      setExpandedSections((prev) => [...prev, 'finance']);
    }
  }, [location.pathname]);
  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
    prev.includes(section) ?
    prev.filter((s) => s !== section) :
    [...prev, section]
    );
  };
  const isExpanded = (section: string) => expandedSections.includes(section);
  const allCollapsed = expandedSections.length === 0;
  const ALL_SECTIONS = isAdmin
    ? ['booking', 'rooms', 'guests', 'finance', 'staff', 'settings']
    : ['booking', 'rooms', 'guests', 'finance', 'staff'];
  const toggleAll = () =>
    setExpandedSections(allCollapsed ? ALL_SECTIONS : []);
  const navLinkClass = ({ isActive }: {isActive: boolean;}) =>
  `flex items-center px-4 py-2 text-sm font-bold rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
  const childNavLinkClass = ({ isActive }: {isActive: boolean;}) =>
  `flex items-center pl-11 pr-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
  const navContent = (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700 shrink-0">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center min-w-0">
          <BedIcon className="w-6 h-6 mr-2 shrink-0" />
          <span className="truncate">{hotelName}</span>
        </h1>
        <button
          onClick={toggleAll}
          title={allCollapsed ? 'Expand all' : 'Collapse all'}
          className="ml-2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
        >
          <ChevronsUpDownIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1">
        {/* Dashboard - Top Level */}
        <NavLink to="/dashboard" className={navLinkClass}>
          <HomeIcon className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>

        <div className="my-4 border-t border-gray-200 dark:border-gray-700 mx-2"></div>

        {/* Booking Section */}
        <div>
          <button
            onClick={() => toggleSection('booking')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">

            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-3" />
              Booking
            </div>
            {isExpanded('booking') ?
            <ChevronDownIcon className="h-3 w-3" /> :

            <ChevronRightIcon className="h-3 w-3" />
            }
          </button>
          {isExpanded('booking') &&
          <div className="mt-1 space-y-1">
              <NavLink to="/booking/reservations" className={childNavLinkClass}>
                Reservation List
              </NavLink>
              <NavLink to="/booking/new" className={childNavLinkClass}>
                New Booking
              </NavLink>
              <NavLink to="/booking/walk-in" className={childNavLinkClass}>
                Walk-In
              </NavLink>
            </div>
          }
        </div>

        {/* Room Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('rooms')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">

            <div className="flex items-center">
              <BedIcon className="h-4 w-4 mr-3" />
              Room
            </div>
            {isExpanded('rooms') ?
            <ChevronDownIcon className="h-3 w-3" /> :

            <ChevronRightIcon className="h-3 w-3" />
            }
          </button>
          {isExpanded('rooms') &&
          <div className="mt-1 space-y-1">
              <NavLink to="/rooms/availability" className={childNavLinkClass}>
                Room Availability
              </NavLink>
              <NavLink to="/rooms/matrix" className={childNavLinkClass}>
                Room Assignment
              </NavLink>
              <NavLink to="/rooms/housekeeping" className={childNavLinkClass}>
                Housekeeping
              </NavLink>
              <NavLink to="/rooms/inventory" className={childNavLinkClass}>
                Inventory
              </NavLink>
              <NavLink to="/rooms/maintenance" className={childNavLinkClass}>
                Maintenance
              </NavLink>
            </div>
          }
        </div>

        {/* Guests Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('guests')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">

            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-3" />
              Guests
            </div>
            {isExpanded('guests') ?
            <ChevronDownIcon className="h-3 w-3" /> :

            <ChevronRightIcon className="h-3 w-3" />
            }
          </button>
          {isExpanded('guests') &&
          <div className="mt-1 space-y-1">
              <NavLink to="/guests/check-in-out" className={childNavLinkClass}>
                Check-In/Out
              </NavLink>
              <NavLink to="/guests/management" className={childNavLinkClass}>
                Guest Management
              </NavLink>
            </div>
          }
        </div>

        {/* Finance Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('finance')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">

            <div className="flex items-center">
              <CreditCardIcon className="h-4 w-4 mr-3" />
              Finance
            </div>
            {isExpanded('finance') ?
            <ChevronDownIcon className="h-3 w-3" /> :

            <ChevronRightIcon className="h-3 w-3" />
            }
          </button>
          {isExpanded('finance') &&
          <div className="mt-1 space-y-1">
              <NavLink to="/finance/billing" className={childNavLinkClass}>
                Billing
              </NavLink>
              <NavLink to="/finance/reports" className={childNavLinkClass}>
                Reports
              </NavLink>
            </div>
          }
        </div>
        {/* Staff Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('staff')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">
            <div className="flex items-center">
              <ClipboardListIcon className="h-4 w-4 mr-3" />
              Staff
            </div>
            {isExpanded('staff') ?
            <ChevronDownIcon className="h-3 w-3" /> :
            <ChevronRightIcon className="h-3 w-3" />
            }
          </button>
          {isExpanded('staff') &&
          <div className="mt-1 space-y-1">
              <NavLink to="/staff/announcements" className={childNavLinkClass}>
                Announcements
              </NavLink>
              <NavLink to="/staff/shifts" className={childNavLinkClass}>
                Shift Schedule
              </NavLink>
              {isAdmin && (
                <NavLink to="/staff/activity-log" className={childNavLinkClass}>
                  Activity Log
                </NavLink>
              )}
            </div>
          }
        </div>

        {/* Settings Section — admin only */}
        {isAdmin && (
          <div className="mt-2">
            <button
              onClick={() => toggleSection('settings')}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors">

              <div className="flex items-center">
                <ShieldIcon className="h-4 w-4 mr-3" />
                Settings
              </div>
              {isExpanded('settings') ?
              <ChevronDownIcon className="h-3 w-3" /> :
              <ChevronRightIcon className="h-3 w-3" />
              }
            </button>
            {isExpanded('settings') &&
            <div className="mt-1 space-y-1">
                <NavLink to="/rooms/management" className={childNavLinkClass}>
                  Room Management
                </NavLink>
                <NavLink to="/rooms/types" className={childNavLinkClass}>
                  Room Types
                </NavLink>
                <NavLink to="/settings/users" className={childNavLinkClass}>
                  User Management
                </NavLink>
                <NavLink to="/settings/hotel" className={childNavLinkClass}>
                  Hotel Settings
                </NavLink>
              </div>
            }
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <SettingsIcon className="h-4 w-4 mr-2" />
          <span>v1.2.0</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col shadow-xl z-50 overflow-y-auto scrollbar-hide">
            {navContent}
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-screen">
        {navContent}
      </div>
    </>
  );
};
export default Sidebar;