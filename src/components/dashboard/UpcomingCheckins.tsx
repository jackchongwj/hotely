import React from 'react';
import { Clock } from 'lucide-react';

const checkins = [
  {
    id: 1,
    name: 'Alice Freeman',
    roomType: 'Ocean View Suite',
    time: '2:00 PM',
    request: 'Early check-in'
  },
  {
    id: 2,
    name: 'David Kim',
    roomType: 'Deluxe King',
    time: '3:30 PM',
    request: 'Extra pillows'
  },
  {
    id: 3,
    name: 'Emma Watson',
    roomType: 'Standard Twin',
    time: '4:15 PM',
    request: null
  },
  {
    id: 4,
    name: 'James Smith',
    roomType: 'Presidential Suite',
    time: '6:00 PM',
    request: 'Champagne on ice'
  }
];

export function UpcomingCheckins() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1e2433] dark:text-gray-100">
          Today's Check-ins
        </h3>
        <span className="bg-[#d4a853] text-white text-xs font-bold px-2 py-1 rounded-full">
          4
        </span>
      </div>

      <div className="space-y-4">
        {checkins.map((guest) => (
          <div
            key={guest.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f5f2] dark:hover:bg-gray-700/60 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-semibold text-[#1e2433] dark:text-gray-100 truncate">
                  {guest.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">
                  <Clock className="w-3 h-3" />
                  {guest.time}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {guest.roomType}
              </p>
              {guest.request && (
                <p className="text-xs text-[#d4a853] mt-1.5 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#d4a853]"></span>
                  {guest.request}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-[#1e2433] dark:hover:text-gray-100 transition-colors border-t border-gray-50 dark:border-gray-700">
        View all arrivals
      </button>
    </div>
  );
}
