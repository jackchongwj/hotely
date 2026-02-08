import React, { useState } from 'react';
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon } from
'lucide-react';
const ReservationList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Mock data
  const reservations = [
  {
    id: 'RES-1001',
    guest: 'John Smith',
    room: '301',
    type: 'Suite',
    checkIn: '2023-06-15',
    checkOut: '2023-06-18',
    status: 'confirmed',
    amount: 747
  },
  {
    id: 'RES-1002',
    guest: 'Sarah Johnson',
    room: '212',
    type: 'Deluxe',
    checkIn: '2023-06-16',
    checkOut: '2023-06-18',
    status: 'checked-in',
    amount: 298
  },
  {
    id: 'RES-1003',
    guest: 'Michael Brown',
    room: '105',
    type: 'Standard',
    checkIn: '2023-06-14',
    checkOut: '2023-06-15',
    status: 'checked-out',
    amount: 99
  },
  {
    id: 'RES-1004',
    guest: 'Emma Davis',
    room: '402',
    type: 'Executive',
    checkIn: '2023-06-20',
    checkOut: '2023-06-25',
    status: 'pending',
    amount: 1495
  },
  {
    id: 'RES-1005',
    guest: 'David Wilson',
    room: '203',
    type: 'Deluxe',
    checkIn: '2023-06-18',
    checkOut: '2023-06-20',
    status: 'cancelled',
    amount: 0
  },
  {
    id: 'RES-1006',
    guest: 'Jennifer Taylor',
    room: '118',
    type: 'Standard',
    checkIn: '2023-06-22',
    checkOut: '2023-06-24',
    status: 'confirmed',
    amount: 198
  },
  {
    id: 'RES-1007',
    guest: 'Robert Miller',
    room: '305',
    type: 'Suite',
    checkIn: '2023-06-25',
    checkOut: '2023-06-28',
    status: 'confirmed',
    amount: 747
  }];

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
    res.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.room.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Confirmed
          </span>);

      case 'checked-in':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            Checked In
          </span>);

      case 'checked-out':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Checked Out
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>);

      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Cancelled
          </span>);

      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>);

    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Reservation List
          </h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Export List
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
                placeholder="Search by guest, ID, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>

                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Reservation ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Guest
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Check-In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Check-Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">

                    Amount
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedReservations.map((res) =>
                <tr
                  key={res.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {res.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {res.guest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div>{res.room}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {res.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1 text-gray-400" />
                        {res.checkIn}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1 text-gray-400" />
                        {res.checkOut}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      ${res.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreVerticalIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )}
                {paginatedReservations.length === 0 &&
                <tr>
                    <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">

                      No reservations found matching your criteria.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>

                Previous
              </button>
              <button
                onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>

                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredReservations.length
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">
                    {filteredReservations.length}
                  </span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination">

                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>

                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  {Array.from({
                    length: totalPages
                  }).map((_, i) =>
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>

                      {i + 1}
                    </button>
                  )}
                  <button
                    onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>

                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};
export default ReservationList;