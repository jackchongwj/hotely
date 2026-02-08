import React, { useState } from 'react';
import { SearchIcon, LogInIcon, LogOutIcon, CreditCardIcon } from 'lucide-react';
const CheckInOut = () => {
  const [activeTab, setActiveTab] = useState('check-in');
  const [searchQuery, setSearchQuery] = useState('');
  // Mock data for bookings
  const arrivals = [
  {
    id: 'B1001',
    name: 'John Smith',
    room: '301',
    bookingDate: '2023-06-14',
    checkIn: '14:00',
    nights: 3,
    payment: 'Paid'
  },
  {
    id: 'B1002',
    name: 'Sarah Johnson',
    room: '212',
    bookingDate: '2023-06-14',
    checkIn: '15:30',
    nights: 2,
    payment: 'Pending'
  },
  {
    id: 'B1003',
    name: 'Michael Brown',
    room: '105',
    bookingDate: '2023-06-14',
    checkIn: '12:00',
    nights: 1,
    payment: 'Paid'
  },
  {
    id: 'B1004',
    name: 'Emma Davis',
    room: '402',
    bookingDate: '2023-06-15',
    checkIn: '13:00',
    nights: 4,
    payment: 'Pending'
  }];

  const departures = [
  {
    id: 'B0901',
    name: 'David Wilson',
    room: '203',
    checkIn: '2023-06-12',
    checkOut: '2023-06-14',
    payment: 'Paid',
    extraCharges: 0
  },
  {
    id: 'B0902',
    name: 'Jennifer Taylor',
    room: '118',
    checkIn: '2023-06-10',
    checkOut: '2023-06-14',
    payment: 'Paid',
    extraCharges: 45
  },
  {
    id: 'B0903',
    name: 'Robert Miller',
    room: '305',
    checkIn: '2023-06-13',
    checkOut: '2023-06-14',
    payment: 'Pending',
    extraCharges: 0
  }];

  // Filter based on search query
  const filteredArrivals = arrivals.filter(
    (booking) =>
    !searchQuery ||
    booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.room.includes(searchQuery)
  );
  const filteredDepartures = departures.filter(
    (booking) =>
    !searchQuery ||
    booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.room.includes(searchQuery)
  );
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('check-in')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'check-in' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>

              <LogInIcon className="h-4 w-4 inline-block mr-1" />
              Check-In
            </button>
            <button
              onClick={() => setActiveTab('check-out')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'check-out' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>

              <LogOutIcon className="h-4 w-4 inline-block mr-1" />
              Check-Out
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="relative flex-1 mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
              placeholder={`Search ${activeTab === 'check-in' ? 'arrivals' : 'departures'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          {/* Check-In Tab */}
          {activeTab === 'check-in' &&
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
                      Date
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Check-In
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nights
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredArrivals.map((booking) =>
                <tr key={booking.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.room}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.bookingDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.checkIn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.nights}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${booking.payment === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>

                          {booking.payment}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <button className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
                          <LogInIcon className="h-3 w-3 mr-1" />
                          Check In
                        </button>
                      </td>
                    </tr>
                )}
                  {filteredArrivals.length === 0 &&
                <tr>
                      <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">

                        No arrivals found matching your search.
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div>
          }
          {/* Check-Out Tab */}
          {activeTab === 'check-out' &&
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
                      Check-Out
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Extra Charges
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDepartures.map((booking) =>
                <tr key={booking.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.room}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.checkIn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {booking.checkOut}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        ${booking.extraCharges}
                        {booking.extraCharges > 0 &&
                    <button className="ml-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs">
                            View
                          </button>
                    }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${booking.payment === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>

                          {booking.payment}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex space-x-2">
                          {booking.payment === 'Pending' &&
                      <button className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
                              <CreditCardIcon className="h-3 w-3 mr-1" />
                              Pay
                            </button>
                      }
                          <button className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                            <LogOutIcon className="h-3 w-3 mr-1" />
                            Check Out
                          </button>
                        </div>
                      </td>
                    </tr>
                )}
                  {filteredDepartures.length === 0 &&
                <tr>
                      <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">

                        No departures found matching your search.
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
      {activeTab === 'check-in' &&
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Check-In Process
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <div className="relative">
                  <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true">

                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex items-center">
                      <span className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full h-7 w-7 flex items-center justify-center text-sm font-medium text-blue-600 border border-blue-600">
                        1
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full h-7 w-7 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                        2
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full h-7 w-7 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                        3
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full h-7 w-7 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                        4
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4 text-center text-xs">
                  <div className="text-blue-600 font-medium">
                    Verify Identity
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Collect Payment
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Assign Room
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Issue Key Card
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t dark:border-gray-700 pt-6">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                Guest Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID Type
                  </label>
                  <select className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white">
                    <option>Passport</option>
                    <option>Driver's License</option>
                    <option>National ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID Number
                  </label>
                  <input
                  type="text"
                  className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white" />

                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload ID Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true">

                        <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round" />

                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">

                          <span>Upload a file</span>
                          <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only" />

                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {activeTab === 'check-out' &&
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Billing Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                Room Charges
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Room 203 (Deluxe)
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    $149.00 x 2 nights
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Room Tax
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    $29.80
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Resort Fee
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    $25.00
                  </span>
                </div>
              </div>
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mt-6 mb-4">
                Additional Charges
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Room Service (Jun 13)
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    $45.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Mini Bar
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    $18.00
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t dark:border-gray-600">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    $416.80
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                Payment Method
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                  id="card"
                  name="paymentMethod"
                  type="radio"
                  checked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" />

                  <label
                  htmlFor="card"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">

                    Credit Card (on file)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                  id="cash"
                  name="paymentMethod"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" />

                  <label
                  htmlFor="cash"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">

                    Cash
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Print Invoice
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Complete Check-Out
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

};
export default CheckInOut;