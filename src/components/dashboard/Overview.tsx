import React from 'react';
import {
  BedIcon,
  UsersIcon,
  CalendarCheckIcon,
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  PlusCircleIcon,
  LogInIcon,
  CreditCardIcon } from
'lucide-react';
import { Link } from 'react-router-dom';
const Overview = () => {
  // Mock data
  const stats = [
  {
    name: 'Available Rooms',
    value: '18',
    icon: <BedIcon className="h-6 w-6" />,
    color:
    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    name: 'Occupied Rooms',
    value: '32',
    icon: <BedIcon className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    name: 'Arrivals Today',
    value: '8',
    icon: <CalendarCheckIcon className="h-6 w-6" />,
    color:
    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    name: 'Departures Today',
    value: '6',
    icon: <CalendarIcon className="h-6 w-6" />,
    color:
    'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  }];

  const alerts = [
  {
    message: 'Room 203 needs maintenance',
    type: 'warning'
  },
  {
    message: 'VIP guest arriving at 2:00 PM',
    type: 'info'
  },
  {
    message: 'Housekeeping required for Room 118',
    type: 'task'
  }];

  const todaysBookings = [
  {
    id: 'B1001',
    guest: 'John Smith',
    room: '301',
    checkIn: '14:00',
    status: 'Confirmed'
  },
  {
    id: 'B1002',
    guest: 'Sarah Johnson',
    room: '212',
    checkIn: '15:30',
    status: 'Confirmed'
  },
  {
    id: 'B1003',
    guest: 'Michael Brown',
    room: '105',
    checkIn: '12:00',
    status: 'Checked In'
  }];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) =>
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">

            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </h3>
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Today's Bookings
              </h2>
              <Link
                to="/booking/new"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">

                + New Booking
              </Link>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Check-In
                      </th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {todaysBookings.map((booking) =>
                    <tr key={booking.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {booking.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.guest}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.room}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.checkIn}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>

                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Occupancy Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Occupancy Rate
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <TrendingUpIcon className="h-12 w-12 text-blue-500 dark:text-blue-400 mr-4" />
                <div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    64%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Current occupancy rate
                  </div>
                </div>
              </div>
              <div className="h-40 mt-4 flex items-end space-x-2">
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[60%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[75%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[65%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[80%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[90%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[70%] rounded-t"></div>
                <div className="w-1/7 bg-blue-500 dark:bg-blue-600 h-[64%] rounded-t"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>
            </div>
          </div>
        </div>
        {/* Alerts and Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Alerts
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {alerts.map((alert, index) =>
                <div
                  key={index}
                  className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md">

                    <AlertCircleIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5" />
                    <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                 Quick Actions
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/booking/new"
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">

                  <PlusCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    New Booking
                  </span>
                </Link>
                <Link
                  to="/check-in-out"
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">

                  <LogInIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    Check-In
                  </span>
                </Link>
                <Link
                  to="/rooms"
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">

                  <BedIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    Rooms
                  </span>
                </Link>
                <Link
                  to="/billing"
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">

                  <CreditCardIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    Billing
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};
export default Overview;