import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import { calendarApi, reservationApi, roomApi, CalendarReservation, CalendarRoom, RoomDetail } from '../../services/api';
import { toastSuccess, toastError } from '../../lib/toast';
import { confirm as confirmDialog } from '../../lib/confirm';

const DAYS   = 14;
const DAY_W  = 60;   // px per day column
const ROW_H  = 44;   // px per room row
const LABEL_W = 100; // px for room label column

const addDays  = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const dayStart = (d: Date) => { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; };
const isoDate  = (d: Date) => d.toISOString().slice(0, 10);

const fmtDay = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const fmtShort = (d: Date) =>
  d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const guestLabel = (r: CalendarReservation) =>
  r.customerId ? `${r.customerId.firstName} ${r.customerId.lastName}` : r.reservationId;

const statusColor = (r: CalendarReservation) =>
  r.checkedIn ? '#16a34a' : '#2563eb';

// Compute pixel left/width of a reservation block within the visible range.
const blockGeom = (r: CalendarReservation, rangeStart: Date) => {
  const arr = dayStart(new Date(r.arrivalDate));
  const dep = dayStart(new Date(r.departureDate));
  const leftDays  = Math.max(0, (arr.getTime() - rangeStart.getTime()) / 86400000);
  const rightDays = Math.min(DAYS, (dep.getTime() - rangeStart.getTime()) / 86400000);
  if (rightDays <= leftDays) return null;
  return { left: leftDays * DAY_W + 2, width: (rightDays - leftDays) * DAY_W - 4 };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DayHeader({ rangeStart }: { rangeStart: Date }) {
  const today = dayStart(new Date());
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-20">
      <div
        className="shrink-0 border-r border-gray-200 dark:border-gray-700 px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-end"
        style={{ width: LABEL_W, minWidth: LABEL_W }}
      >
        Room
      </div>
      {Array.from({ length: DAYS }).map((_, i) => {
        const d = addDays(rangeStart, i);
        const isToday = d.toDateString() === today.toDateString();
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        return (
          <div
            key={i}
            style={{ width: DAY_W, minWidth: DAY_W }}
            className={`border-r border-gray-200 dark:border-gray-700 px-1 py-2 text-center text-xs shrink-0 ${
              isToday
                ? 'bg-blue-100 dark:bg-blue-900/40 font-semibold text-blue-700 dark:text-blue-300'
                : isWeekend
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <div>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className="font-medium">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          </div>
        );
      })}
    </div>
  );
}

function RoomRow({
  label,
  sublabel,
  reservations,
  rangeStart,
  onClickRes,
}: {
  label: string;
  sublabel?: string;
  reservations: CalendarReservation[];
  rangeStart: Date;
  onClickRes: (r: CalendarReservation, e: React.MouseEvent) => void;
}) {
  const today = dayStart(new Date());
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
      <div
        className="shrink-0 border-r border-gray-200 dark:border-gray-700 px-2 flex flex-col justify-center"
        style={{ width: LABEL_W, minWidth: LABEL_W, height: ROW_H }}
      >
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{label}</span>
        {sublabel && <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{sublabel}</span>}
      </div>

      {/* Day cells (background grid) */}
      <div className="relative flex-1" style={{ height: ROW_H }}>
        {Array.from({ length: DAYS }).map((_, i) => {
          const d = addDays(rangeStart, i);
          const isToday   = d.toDateString() === today.toDateString();
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <div
              key={i}
              style={{ position: 'absolute', left: i * DAY_W, width: DAY_W, height: '100%' }}
              className={`border-r border-gray-100 dark:border-gray-700/50 ${
                isToday   ? 'bg-blue-50/60 dark:bg-blue-900/20' :
                isWeekend ? 'bg-gray-50 dark:bg-gray-800/30' : ''
              }`}
            />
          );
        })}

        {/* Reservation blocks */}
        {reservations.map(r => {
          const g = blockGeom(r, rangeStart);
          if (!g) return null;
          return (
            <button
              key={r._id}
              onClick={e => onClickRes(r, e)}
              style={{
                position: 'absolute',
                left: g.left,
                width: g.width,
                top: 6,
                height: ROW_H - 12,
                backgroundColor: statusColor(r),
              }}
              className="rounded text-white text-xs px-2 flex items-center truncate hover:brightness-110 transition-all shadow-sm z-10"
              title={`${r.reservationId}: ${guestLabel(r)}`}
            >
              {guestLabel(r)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Popover ──────────────────────────────────────────────────────────────────

function ResPopover({
  res, x, y, onClose, onRefresh,
}: {
  res: CalendarReservation;
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'info' | 'checkin'>('info');
  const [vacantRooms, setVacantRooms] = useState<{ _id: string; roomNumber: number }[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const startCheckIn = async () => {
    setMode('checkin');
    setLoadingRooms(true);
    try {
      const { rooms } = await roomApi.getAll();
      const rtId = res.roomType?._id;
      const matching = rooms.filter(r => {
        const rTypeId = typeof r.roomType === 'object' ? (r.roomType as RoomDetail)._id : r.roomType as string;
        return rTypeId === rtId && r.roomStatus === 'Vacant';
      });
      setVacantRooms(matching);
      if (matching.length === 1) setSelectedRoom(matching[0]._id);
    } catch {
      toastError('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  const confirmCheckIn = async () => {
    if (!selectedRoom) return;
    setActing(true);
    try {
      await reservationApi.checkIn(res._id, selectedRoom);
      toastSuccess(`${res.reservationId} checked in`);
      onClose();
      onRefresh();
    } catch (err: any) {
      toastError(err.message ?? 'Check-in failed');
    } finally {
      setActing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!(await confirmDialog(
      `Check out ${guestLabel(res)}? This will mark the room as vacant and create a cleaning task.`,
      { title: 'Check Out', confirmLabel: 'Check Out', danger: false }
    ))) return;
    setActing(true);
    try {
      await reservationApi.checkOut(res._id);
      toastSuccess(`${guestLabel(res)} checked out`);
      onClose();
      onRefresh();
    } catch (err: any) {
      toastError(err.message ?? 'Check-out failed');
    } finally {
      setActing(false);
    }
  };

  // Keep within viewport — widen slightly for check-in mode
  const w     = mode === 'checkin' ? 260 : 240;
  const left  = Math.min(x + 8, window.innerWidth  - w - 8);
  const top   = Math.min(y + 8, window.innerHeight - 320);
  const nights = Math.ceil(
    (new Date(res.departureDate).getTime() - new Date(res.arrivalDate).getTime()) / 86400000
  );
  const canCheckIn  = !res.checkedIn && !res.checkedOut;
  const canCheckOut =  res.checkedIn && !res.checkedOut;

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', left, top, zIndex: 9999, width: w }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start p-4 pb-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{guestLabel(res)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{res.reservationId}</p>
        </div>
        <button onClick={onClose} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="px-4 pb-3 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Room type</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{res.roomType?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Arrival</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{fmtShort(new Date(res.arrivalDate))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Departure</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{fmtShort(new Date(res.departureDate))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Nights</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{nights}</span>
        </div>
        <div className="flex justify-between pt-1 border-t dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Status</span>
          <span className={`font-medium ${canCheckOut ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {canCheckOut ? 'Checked In' : 'Confirmed'}
          </span>
        </div>
      </div>

      {/* Check-in room picker */}
      {mode === 'checkin' && (
        <div className="px-4 pb-3 border-t dark:border-gray-700 pt-3 space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Assign Room</p>
          {loadingRooms ? (
            <p className="text-xs text-gray-400">Loading rooms…</p>
          ) : vacantRooms.length === 0 ? (
            <p className="text-xs text-red-500">No vacant {res.roomType?.name ?? ''} rooms available.</p>
          ) : (
            <select
              className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded py-1.5 px-2 text-xs"
              value={selectedRoom}
              onChange={e => setSelectedRoom(e.target.value)}
            >
              <option value="">Select room…</option>
              {vacantRooms.map(r => (
                <option key={r._id} value={r._id}>Room {r.roomNumber}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Action buttons */}
      {(canCheckIn || canCheckOut) && (
        <div className="px-4 py-3 border-t dark:border-gray-700 flex gap-2">
          {canCheckIn && mode === 'info' && (
            <button
              onClick={startCheckIn}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            >
              <LogInIcon className="w-3 h-3" />Check In
            </button>
          )}
          {canCheckIn && mode === 'checkin' && (
            <>
              <button
                onClick={() => setMode('info')}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={confirmCheckIn}
                disabled={!selectedRoom || acting || loadingRooms || vacantRooms.length === 0}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
              >
                <LogInIcon className="w-3 h-3" />{acting ? '…' : 'Confirm'}
              </button>
            </>
          )}
          {canCheckOut && (
            <button
              onClick={handleCheckOut}
              disabled={acting}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-60"
            >
              <LogOutIcon className="w-3 h-3" />{acting ? '…' : 'Check Out'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface BookingCalendarProps { embedded?: boolean; }

const BookingCalendar = ({ embedded = false }: BookingCalendarProps) => {
  const [rangeStart, setRangeStart] = useState<Date>(() => {
    const d = dayStart(new Date());
    d.setDate(d.getDate() - d.getDay() + 1); // Monday of current week
    return d;
  });

  const [rooms, setRooms] = useState<CalendarRoom[]>([]);
  const [unassigned, setUnassigned] = useState<CalendarReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [popover, setPopover] = useState<{ res: CalendarReservation; x: number; y: number } | null>(null);

  const rangeEnd = addDays(rangeStart, DAYS - 1);

  const load = useCallback(() => {
    setLoading(true);
    calendarApi.get(isoDate(rangeStart), isoDate(rangeEnd))
      .then(({ rooms, unassigned }) => { setRooms(rooms); setUnassigned(unassigned); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rangeStart]);

  useEffect(() => { load(); }, [load]);

  const handleResClick = (res: CalendarReservation, e: React.MouseEvent) => {
    e.stopPropagation();
    setPopover({ res, x: e.clientX, y: e.clientY });
  };

  const goToday = () => {
    const d = dayStart(new Date());
    d.setDate(d.getDate() - d.getDay() + 1);
    setRangeStart(d);
  };

  const calendarContent = (
    <>
      {/* Toolbar */}
      <div className={`px-4 py-3 flex items-center justify-between ${embedded ? 'border-b dark:border-gray-700' : 'px-6 py-4 border-b dark:border-gray-700'}`}>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {fmtDay(rangeStart)} — {fmtDay(rangeEnd)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Today
          </button>
          <button
            onClick={() => setRangeStart(d => addDays(d, -7))}
            className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRangeStart(d => addDays(d, 7))}
            className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-600 inline-block" /> Checked In
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto scrollbar-hide">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">Loading…</div>
        ) : (
          <div style={{ minWidth: LABEL_W + DAYS * DAY_W }}>
            <DayHeader rangeStart={rangeStart} />
            {rooms.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">No rooms configured.</div>
            ) : rooms.map(room => (
              <RoomRow
                key={room._id}
                label={`#${room.roomNumber}`}
                sublabel={room.roomType?.name}
                reservations={room.reservations}
                rangeStart={rangeStart}
                onClickRes={handleResClick}
              />
            ))}
            {unassigned.length > 0 && (
              <>
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  Pending Room Assignment ({unassigned.length})
                </div>
                {unassigned.map(r => (
                  <RoomRow
                    key={r._id}
                    label={r.roomType?.name ?? 'Unknown'}
                    sublabel={r.reservationId}
                    reservations={[r]}
                    rangeStart={rangeStart}
                    onClickRes={handleResClick}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {popover && (
        <ResPopover
          res={popover.res}
          x={popover.x}
          y={popover.y}
          onClose={() => setPopover(null)}
          onRefresh={load}
        />
      )}
    </>
  );

  if (embedded) return calendarContent;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Booking Calendar</h2>
          </div>
        </div>
        {calendarContent}
      </div>
    </div>
  );
};

export default BookingCalendar;
