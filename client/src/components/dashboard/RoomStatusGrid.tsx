import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { roomApi, Room } from '../../services/api';

export function RoomStatusGrid() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    roomApi.getAll().then(({ rooms }) => setRooms(rooms)).catch(() => {});
  }, []);

  const total = rooms.length || 1;
  const vacant = rooms.filter(r => r.roomStatus === 'Vacant').length;
  const occupied = rooms.filter(r => r.roomStatus === 'Occupied').length;
  const maintenance = rooms.filter(r => r.roomStatus === 'Maintenance').length;
  const outOfOrder = rooms.filter(r => r.roomStatus === 'Out Of Order').length;

  const statuses = [
    { label: 'Vacant',       count: vacant,     color: 'bg-emerald-500', icon: CheckCircle2, textColor: 'text-emerald-700', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Occupied',     count: occupied,   color: 'bg-blue-500',    icon: XCircle,      textColor: 'text-blue-700',    bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Maintenance',  count: maintenance,color: 'bg-amber-400',   icon: Clock,        textColor: 'text-amber-700',   bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Out Of Order', count: outOfOrder, color: 'bg-red-500',     icon: AlertCircle,  textColor: 'text-red-700',     bgColor: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const occupancyPct = rooms.length > 0 ? Math.round((occupied / rooms.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Room Status</h3>
        <span className="text-xs font-medium px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
          Total: {rooms.length} Rooms
        </span>
      </div>

      <div className="space-y-5">
        {statuses.map((s) => {
          const pct = rooms.length > 0 ? Math.round((s.count / total) * 100) : 0;
          return (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${s.bgColor}`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{s.label}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {s.count}{' '}
                  <span className="text-gray-400 font-normal text-xs">({pct}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${s.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-center">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Occupancy</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{occupancyPct}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Vacant</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{vacant}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Maintenance</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{maintenance + outOfOrder}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
