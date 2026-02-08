import React, { useState } from 'react';
import {
  BedIcon,
  ClipboardIcon,
  FilterIcon,
  SearchIcon,
  EditIcon,
  PlusIcon } from
'lucide-react';
const RoomManagement = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Mock data for rooms
  const rooms = [
  {
    id: 101,
    type: 'Standard',
    status: 'occupied',
    guest: 'John Smith',
    checkOut: '2023-06-15',
    cleaning: 'pending',
    maintenance: []
  },
  {
    id: 102,
    type: 'Standard',
    status: 'vacant',
    guest: null,
    checkOut: null,
    cleaning: 'clean',
    maintenance: []
  },
  {
    id: 103,
    type: 'Standard',
    status: 'vacant',
    guest: null,
    checkOut: null,
    cleaning: 'clean',
    maintenance: []
  },
  {
    id: 201,
    type: 'Deluxe',
    status: 'occupied',
    guest: 'Sarah Johnson',
    checkOut: '2023-06-18',
    cleaning: 'pending',
    maintenance: []
  },
  {
    id: 202,
    type: 'Deluxe',
    status: 'maintenance',
    guest: null,
    checkOut: null,
    cleaning: 'clean',
    maintenance: ['AC repair']
  },
  {
    id: 203,
    type: 'Deluxe',
    status: 'reserved',
    guest: 'Michael Brown',
    checkOut: null,
    cleaning: 'clean',
    maintenance: []
  },
  {
    id: 301,
    type: 'Suite',
    status: 'occupied',
    guest: 'David Wilson',
    checkOut: '2023-06-14',
    cleaning: 'pending',
    maintenance: []
  },
  {
    id: 302,
    type: 'Suite',
    status: 'vacant',
    guest: null,
    checkOut: null,
    cleaning: 'clean',
    maintenance: []
  },
  {
    id: 401,
    type: 'Executive',
    status: 'occupied',
    guest: 'Emma Davis',
    checkOut: '2023-06-20',
    cleaning: 'pending',
    maintenance: []
  }];

  // Filter rooms based on status
  const filteredRooms = rooms.filter((room) => {
    if (filter !== 'all' && room.status !== filter) {
      return false;
    }
    if (
    searchQuery &&
    !room.id.toString().includes(searchQuery) &&
    !(
    room.guest &&
    room.guest.toLowerCase().includes(searchQuery.toLowerCase())))

    {
      return false;
    }
    return true;
  });
  const getStatusBadge = (status) => {
    switch (status) {
      case 'vacant':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Vacant
          </span>);

      case 'occupied':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Occupied
          </span>);

      case 'reserved':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Reserved
          </span>);

      case 'maintenance':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Maintenance
          </span>);

      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>);

    }
  };
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
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Room Management
          </h2>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Room
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
                placeholder="Search rooms or guests..."
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
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) =>
            <div
              key={room.id}
              className="border dark:border-gray-700 rounded-lg overflow-hidden">

                <div
                className={`px-4 py-2 text-white ${room.status === 'vacant' ? 'bg-green-600 dark:bg-green-700' : room.status === 'occupied' ? 'bg-blue-600 dark:bg-blue-700' : room.status === 'reserved' ? 'bg-purple-600 dark:bg-purple-700' : 'bg-amber-600 dark:bg-amber-700'} flex justify-between items-center`}>

                  <div className="flex items-center">
                    <BedIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">Room {room.id}</span>
                  </div>
                  <span className="text-sm">{room.type}</span>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <div>{getStatusBadge(room.status)}</div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Cleaning:
                      </span>
                      <div>{getCleaningBadge(room.cleaning)}</div>
                    </div>
                    {room.guest &&
                  <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Guest:
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {room.guest}
                        </span>
                      </div>
                  }
                    {room.checkOut &&
                  <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Check-out:
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {room.checkOut}
                        </span>
                      </div>
                  }
                    {room.maintenance.length > 0 &&
                  <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Maintenance:
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          {room.maintenance.join(', ')}
                        </span>
                      </div>
                  }
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs leading-5 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <ClipboardIcon className="h-3 w-3 mr-1" />
                      Details
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs leading-5 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <EditIcon className="h-3 w-3 mr-1" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Room Status Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{
                      width: '40%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  40% Occupied
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{
                      width: '30%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  30% Vacant
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-purple-600 h-4 rounded-full"
                    style={{
                      width: '20%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  20% Reserved
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-amber-600 h-4 rounded-full"
                    style={{
                      width: '10%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  10% Maintenance
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Housekeeping Status
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{
                      width: '60%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  60% Clean
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-amber-600 h-4 rounded-full"
                    style={{
                      width: '30%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  30% Pending
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-red-600 h-4 rounded-full"
                    style={{
                      width: '10%'
                    }}>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  10% Dirty
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Schedule Housekeeping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

};
export default RoomManagement;