import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const statuses = [
  {
    label: 'Available',
    count: 34,
    total: 120,
    color: 'bg-emerald-500',
    icon: CheckCircle2,
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50'
  },
  {
    label: 'Occupied',
    count: 72,
    total: 120,
    color: 'bg-blue-500',
    icon: XCircle,
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  {
    label: 'Cleaning',
    count: 6,
    total: 120,
    color: 'bg-amber-400',
    icon: Clock,
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50'
  },
  {
    label: 'Maintenance',
    count: 8,
    total: 120,
    color: 'bg-red-500',
    icon: AlertCircle,
    textColor: 'text-red-700',
    bgColor: 'bg-red-50'
  }
];

export function RoomStatusGrid() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1e2433] dark:text-gray-100">
          Room Status
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-[#f7f5f2] dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
          Total: 120 Rooms
        </span>
      </div>

      <div className="space-y-5">
        {statuses.map((status) => {
          const percentage = Math.round((status.count / status.total) * 100);
          return (
            <div key={status.label}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${status.bgColor}`}>
                    <status.icon className={`w-3.5 h-3.5 ${status.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {status.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#1e2433] dark:text-gray-100">
                  {status.count}{' '}
                  <span className="text-gray-400 dark:text-gray-400 font-normal text-xs">
                    ({percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${status.color} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${percentage}%`
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-center">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Occupancy
            </p>
            <p className="text-xl font-bold text-[#1e2433] dark:text-gray-100 mt-1">
              60%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              ADR
            </p>
            <p className="text-xl font-bold text-[#1e2433] dark:text-gray-100 mt-1">
              $185
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              RevPAR
            </p>
            <p className="text-xl font-bold text-[#1e2433] dark:text-gray-100 mt-1">
              $112
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
