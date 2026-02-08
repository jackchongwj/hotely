import React, { useState } from 'react';
import {
  SearchIcon,
  UserIcon,
  FilterIcon,
  DownloadIcon,
  PlusIcon } from
'lucide-react';
const GuestManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  // Mock data for guests
  const guests = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 555-123-4567',
    visits: 3,
    lastStay: '2023-05-10',
    status: 'checked-out',
    vip: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 555-987-6543',
    visits: 1,
    lastStay: '2023-06-01',
    status: 'checked-in',
    vip: false
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '+1 555-456-7890',
    visits: 5,
    lastStay: '2023-04-15',
    status: 'booked',
    vip: true
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    phone: '+1 555-789-0123',
    visits: 2,
    lastStay: '2023-05-22',
    status: 'checked-in',
    vip: false
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'dwilson@example.com',
    phone: '+1 555-321-6547',
    visits: 7,
    lastStay: '2023-06-05',
    status: 'checked-out',
    vip: false
  },
  {
    id: 6,
    name: 'Jennifer Taylor',
    email: 'jtaylor@example.com',
    phone: '+1 555-852-9631',
    visits: 4,
    lastStay: '2023-03-18',
    status: 'booked',
    vip: true
  }];

  // Filter guests based on search query and filter
  const filteredGuests = guests.filter((guest) => {
    if (
    filter !== 'all' &&
    filter !== guest.status &&
    !(filter === 'vip' && guest.vip))
    {
      return false;
    }
    if (
    searchQuery &&
    !guest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !guest.email.toLowerCase().includes(searchQuery.toLowerCase()))
    {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Guest Management
          </h2>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Guest
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Search guests by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}>

                <option value="all">All Guests</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="booked">Booked</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <DownloadIcon className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Stay
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredGuests.map((guest) =>
                <tr key={guest.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {guest.name}
                            </div>
                            {guest.vip &&
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                VIP
                              </span>
                          }
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {guest.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {guest.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {guest.visits}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {guest.lastStay}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                      guest.status === 'checked-in' ?
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      guest.status === 'checked-out' ?
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`
                      }>

                        {guest.status.charAt(0).toUpperCase() +
                      guest.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          Edit
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">{filteredGuests.length}</span> of{' '}
              <span className="font-medium">{guests.length}</span> guests
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Guest Statistics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Guests
                </div>
                <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {guests.length}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Currently Checked In
                </div>
                <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {guests.filter((g) => g.status === 'checked-in').length}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  VIP Guests
                </div>
                <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {guests.filter((g) => g.vip).length}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Upcoming Arrivals
                </div>
                <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {guests.filter((g) => g.status === 'booked').length}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Recent Guest Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Sarah Johnson checked in
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Room 201 • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Michael Brown made a reservation
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Suite 301 • 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    David Wilson checked out
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Room 105 • 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};
export default GuestManagement;