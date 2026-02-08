import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  PlusCircleIcon,
  BedIcon,
  UsersIcon,
  LogInIcon,
  CreditCardIcon,
  BarChartIcon,
  ClipboardListIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ListIcon,
  PackageIcon,
  SettingsIcon } from
'lucide-react';
const Sidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'booking',
  'rooms',
  'guests',
  'finance']
  );
  // Auto-expand section based on active route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/booking') && !expandedSections.includes('booking')) {
      setExpandedSections((prev) => [...prev, 'booking']);
    } else if (path.includes('/rooms') && !expandedSections.includes('rooms')) {
      setExpandedSections((prev) => [...prev, 'rooms']);
    } else if (
    path.includes('/guests') &&
    !expandedSections.includes('guests'))
    {
      setExpandedSections((prev) => [...prev, 'guests']);
    } else if (
    path.includes('/finance') &&
    !expandedSections.includes('finance'))
    {
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
  const navLinkClass = ({ isActive }: {isActive: boolean;}) =>
  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
  const childNavLinkClass = ({ isActive }: {isActive: boolean;}) =>
  `flex items-center pl-11 pr-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-screen">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700 shrink-0">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
          <BedIcon className="w-6 h-6 mr-2" />
          Hotel Admin
        </h1>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors">

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
            </div>
          }
        </div>

        {/* Room Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('rooms')}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors">

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
              <NavLink to="/rooms/management" className={childNavLinkClass}>
                Room Management
              </NavLink>
              <NavLink to="/rooms/housekeeping" className={childNavLinkClass}>
                Housekeeping
              </NavLink>
              <NavLink to="/rooms/inventory" className={childNavLinkClass}>
                Inventory
              </NavLink>
            </div>
          }
        </div>

        {/* Guests Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection('guests')}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors">

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
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors">

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
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <SettingsIcon className="h-4 w-4 mr-2" />
          <span>v1.2.0</span>
        </div>
      </div>
    </div>);

};
export default Sidebar;