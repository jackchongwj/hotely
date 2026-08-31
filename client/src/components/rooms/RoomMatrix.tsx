import React, { useState, useEffect } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { roomApi, Room, Reservation, Guest, RoomDetail } from '../../services/api';

const STATUS_STYLES: Record<string, string> = {
  'Vacant':      'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700',
  'Occupied':    'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700',
  'Maintenance': 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700',
  'Out Of Order':'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700',
};

const STATUS_BADGE: Record<string, string> = {
  'Vacant':      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Occupied':    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Maintenance': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Out Of Order':'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const RoomMatrix = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    roomApi.getAll()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Group rooms by room type name
  const grouped: Record<string, Room[]> = {};
  for (const room of rooms) {
    const typeName = typeof room.roomType === 'object' ? (room.roomType as RoomDetail).name : 'Unknown';
    if (!grouped[typeName]) grouped[typeName] = [];
    grouped[typeName].push(room);
  }

  const counts = {
    total:       rooms.length,
    vacant:      rooms.filter(r => r.roomStatus === 'Vacant').length,
    occupied:    rooms.filter(r => r.roomStatus === 'Occupied').length,
    maintenance: rooms.filter(r => r.roomStatus === 'Maintenance' || r.roomStatus === 'Out Of Order').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([
          ['Total Rooms', counts.total, 'text-gray-800 dark:text-white'],
          ['Vacant', counts.vacant, 'text-green-600 dark:text-green-400'],
          ['Occupied', counts.occupied, 'text-blue-600 dark:text-blue-400'],
          ['Maintenance / OOO', counts.maintenance, 'text-amber-600 dark:text-amber-400'],
        ] as const).map(([label, val, cls]) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${cls}`}>{val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Tonight's Room Assignment</h2>
          <button onClick={load} className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCwIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
          {(['Vacant', 'Occupied', 'Maintenance', 'Out Of Order'] as const).map(s => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded border ${STATUS_STYLES[s]}`} />
              {s}
            </span>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-sm text-gray-500 py-12">Loading…</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">No rooms configured.</p>
        ) : (
          <div className="p-6 space-y-8">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([typeName, typeRooms]) => (
              <div key={typeName}>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {typeName} <span className="font-normal text-gray-400">({typeRooms.length})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {typeRooms.sort((a, b) => a.roomNumber - b.roomNumber).map(room => {
                    const res = typeof room.currentReservation === 'object' && room.currentReservation
                      ? room.currentReservation as Reservation
                      : null;
                    const guest = res && typeof res.customerId === 'object' ? res.customerId as Guest : null;
                    return (
                      <div
                        key={room._id}
                        className={`rounded-lg border p-3 ${STATUS_STYLES[room.roomStatus] ?? 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-lg font-bold text-gray-800 dark:text-white">#{room.roomNumber}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[room.roomStatus] ?? ''}`}>
                            {room.roomStatus}
                          </span>
                        </div>
                        {guest ? (
                          <div className="mt-1">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                              {guest.firstName} {guest.lastName}
                            </p>
                            {res && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                → {new Date(res.departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">
                            {room.roomStatus === 'Vacant' ? 'Available' : room.roomStatus === 'Maintenance' ? 'Under maintenance' : room.roomStatus === 'Out Of Order' ? 'Out of order' : '—'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomMatrix;
