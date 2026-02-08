import React from 'react';
import { BellIcon, UserIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    // Dashboard
    if (path === '/dashboard') return 'Dashboard';
    // Booking
    if (path === '/booking/reservations') return 'Reservation List';
    if (path === '/booking/new') return 'New Booking';
    // Rooms
    if (path === '/rooms/availability') return 'Room Availability';
    if (path === '/rooms/management') return 'Room Management';
    if (path === '/rooms/housekeeping') return 'Housekeeping';
    if (path === '/rooms/inventory') return 'Inventory';
    // Guests
    if (path === '/guests/check-in-out') return 'Check-In/Out';
    if (path === '/guests/management') return 'Guest Management';
    // Finance
    if (path === '/finance/billing') return 'Billing & Invoicing';
    if (path === '/finance/reports') return 'Reports & Analytics';
    return 'Hotel Management System';
  };
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center">
        <button className="p-1 rounded-md md:hidden">
          <MenuIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 ml-2 md:ml-0">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }>

          {theme === 'dark' ?
          <SunIcon className="h-5 w-5 text-yellow-400" /> :

          <MoonIcon className="h-5 w-5 text-gray-500" />
          }
        </button>
        <button className="p-1 rounded-md relative">
          <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-1">
            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
            Admin
          </span>
        </div>
      </div>
    </header>);

};
export default Header;