import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { reservationApi, Reservation, Guest, RoomDetail } from '../../services/api';

export function UpcomingCheckins() {
  const [arrivals, setArrivals] = useState<Reservation[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    reservationApi.getAll(1, 100)
      .then(({ reservations }) => {
        const todayArrivals = reservations.filter(
          r => r.arrivalDate.slice(0, 10) === today && !r.checkedIn && !r.cancelled
        );
        setArrivals(todayArrivals.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Today's Check-ins</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {arrivals.length}
        </span>
      </div>

      <div className="space-y-4">
        {arrivals.map((res) => {
          const guest = typeof res.customerId === 'object' ? res.customerId as Guest : null;
          const guestName = guest ? `${guest.firstName} ${guest.lastName}` : '—';
          const initials = guest ? `${guest.firstName[0]}${guest.lastName[0]}` : '?';
          const roomTypeName = typeof res.roomType === 'object' ? (res.roomType as RoomDetail).name : '—';

          return (
            <div
              key={res._id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-200 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{guestName}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">
                    <Clock className="w-3 h-3" />
                    {res.daysOfStay}n
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{roomTypeName} · {res.numAdults} adults</p>
              </div>
            </div>
          );
        })}
        {arrivals.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No arrivals scheduled for today.</p>
        )}
      </div>
    </div>
  );
}
