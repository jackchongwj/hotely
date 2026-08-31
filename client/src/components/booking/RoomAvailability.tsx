import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { roomApi, Room, RoomDetail } from '../../services/api';
import Pagination from '../common/Pagination';

const RoomAvailability = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortKey, setSortKey] = useState<'roomNumber' | 'type' | 'price' | 'status'>('roomNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  useEffect(() => {
    roomApi.getAll()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const roomTypes = Array.from(new Set(
    rooms.map(r => typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '').filter(Boolean)
  ));

  const statusOptions = ['All Statuses', 'Vacant', 'Occupied', 'Maintenance', 'Out Of Order'];

  const filteredRooms = rooms.filter(r => {
    const typeName = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '';
    const price = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).price : 0;
    if (typeFilter !== 'All Types' && typeName !== typeFilter) return false;
    if (statusFilter !== 'All Statuses' && r.roomStatus !== statusFilter) return false;
    if (searchQuery && !String(r.roomNumber).includes(searchQuery)) return false;
    return true;
  });

  const sorted = [...filteredRooms].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'roomNumber') return (a.roomNumber - b.roomNumber) * dir;
    if (sortKey === 'type') {
      const at = typeof a.roomType === 'object' ? (a.roomType as RoomDetail).name : '';
      const bt = typeof b.roomType === 'object' ? (b.roomType as RoomDetail).name : '';
      return at.localeCompare(bt) * dir;
    }
    if (sortKey === 'price') {
      const ap = typeof a.roomType === 'object' ? (a.roomType as RoomDetail).price : 0;
      const bp = typeof b.roomType === 'object' ? (b.roomType as RoomDetail).price : 0;
      return (ap - bp) * dir;
    }
    return a.roomStatus.localeCompare(b.roomStatus) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const sortIndicator = (key: typeof sortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const statusBadge = (status: Room['roomStatus']) => {
    const map: Record<string, string> = {
      'Vacant':      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Occupied':    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Maintenance': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Out Of Order':'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  // Calendar
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const calCells = Array.from({ length: mondayOffset + daysInMonth }, (_, i) =>
    i < mondayOffset ? null : i - mondayOffset + 1
  );

  const vacantCount = rooms.filter(r => r.roomStatus === 'Vacant').length;
  const vacantByType = rooms
    .filter(r => r.roomStatus === 'Vacant')
    .reduce<Record<string, number>>((acc, r) => {
      const name = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : 'Unknown';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

  const thCls = 'px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Room Availability</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm"
                placeholder="Search room number…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 pr-3 text-sm" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All Types">All Types</option>
                {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 pr-3 text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading…</p>
          ) : (
            <>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead><tr>
                    <th className={thCls} onClick={() => handleSort('roomNumber')}>Room #{sortIndicator('roomNumber')}</th>
                    <th className={thCls} onClick={() => handleSort('type')}>Type{sortIndicator('type')}</th>
                    <th className={thCls} onClick={() => handleSort('price')}>Price/Night{sortIndicator('price')}</th>
                    <th className={thCls} onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  </tr></thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paged.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">No rooms match your filters.</td></tr>
                    ) : paged.map(room => {
                      const typeName = typeof room.roomType === 'object' ? (room.roomType as RoomDetail).name : '—';
                      const price = typeof room.roomType === 'object' ? (room.roomType as RoomDetail).price : 0;
                      return (
                        <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{room.roomNumber}</td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{typeName}</td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{price > 0 ? `$${price}` : '—'}</td>
                          <td className="px-4 py-4">{statusBadge(room.roomStatus)}</td>
                          <td className="px-4 py-4 text-sm">
                            {room.roomStatus === 'Vacant'
                              ? <Link to="/booking/new" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Book Now</Link>
                              : <span className="text-gray-400">Unavailable</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={safePage}
                pages={totalPages}
                total={sorted.length}
                limit={pageSize}
                onPageChange={setCurrentPage}
                onLimitChange={(l) => { setPageSize(l); setCurrentPage(1); }}
              />
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Availability Calendar</h2>
          <p className="text-sm text-gray-500 mt-1">{vacantCount} vacant rooms available · {Object.entries(vacantByType).map(([t, n]) => `${t}: ${n}`).join(', ')}</p>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
            <button onClick={() => setCalendarMonth(m => { if (m === 0) { setCalendarYear(y => y - 1); return 11; } return m - 1; })} className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-lg">{new Date(calendarYear, calendarMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCalendarMonth(m => { if (m === 11) { setCalendarYear(y => y + 1); return 0; } return m + 1; })} className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 w-full max-w-3xl">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="py-2 text-xs font-medium text-center text-gray-500 dark:text-gray-400">{d}</div>
            ))}
            {calCells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const date = new Date(calendarYear, calendarMonth, day);
              const isPast = date < startOfToday;
              const isToday = date.getTime() === startOfToday.getTime();
              return (
                <div key={day} className={`relative group p-2 border dark:border-gray-600 rounded text-center ${isPast ? 'bg-gray-100 text-gray-400 dark:bg-gray-700/60 dark:text-gray-500' : 'bg-white dark:bg-gray-800'} ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="text-sm font-medium">{day}</div>
                  {!isPast && (
                    <div className="text-xs text-green-600 dark:text-green-400">{vacantCount} avail.</div>
                  )}
                  {!isPast && Object.keys(vacantByType).length > 0 && (
                    <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden w-40 -translate-x-1/2 rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-700 shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                      <div className="font-medium mb-1">Available Types</div>
                      {Object.entries(vacantByType).map(([t, n]) => <div key={t}>{t}: {n}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-gray-100 dark:bg-gray-700/60 border rounded" /><span>Past</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 border-2 border-blue-500 rounded" /><span>Today</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded" /><span>Available</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailability;
