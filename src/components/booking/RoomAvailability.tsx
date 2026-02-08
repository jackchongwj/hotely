import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, FilterIcon, SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react';
const RoomAvailability = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [availableRoomSearch, setAvailableRoomSearch] = useState('');
  const [availableTypeFilter, setAvailableTypeFilter] = useState('All Types');
  const [priceCap, setPriceCap] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: '',
    endDate: '',
    roomType: 'All Types',
    status: 'All Statuses'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<'id' | 'type' | 'capacity' | 'price' | 'status'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // Mock data for room types
  const roomTypes = ['All Types', 'Standard', 'Deluxe', 'Suite', 'Executive'];
  const statusOptions = ['All Statuses', 'Available', 'Booked', 'Maintenance'];
  // Mock data for rooms
  const rooms = [{
    id: 101,
    type: 'Standard',
    capacity: 2,
    price: 99,
    status: 'available',
    amenities: ['Wi-Fi', 'TV', 'AC']
  }, {
    id: 102,
    type: 'Standard',
    capacity: 2,
    price: 99,
    status: 'available',
    amenities: ['Wi-Fi', 'TV', 'AC']
  }, {
    id: 201,
    type: 'Deluxe',
    capacity: 2,
    price: 149,
    status: 'available',
    amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar']
  }, {
    id: 202,
    type: 'Deluxe',
    capacity: 3,
    price: 169,
    status: 'booked',
    amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar']
  }, {
    id: 301,
    type: 'Suite',
    capacity: 4,
    price: 249,
    status: 'available',
    amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Lounge']
  }, {
    id: 302,
    type: 'Suite',
    capacity: 4,
    price: 249,
    status: 'maintenance',
    amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Lounge']
  }, {
    id: 401,
    type: 'Executive',
    capacity: 2,
    price: 299,
    status: 'available',
    amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Lounge', 'Work Desk']
  }];
  const priceBounds = rooms.reduce((acc, room) => {
    acc.min = Math.min(acc.min, room.price);
    acc.max = Math.max(acc.max, room.price);
    return acc;
  }, {
    min: Number.POSITIVE_INFINITY,
    max: 0
  });
  const resolvedPriceBounds = {
    min: priceBounds.min === Number.POSITIVE_INFINITY ? 0 : priceBounds.min,
    max: priceBounds.max
  };
  // Filter rooms based on selected criteria
  const filteredRooms = rooms.filter((room) => {
    if (appliedFilters.roomType && appliedFilters.roomType !== 'All Types' && room.type !== appliedFilters.roomType) {
      return false;
    }
    if (appliedFilters.status && appliedFilters.status !== 'All Statuses' && room.status !== appliedFilters.status.toLowerCase()) {
      return false;
    }
    if (appliedFilters.startDate || appliedFilters.endDate) {
      if (room.status !== 'available') {
        return false;
      }
    }
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortKey === 'id' || sortKey === 'capacity' || sortKey === 'price') {
      return (a[sortKey] - b[sortKey]) * direction;
    }
    return a[sortKey].localeCompare(b[sortKey]) * direction;
  });

  const handleSort = (key: 'id' | 'type' | 'capacity' | 'price' | 'status') => {
    if (sortKey === key) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const handleSearch = () => {
    setIsLoading(true);
    setAppliedFilters({
      startDate,
      endDate,
      roomType,
      status: statusFilter
    });
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setRoomType('All Types');
    setStatusFilter('All Statuses');
    setAppliedFilters({
      startDate: '',
      endDate: '',
      roomType: 'All Types',
      status: 'All Statuses'
    });
    setCurrentPage(1);
    setIsLoading(false);
  };

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [calendarYear, setCalendarYear] = useState(startOfToday.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(startOfToday.getMonth());
  const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const mondayStartIndex = (firstOfMonth.getDay() + 6) % 7;
  const calendarCells = Array.from({
    length: mondayStartIndex + daysInMonth
  }, (_, index) => {
    if (index < mondayStartIndex) {
      return null;
    }
    return index - mondayStartIndex + 1;
  });
  const availableCount = rooms.filter((room) => room.status === 'available').length;
  const availableRoomTypeCounts = rooms.filter((room) => room.status === 'available').reduce((acc, room) => {
    acc[room.type] = (acc[room.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const availableRoomTypeLines = Object.entries(availableRoomTypeCounts).map(([type, count]) => `${type}: ${count}`);
  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 0) {
        setCalendarYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 11) {
        setCalendarYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };
  const fullyBookedDays = [8, 9, 15, 22];
  const publicHolidayDays = [5, 19];
  const availableFilteredRooms = sortedRooms.filter((room) => {
    if (availableTypeFilter !== 'All Types' && room.type !== availableTypeFilter) {
      return false;
    }
    if (availableRoomSearch.trim()) {
      return String(room.id).includes(availableRoomSearch.trim());
    }
    if (priceCap > 0 && room.price > priceCap) {
      return false;
    }
    return true;
  });
  const totalRooms = availableFilteredRooms.length;
  const totalPages = Math.max(1, Math.ceil(totalRooms / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRooms = availableFilteredRooms.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedRoom = selectedRoomId ? availableFilteredRooms.find((room) => room.id === selectedRoomId) : null;

  useEffect(() => {
    if (priceCap === 0 && resolvedPriceBounds.max > 0) {
      setPriceCap(resolvedPriceBounds.max);
    }
  }, [priceCap, resolvedPriceBounds.max]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="py-1 text-lg font-medium text-gray-800 dark:text-gray-100">
            Room Availability Search
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-100">
                Check-In Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input type="date" className="h-11 pl-10 pr-4 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-100" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-100">
                Check-Out Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input type="date" className="h-11 pl-10 pr-4 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-100" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-100">
                Room Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-6 w-6 text-gray-400" />
                </div>
                <select className="h-11 pl-10 pr-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-100" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                  {roomTypes.map((type) => <option key={type} value={type}>
                      {type}
                    </option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-100">
                Availability Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-6 w-6 text-gray-400" />
                </div>
                <select className="h-11 pl-10 pr-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-100" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusOptions.map((status) => <option key={status} value={status}>
                      {status}
                    </option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={handleReset} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Reset
            </button>
            <button onClick={handleSearch} disabled={isLoading} className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              <SearchIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search Availability'}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="py-1 text-lg font-medium text-gray-800 dark:text-gray-100">Available Rooms</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <input type="text" placeholder="Search Room #" value={availableRoomSearch} onChange={(e) => {
            setAvailableRoomSearch(e.target.value);
            setCurrentPage(1);
          }} className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-gray-700 dark:text-gray-100" />
            <select value={availableTypeFilter} onChange={(e) => {
            setAvailableTypeFilter(e.target.value);
            setCurrentPage(1);
          }} className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-gray-700 dark:text-gray-100">
              {roomTypes.map((type) => <option key={type} value={type}>
                  {type}
                </option>)}
            </select>
            <div className="flex items-center gap-2">
              <span>Up to ${priceCap || resolvedPriceBounds.max}</span>
              <input type="range" min={resolvedPriceBounds.min} max={resolvedPriceBounds.max} value={priceCap || resolvedPriceBounds.max} onChange={(e) => {
              setPriceCap(Number(e.target.value));
              setCurrentPage(1);
            }} className="h-2 w-32 cursor-pointer accent-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <select value={pageSize} onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }} className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-gray-700 dark:text-gray-100">
                {[5, 10, 15, 20].map((size) => <option key={size} value={size}>
                    {size}
                  </option>)}
              </select>
              <span>out of {totalRooms} rooms</span>
            </div>
            
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                    Room # {sortKey === 'id' ? sortDirection === 'asc' ? '▲' : '▼' : ''}
                  </th>
                  <th onClick={() => handleSort('type')} className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                    Type {sortKey === 'type' ? sortDirection === 'asc' ? '▲' : '▼' : ''}
                  </th>
                  <th onClick={() => handleSort('capacity')} className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                    Capacity {sortKey === 'capacity' ? sortDirection === 'asc' ? '▲' : '▼' : ''}
                  </th>
                  <th onClick={() => handleSort('price')} className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                    Price/Night {sortKey === 'price' ? sortDirection === 'asc' ? '▲' : '▼' : ''}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amenities
                  </th>
                  <th onClick={() => handleSort('status')} className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                    Status {sortKey === 'status' ? sortDirection === 'asc' ? '▲' : '▼' : ''}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pagedRooms.length === 0 ? <tr>
                    <td colSpan={7} className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                      No rooms match your filters. Try adjusting dates, type, or status.
                    </td>
                  </tr> : pagedRooms.map((room) => <tr key={room.id} onClick={() => {
                setSelectedRoomId(room.id);
                setDetailsExpanded(false);
              }} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {room.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                        {room.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.capacity} Persons
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      ${room.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, index) => <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                            {amenity}
                          </span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center justify-center w-fit px-2 py-1 text-xs font-medium rounded-full ${
                  room.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  room.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`
                  }>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {room.status === 'available' ? <Link to="/booking/new" state={{
                    roomId: room.id
                  }} className="text-blue-600 hover:text-blue-900">
                          Book Now
                        </Link> : <span className="text-gray-400">Unavailable</span>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          {selectedRoom && <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Room #{selectedRoom.id} · {selectedRoom.type}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedRoom.capacity} Persons · ${selectedRoom.price} / night
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center justify-center w-fit px-2 py-1 text-xs font-medium rounded-full ${
              selectedRoom.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              selectedRoom.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`
              }>
                    {selectedRoom.status.charAt(0).toUpperCase() + selectedRoom.status.slice(1)}
                  </div>
                  <button onClick={() => setDetailsExpanded((prev) => !prev)} className="text-sm text-blue-600 hover:text-blue-900">
                    {detailsExpanded ? 'Hide Details' : 'Expand Details'}
                  </button>
                </div>
              </div>
              {detailsExpanded && <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, index) => <span key={`${amenity}-${index}`} className="px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-gray-300 rounded-full">
                      {amenity}
                    </span>)}
                </div>}
            </div>}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span>Page</span>
              <select value={safePage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-gray-700 dark:text-gray-100">
                {Array.from({
                length: totalPages
              }, (_, index) => <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>)}
              </select>
              <span>of {totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={safePage === 1} className={`px-3 py-1 rounded-md border ${safePage === 1 ? 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}>
                Prev
              </button>
              <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage === totalPages} className={`px-3 py-1 rounded-md border ${safePage === totalPages ? 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="py-1 text-lg font-medium text-gray-800 dark:text-gray-100">
            Room Availability Calendar
          </h2>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
            <button onClick={handlePrevMonth} className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-lg">
              {new Date(calendarYear, calendarMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={handleNextMonth} className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-left w-full max-w-5xl">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <div key={day} className="py-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                {day}
              </div>)}
            {calendarCells.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="p-2 border border-transparent" />;
            }
            const date = new Date(calendarYear, calendarMonth, day);
            const isPast = date < startOfToday;
            const isToday = date.getTime() === startOfToday.getTime();
            const isFullyBooked = fullyBookedDays.includes(day);
            const isPublicHoliday = publicHolidayDays.includes(day);
            return <div key={day} className={`relative group p-2 border dark:border-gray-600 rounded ${isPast ? 'bg-gray-100 text-gray-400 dark:bg-gray-700/60 dark:text-gray-500' : isFullyBooked ? 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200' : isPublicHoliday ? 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200' : 'bg-white dark:bg-gray-800'} ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="font-medium">{day}</div>
                  <div className="text-xs mt-1">
                    {isPast ? 'Past' : isFullyBooked ? 'Full' : `${availableCount} rooms`}
                  </div>
                  {!isPast && !isFullyBooked && availableRoomTypeLines.length > 0 && <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-44 -translate-x-1/2 rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-700 shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                      <div className="font-medium mb-1">Available Types</div>
                      <div className="space-y-0.5">
                        {availableRoomTypeLines.map((line) => <div key={line}>{line}</div>)}
                      </div>
                    </div>}
                </div>;
          })}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 w-full">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700/60 border dark:border-gray-600 rounded mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Past Day</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 dark:bg-red-900/40 border dark:border-gray-600 rounded mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Fully Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 dark:bg-green-900/40 border dark:border-gray-600 rounded mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Public Holiday</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Available Day</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 rounded mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default RoomAvailability;