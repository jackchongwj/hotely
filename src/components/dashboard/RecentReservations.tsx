import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const reservations = [
  {
    id: 'RES-001',
    guest: 'James Wilson',
    room: 'Suite 401',
    checkIn: 'Oct 24, 2023',
    checkOut: 'Oct 28, 2023',
    status: 'Confirmed',
    amount: '$1,240'
  },
  {
    id: 'RES-002',
    guest: 'Elena Rodriguez',
    room: 'Deluxe 215',
    checkIn: 'Oct 24, 2023',
    checkOut: 'Oct 26, 2023',
    status: 'Checked In',
    amount: '$480'
  },
  {
    id: 'RES-003',
    guest: 'Michael Chen',
    room: 'Standard 104',
    checkIn: 'Oct 25, 2023',
    checkOut: 'Oct 27, 2023',
    status: 'Pending',
    amount: '$320'
  },
  {
    id: 'RES-004',
    guest: 'Sarah Miller',
    room: 'Suite 502',
    checkIn: 'Oct 26, 2023',
    checkOut: 'Oct 30, 2023',
    status: 'Confirmed',
    amount: '$1,850'
  },
  {
    id: 'RES-005',
    guest: 'Robert Fox',
    room: 'Deluxe 218',
    checkIn: 'Oct 23, 2023',
    checkOut: 'Oct 25, 2023',
    status: 'Checked Out',
    amount: '$520'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800/50';
    case 'Checked In':
      return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800/50';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/50';
    case 'Checked Out':
      return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    case 'Cancelled':
      return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800/50';
    default:
      return 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200';
  }
};

export function RecentReservations() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1e2433] dark:text-gray-100">
          Recent Reservations
        </h3>
        <button className="text-sm font-medium text-[#d4a853] hover:text-[#b88e3e] transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
              <th className="pb-3 pl-2">Guest</th>
              <th className="pb-3">Room</th>
              <th className="pb-3">Check-in</th>
              <th className="pb-3">Check-out</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Amount</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {reservations.map((res) => (
              <tr
                key={res.id}
                className="group hover:bg-[#f7f5f2]/50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#1e2433] dark:text-gray-100 text-sm">
                      {res.guest}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{res.room}</td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{res.checkIn}</td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{res.checkOut}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      res.status
                    )}`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="py-3 text-sm font-medium text-[#1e2433] dark:text-gray-100 text-right">
                  {res.amount}
                </td>
                <td className="py-3 text-right pr-2">
                  <button className="p-1 text-gray-400 hover:text-[#1e2433] dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
