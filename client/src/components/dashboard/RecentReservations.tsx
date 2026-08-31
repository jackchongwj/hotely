import React, { useEffect, useState } from 'react';
import { MoreHorizontal, UserIcon } from 'lucide-react';
import { reservationApi, reservationStatus, reservationTotal, Reservation, Guest, RoomDetail } from '../../services/api';

const STATUS_COLORS: Record<string, string> = {
  'Confirmed':   'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200',
  'Checked In':  'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-200',
  'Checked Out': 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-700 dark:text-gray-200',
  'Cancelled':   'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-200',
};

export function RecentReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    reservationApi.getAll(1, 5)
      .then(({ reservations }) => setReservations(reservations))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Reservations</h3>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
              <th className="pb-3 pl-2">Guest</th>
              <th className="pb-3">Room Type</th>
              <th className="pb-3">Arrival</th>
              <th className="pb-3">Departure</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {reservations.map((res) => {
              const guest = typeof res.customerId === 'object' ? res.customerId as Guest : null;
              const guestName = guest ? `${guest.firstName} ${guest.lastName}` : '—';
              const initials = guest ? `${guest.firstName[0]}${guest.lastName[0]}` : '?';
              const roomType = typeof res.roomType === 'object' ? (res.roomType as RoomDetail).name : '—';
              const status = reservationStatus(res);
              const total = reservationTotal(res);

              return (
                <tr key={res._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-200">
                        {initials}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{guestName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{roomType}</td>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{res.arrivalDate.slice(0, 10)}</td>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{res.departureDate.slice(0, 10)}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] ?? 'bg-gray-50 text-gray-600'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                    {total > 0 ? `$${total.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No recent reservations.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
