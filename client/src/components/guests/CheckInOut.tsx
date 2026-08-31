import { confirm as confirmDialog } from '../../lib/confirm';
import React, { useState, useEffect } from 'react';
import { SearchIcon, LogInIcon, LogOutIcon, UserXIcon } from 'lucide-react';
import { reservationApi, roomApi, reservationTotal, Reservation, Guest, RoomDetail, Room } from '../../services/api';
import { toastSuccess, toastError } from '../../lib/toast';

const CheckInOut = () => {
  const [activeTab, setActiveTab] = useState<'check-in' | 'check-out'>('check-in');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vacantRooms, setVacantRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    Promise.all([
      reservationApi.getAll(1, 200),
      roomApi.getAll(),
    ]).then(([{ reservations }, { rooms }]) => {
      const vacant = rooms.filter(r => r.roomStatus === 'Vacant');
      setReservations(reservations);
      setVacantRooms(vacant);
      // Auto-select the first matching vacant room for each pending arrival
      const pending = reservations.filter(r => !r.checkedIn && !r.cancelled);
      const autoSelect: Record<string, string> = {};
      for (const res of pending) {
        const typeId = typeof res.roomType === 'object' ? (res.roomType as RoomDetail)._id : res.roomType as string;
        const match = vacant.find(room => {
          const rTypeId = typeof room.roomType === 'object' ? (room.roomType as RoomDetail)._id : room.roomType as string;
          return rTypeId === typeId;
        });
        if (match) autoSelect[res._id] = match._id;
      }
      setSelectedRoom(autoSelect);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().slice(0, 10);

  const arrivals = reservations.filter(r => !r.checkedIn && !r.cancelled);
  const departures = reservations.filter(r => r.checkedIn && !r.checkedOut);

  const search = (list: Reservation[]) => {
    if (!searchQuery) return list;
    return list.filter(r => {
      const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
      const name = guest ? `${guest.firstName} ${guest.lastName}`.toLowerCase() : '';
      return name.includes(searchQuery.toLowerCase()) || r.reservationId.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const handleCheckIn = async (r: Reservation) => {
    const roomId = selectedRoom[r._id];
    if (!roomId) return;
    setActionId(r._id);
    try {
      await reservationApi.checkIn(r._id, roomId);
      toastSuccess(`${guestName(r)} checked in`);
      load();
    } catch (err: any) {
      toastError(err.message ?? 'Check-in failed');
    } finally {
      setActionId(null);
    }
  };

  const handleCheckOut = async (r: Reservation) => {
    setActionId(r._id);
    try {
      await reservationApi.checkOut(r._id);
      toastSuccess(`${guestName(r)} checked out — cleaning task created`);
      load();
    } catch (err: any) {
      toastError(err.message ?? 'Check-out failed');
    } finally {
      setActionId(null);
    }
  };

  const handleNoShow = async (r: Reservation) => {
    if (!(await confirmDialog(`Mark ${guestName(r)} (${r.reservationId}) as no-show? This will cancel the reservation.`))) return;
    setActionId(r._id);
    try {
      await reservationApi.markNoShow(r._id);
      toastSuccess(`${r.reservationId} marked as no-show`);
      load();
    } catch (err: any) {
      toastError(err.message ?? 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const guestName = (r: Reservation) => {
    const g = typeof r.customerId === 'object' ? r.customerId as Guest : null;
    return g ? `${g.firstName} ${g.lastName}` : '—';
  };

  const roomTypeName = (r: Reservation) =>
    typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '—';

  const thCls = 'px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider';
  const tdCls = 'px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b dark:border-gray-700 flex">
          {(['check-in', 'check-out'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className={`px-6 py-4 text-sm font-medium flex items-center gap-1 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              {tab === 'check-in' ? <LogInIcon className="h-4 w-4" /> : <LogOutIcon className="h-4 w-4" />}
              {tab === 'check-in' ? 'Check-In' : 'Check-Out'}
            </button>
          ))}
        </div>
        <div className="p-6">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm"
              placeholder={`Search ${activeTab === 'check-in' ? 'arrivals' : 'departures'}…`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading…</p>
          ) : activeTab === 'check-in' ? (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead><tr>
                  <th className={thCls}>Reservation ID</th>
                  <th className={thCls}>Guest</th>
                  <th className={thCls}>Room Type</th>
                  <th className={thCls}>Arrival</th>
                  <th className={thCls}>Nights</th>
                  <th className={thCls}>Assign Room</th>
                  <th className={thCls}>Action</th>
                </tr></thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {search(arrivals).length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">No pending arrivals.</td></tr>
                  ) : search(arrivals).map(r => (
                    <tr key={r._id}>
                      <td className={`${tdCls} font-medium text-gray-900 dark:text-white`}>{r.reservationId}</td>
                      <td className={tdCls}>{guestName(r)}</td>
                      <td className={tdCls}>{roomTypeName(r)}</td>
                      <td className={tdCls}>{r.arrivalDate.slice(0, 10)}</td>
                      <td className={tdCls}>{r.daysOfStay}</td>
                      <td className="px-4 py-4">
                        <select
                          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded text-xs py-1 px-2"
                          value={selectedRoom[r._id] ?? ''}
                          onChange={e => setSelectedRoom(prev => ({ ...prev, [r._id]: e.target.value }))}
                        >
                          <option value="">Select room…</option>
                          {vacantRooms.filter(room => {
                            const rTypeId = typeof room.roomType === 'object' ? (room.roomType as RoomDetail)._id : room.roomType as string;
                            const resTypeId = typeof r.roomType === 'object' ? (r.roomType as RoomDetail)._id : r.roomType as string;
                            return rTypeId === resTypeId;
                          }).map(room => (
                            <option key={room._id} value={room._id}>Room {room.roomNumber}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCheckIn(r)}
                            disabled={!selectedRoom[r._id] || actionId === r._id}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                          >
                            <LogInIcon className="h-3 w-3 mr-1" />
                            {actionId === r._id ? 'Checking in…' : 'Check In'}
                          </button>
                          {r.arrivalDate.slice(0, 10) < today && (
                            <button
                              onClick={() => handleNoShow(r)}
                              disabled={actionId === r._id}
                              className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-700 rounded-md text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                              title="Mark as no-show"
                            >
                              <UserXIcon className="h-3 w-3 mr-1" />No-Show
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead><tr>
                  <th className={thCls}>Reservation ID</th>
                  <th className={thCls}>Guest</th>
                  <th className={thCls}>Room Type</th>
                  <th className={thCls}>Arrival</th>
                  <th className={thCls}>Departure</th>
                  <th className={thCls}>Nights</th>
                  <th className={thCls}>Total</th>
                  <th className={thCls}>Action</th>
                </tr></thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {search(departures).length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">No pending departures.</td></tr>
                  ) : search(departures).map(r => {
                    const total = reservationTotal(r);
                    return (
                      <tr key={r._id}>
                        <td className={`${tdCls} font-medium text-gray-900 dark:text-white`}>{r.reservationId}</td>
                        <td className={tdCls}>{guestName(r)}</td>
                        <td className={tdCls}>{roomTypeName(r)}</td>
                        <td className={tdCls}>{r.arrivalDate.slice(0, 10)}</td>
                        <td className={tdCls}>{r.departureDate.slice(0, 10)}</td>
                        <td className={tdCls}>{r.daysOfStay}</td>
                        <td className={`${tdCls} font-medium text-gray-900 dark:text-white`}>{total > 0 ? `$${total.toLocaleString()}` : '—'}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleCheckOut(r)}
                            disabled={actionId === r._id}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            <LogOutIcon className="h-3 w-3 mr-1" />
                            {actionId === r._id ? 'Checking out…' : 'Check Out'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
