import React, { useState } from 'react';
import {
  SearchIcon,
  FilterIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  BellIcon,
  PlusIcon } from
'lucide-react';
const Housekeeping = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Mock data for rooms
  const rooms = [
  {
    id: 101,
    type: 'Standard',
    status: 'occupied',
    cleaning: 'pending',
    guest: 'John Smith',
    checkOut: '2023-06-15',
    priority: 'high'
  },
  {
    id: 102,
    type: 'Standard',
    status: 'vacant',
    cleaning: 'clean',
    guest: null,
    checkOut: null,
    priority: 'low'
  },
  {
    id: 103,
    type: 'Standard',
    status: 'vacant',
    cleaning: 'dirty',
    guest: null,
    checkOut: null,
    priority: 'medium'
  },
  {
    id: 201,
    type: 'Deluxe',
    status: 'occupied',
    cleaning: 'pending',
    guest: 'Sarah Johnson',
    checkOut: '2023-06-14',
    priority: 'high'
  },
  {
    id: 202,
    type: 'Deluxe',
    status: 'maintenance',
    cleaning: 'clean',
    guest: null,
    checkOut: null,
    priority: 'low'
  },
  {
    id: 203,
    type: 'Deluxe',
    status: 'reserved',
    cleaning: 'clean',
    guest: 'Michael Brown',
    checkOut: null,
    priority: 'medium'
  },
  {
    id: 301,
    type: 'Suite',
    status: 'occupied',
    cleaning: 'dirty',
    guest: 'David Wilson',
    checkOut: '2023-06-14',
    priority: 'high'
  },
  {
    id: 302,
    type: 'Suite',
    status: 'vacant',
    cleaning: 'clean',
    guest: null,
    checkOut: null,
    priority: 'low'
  },
  {
    id: 401,
    type: 'Executive',
    status: 'occupied',
    cleaning: 'pending',
    guest: 'Emma Davis',
    checkOut: '2023-06-16',
    priority: 'medium'
  }];

  // Filter rooms based on cleaning status
  const filteredRooms = rooms.filter((room) => {
    if (filter !== 'all' && room.cleaning !== filter) {
      return false;
    }
    if (searchQuery && !room.id.toString().includes(searchQuery)) {
      return false;
    }
    return true;
  });
  const getCleaningBadge = (status) => {
    switch (status) {
      case 'clean':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Clean
          </span>);

      case 'dirty':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Dirty
          </span>);

      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Pending
          </span>);

      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>);

    }
  };
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            High
          </span>);

      case 'medium':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Medium
          </span>);

      case 'low':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Low
          </span>);

      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {priority}
          </span>);

    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Housekeeping Management
          </h2>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1" />
            Create Task
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
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}>

                <option value="all">All Rooms</option>
                <option value="clean">Clean</option>
                <option value="dirty">Dirty</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cleaning
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRooms.map((room) =>
                <tr key={room.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {room.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.status}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getCleaningBadge(room.cleaning)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.guest || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.checkOut || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getPriorityBadge(room.priority)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex space-x-2">
                        {room.cleaning !== 'clean' &&
                      <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                      }
                        <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700">
                          <ClockIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700">
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRooms.length === 0 &&
                <tr>
                    <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">

                      No rooms found matching your criteria.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Today's Tasks
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Clean Room 301
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned to: Maria Rodriguez
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mr-2">
                      High Priority
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: 12:00 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Clean Room 201
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned to: John Davis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mr-2">
                      High Priority
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: 12:30 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Clean Room 103
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned to: Sarah Johnson
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mr-2">
                      Medium Priority
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: 2:00 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Clean Room 401
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned to: Maria Rodriguez
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mr-2">
                      Medium Priority
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: 3:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Inventory Management
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toiletries
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Soap
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: '85%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      85%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Shampoo
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-yellow-600 h-2.5 rounded-full"
                          style={{
                            width: '40%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      40%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Conditioner
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{
                            width: '15%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      15%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Linens
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Towels
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: '75%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      75%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Bed Sheets
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-yellow-600 h-2.5 rounded-full"
                          style={{
                            width: '45%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      45%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Pillowcases
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: '60%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      60%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cleaning Supplies
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Detergent
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: '80%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      80%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                      Glass Cleaner
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{
                            width: '10%'
                          }}>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      10%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Order Supplies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};
export default Housekeeping;