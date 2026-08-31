import { EmptyTableRow } from '../common/EmptyState';
import { confirm as confirmDialog } from '../../lib/confirm';
import { SkeletonTableRows } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect, useCallback } from 'react';
import { toastSuccess, toastError } from '../../lib/toast';
import { SearchIcon, FilterIcon, CalendarDaysIcon, ListIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InfoIcon, XIcon, SunriseIcon, SunsetIcon, LogInIcon, LogOutIcon, MoreHorizontalIcon, EyeIcon, PencilIcon, CalendarPlusIcon, BanIcon, ScanIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import QRScanModal from '../common/QRScanModal';
import { reservationApi, guestApi, roomApi, reservationStatus, reservationTotal, Reservation, Guest, RoomDetail, Room } from '../../services/api';
import Pagination from '../common/Pagination';
import BookingCalendar from './BookingCalendar';

const STATUSES = ['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];
const CHANNELS = ['Direct', 'Online', 'Phone', 'Walk-in', 'OTA', 'Other'];

const statusBadge = (status: string) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  switch (status) {
    case 'Confirmed':   return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}><CheckCircleIcon className="w-3 h-3 mr-1"/>Confirmed</span>;
    case 'Checked In':  return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}><ClockIcon className="w-3 h-3 mr-1"/>Checked In</span>;
    case 'Checked Out': return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>Checked Out</span>;
    case 'Cancelled':   return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}><XCircleIcon className="w-3 h-3 mr-1"/>Cancelled</span>;
    default:            return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>{status}</span>;
  }
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-2 border-b dark:border-gray-700 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{value}</span>
  </div>
);

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500';

// ─── Kebab action menu ────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  primary?: 'green' | 'blue';
}

const PRIMARY_STYLES = {
  green: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 font-medium',
  blue:  'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium',
};

const ActionMenu = ({ items }: { items: MenuItem[] }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const primaryItems   = items.filter(i => i.primary);
  const secondaryItems = items.filter(i => !i.primary);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
        title="Actions"
      >
        <MoreHorizontalIcon className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
          {primaryItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${PRIMARY_STYLES[item.primary!]}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
          {primaryItems.length > 0 && secondaryItems.length > 0 && (
            <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
          )}
          {secondaryItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                item.danger
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface EditForm {
  guestId: string;
  roomType: string;
  arrivalDate: string;
  departureDate: string;
  numAdults: number;
  numChildren: number;
  bookingChannel: string;
}

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [viewReservation, setViewReservation] = useState<Reservation | null>(null);
  const [extendReservation, setExtendReservation] = useState<Reservation | null>(null);
  const [extendDate, setExtendDate] = useState('');
  const [extendError, setExtendError] = useState('');
  const [extendSubmitting, setExtendSubmitting] = useState(false);

  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [editGuests, setEditGuests] = useState<Guest[]>([]);
  const [editRoomTypes, setEditRoomTypes] = useState<RoomDetail[]>([]);
  const [editForm, setEditForm] = useState<EditForm>({ guestId: '', roomType: '', arrivalDate: '', departureDate: '', numAdults: 1, numChildren: 0, bookingChannel: '' });
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [showScanModal, setShowScanModal] = useState(false);

  // Check-in flow
  const [checkInTarget, setCheckInTarget] = useState<Reservation | null>(null);
  const [vacantRooms, setVacantRooms] = useState<Room[]>([]);
  const [vacantLoading, setVacantLoading] = useState(false);
  const [selectedCheckInRoom, setSelectedCheckInRoom] = useState('');
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const anyModalOpen = !!(editReservation || extendReservation || viewReservation || checkInTarget);
  const closeTopModal = useCallback(() => {
    if (editReservation) setEditReservation(null);
    else if (extendReservation) setExtendReservation(null);
    else if (viewReservation) setViewReservation(null);
    else if (checkInTarget) setCheckInTarget(null);
  }, [editReservation, extendReservation, viewReservation, checkInTarget]);
  useEscapeKey(anyModalOpen, closeTopModal);

  const load = (p: number, l: number) => {
    setLoading(true);
    reservationApi.getAll(p, l)
      .then(({ reservations, total, pages }) => {
        setReservations(reservations);
        setTotal(total);
        setPages(pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page, limit); }, [page, limit]);

  const filtered = reservations.filter((r) => {
    const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
    const name = guest ? `${guest.firstName} ${guest.lastName}`.toLowerCase() : '';
    const matchSearch = !searchQuery || name.includes(searchQuery.toLowerCase()) || r.reservationId.toLowerCase().includes(searchQuery.toLowerCase());
    const status = reservationStatus(r);
    const matchStatus = statusFilter === 'All' || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCancel = async (r: Reservation) => {
    if (!(await confirmDialog(`Cancel reservation ${r.reservationId}? This cannot be undone.`))) return;
    try {
      await reservationApi.cancel(r._id);
      toastSuccess(`${r.reservationId} cancelled`);
    } catch { toastError('Cancel failed'); }
    load(page, limit);
  };

  const openExtend = (r: Reservation) => {
    setExtendReservation(r);
    setExtendDate(r.departureDate.slice(0, 10));
    setExtendError('');
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendReservation) return;
    setExtendSubmitting(true);
    setExtendError('');
    try {
      await reservationApi.extend(extendReservation._id, extendDate);
      toastSuccess('Stay extended');
      setExtendReservation(null);
      load(page, limit);
    } catch (err: any) {
      setExtendError(err.message);
      toastError(err.message ?? 'Extend failed');
    } finally {
      setExtendSubmitting(false);
    }
  };

  const openEdit = async (r: Reservation) => {
    setEditError('');
    const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
    const rt = typeof r.roomType === 'object' ? r.roomType as RoomDetail : null;
    setEditForm({
      guestId: guest?._id ?? (r.customerId as string),
      roomType: rt?._id ?? (r.roomType as string),
      arrivalDate: r.arrivalDate.slice(0, 10),
      departureDate: r.departureDate.slice(0, 10),
      numAdults: r.numAdults,
      numChildren: r.numChildren ?? 0,
      bookingChannel: r.bookingChannel,
    });
    setEditReservation(r);
    if (editGuests.length === 0) {
      setEditLoading(true);
      try {
        const [g, rts] = await Promise.all([guestApi.getAll(1, 500), roomApi.getTypes()]);
        setEditGuests(g.guests);
        setEditRoomTypes(rts.roomDetails);
      } finally {
        setEditLoading(false);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReservation) return;
    setEditSubmitting(true);
    setEditError('');
    try {
      await reservationApi.edit(editReservation._id, {
        guestId: editForm.guestId,
        roomType: editForm.roomType,
        arrivalDate: editForm.arrivalDate,
        departureDate: editForm.departureDate,
        numAdults: editForm.numAdults,
        numChildren: editForm.numChildren,
        bookingChannel: editForm.bookingChannel,
      });
      toastSuccess('Reservation updated');
      setEditReservation(null);
      load(page, limit);
    } catch (err: any) {
      setEditError(err.message);
      toastError(err.message ?? 'Update failed');
    } finally {
      setEditSubmitting(false);
    }
  };

  const openCheckIn = async (r: Reservation) => {
    setCheckInTarget(r);
    setSelectedCheckInRoom('');
    setVacantLoading(true);
    try {
      const { rooms } = await roomApi.getAll();
      const rtId = typeof r.roomType === 'object' ? (r.roomType as RoomDetail)._id : r.roomType as string;
      const matching = rooms.filter(room => {
        const roomTypeId = typeof room.roomType === 'object' ? (room.roomType as RoomDetail)._id : room.roomType as string;
        return roomTypeId === rtId && room.roomStatus === 'Vacant';
      });
      setVacantRooms(matching);
      if (matching.length === 1) setSelectedCheckInRoom(matching[0]._id);
    } catch {
      toastError('Failed to load available rooms');
    } finally {
      setVacantLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInTarget || !selectedCheckInRoom) return;
    setCheckInSubmitting(true);
    try {
      await reservationApi.checkIn(checkInTarget._id, selectedCheckInRoom);
      toastSuccess(`${checkInTarget.reservationId} checked in`);
      setCheckInTarget(null);
      load(page, limit);
    } catch (err: any) {
      toastError(err.message ?? 'Check-in failed');
    } finally {
      setCheckInSubmitting(false);
    }
  };

  const handleCheckOut = async (r: Reservation) => {
    const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
    const name = guest ? `${guest.firstName} ${guest.lastName}` : r.reservationId;
    if (!(await confirmDialog(`Check out ${name}? This will mark the room as vacant and create a cleaning task.`, { title: 'Check Out', confirmLabel: 'Check Out', danger: false }))) return;
    setActionId(r._id);
    try {
      await reservationApi.checkOut(r._id);
      toastSuccess(`${name} checked out — cleaning task created`);
      load(page, limit);
    } catch (err: any) {
      toastError(err.message ?? 'Check-out failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b dark:border-gray-700 flex items-center justify-between pr-4">
          <div className="flex">
            {([['list', ListIcon, 'List'], ['calendar', CalendarDaysIcon, 'Calendar']] as const).map(([tab, Icon, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-2">
            {activeTab === 'list' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{total} total</span>
            )}
            <button
              onClick={() => setShowScanModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              title="QR Check-In Scanner"
            >
              <ScanIcon className="w-4 h-4" />Scan QR
            </button>
          </div>
        </div>

        {activeTab === 'calendar' ? (
          <BookingCalendar embedded />
        ) : (
        <div className="p-6">
          <div className="flex items-start gap-2 mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs text-blue-700 dark:text-blue-300">
            <InfoIcon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Sorted by: <strong>today's arrivals &amp; departures</strong> → <strong>currently checked in</strong> → <strong>confirmed upcoming</strong> → checked out &amp; cancelled</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white py-2"
                placeholder="Search by guest or ID…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white py-2"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Reservation ID', 'Guest', 'Room Type', 'Arrival', 'Departure', 'Days', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <SkeletonTableRows rows={6} cols={8} />
                ) : filtered.length === 0 ? (
                  <EmptyTableRow colSpan={8} message="No reservations found." sub="Try adjusting your search or filters." />
                ) : filtered.map((r) => {
                  const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
                  const guestName = guest ? `${guest.firstName} ${guest.lastName}` : '—';
                  const roomType = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '—';
                  const status = reservationStatus(r);
                  const canEdit     = status === 'Confirmed';
                  const canCancel   = status === 'Confirmed';
                  const canExtend   = status === 'Confirmed' || status === 'Checked In';
                  const canCheckIn  = status === 'Confirmed';
                  const canCheckOut = status === 'Checked In';
                  return (
                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.reservationId}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{guestName}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{roomType}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center"><CalendarDaysIcon className="w-3 h-3 mr-1 text-gray-400"/>{r.arrivalDate.slice(0, 10)}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center"><CalendarDaysIcon className="w-3 h-3 mr-1 text-gray-400"/>{r.departureDate.slice(0, 10)}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{r.daysOfStay}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {statusBadge(status)}
                          {r.earlyCheckIn && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"><SunriseIcon className="w-2.5 h-2.5"/>Early</span>}
                          {r.lateCheckOut && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"><SunsetIcon className="w-2.5 h-2.5"/>Late</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ActionMenu items={[
                          ...(canCheckIn  ? [{ label: 'Check In',     icon: <LogInIcon className="w-4 h-4" />,        onClick: () => openCheckIn(r),    primary: 'green' as const }] : []),
                          ...(canCheckOut ? [{ label: 'Check Out',    icon: <LogOutIcon className="w-4 h-4" />,       onClick: () => handleCheckOut(r), primary: 'blue'  as const }] : []),
                          { label: 'View details', icon: <EyeIcon className="w-4 h-4" />,           onClick: () => setViewReservation(r) },
                          ...(canEdit   ? [{ label: 'Edit',           icon: <PencilIcon className="w-4 h-4" />,       onClick: () => openEdit(r) }]      : []),
                          ...(canExtend ? [{ label: 'Extend stay',    icon: <CalendarPlusIcon className="w-4 h-4" />, onClick: () => openExtend(r) }]    : []),
                          ...(canCancel ? [{ label: 'Cancel',         icon: <BanIcon className="w-4 h-4" />,          onClick: () => handleCancel(r), danger: true }] : []),
                        ]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </div>
        )}
      </div>

      {/* View modal */}
      {viewReservation && (() => {
        const r = viewReservation;
        const guest = typeof r.customerId === 'object' ? r.customerId as Guest : null;
        const rt = typeof r.roomType === 'object' ? r.roomType as RoomDetail : null;
        const room = typeof r.room === 'object' && r.room ? r.room as Room : null;
        const total = reservationTotal(r);
        const status = reservationStatus(r);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{r.reservationId}</h3>
                  <div className="mt-1">{statusBadge(status)}</div>
                </div>
                <div className="flex items-start gap-2">
                  {/* QR code for this reservation — staff can scan at check-in */}
                  <div className="p-1.5 bg-white rounded-lg border border-gray-200 dark:border-gray-600">
                    <QRCodeSVG value={r.reservationId} size={56} level="M" />
                  </div>
                  <button onClick={() => setViewReservation(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="divide-y dark:divide-gray-700">
                <DetailRow label="Guest" value={guest ? `${guest.firstName} ${guest.lastName}` : '—'} />
                <DetailRow label="Customer ID" value={guest?.customerId ?? '—'} />
                <DetailRow label="Room Type" value={rt?.name ?? '—'} />
                <DetailRow label="Room" value={room ? `#${(room as any).roomNumber}` : '—'} />
                <DetailRow label="Arrival" value={r.arrivalDate.slice(0, 10)} />
                <DetailRow label="Departure" value={r.departureDate.slice(0, 10)} />
                <DetailRow label="Nights" value={r.daysOfStay} />
                <DetailRow label="Adults" value={r.numAdults} />
                {(r.numChildren ?? 0) > 0 && <DetailRow label="Children" value={r.numChildren} />}
                <DetailRow label="Booking Channel" value={r.bookingChannel} />
                <DetailRow label="Total" value={total > 0 ? `$${total.toLocaleString()}` : '—'} />
                <DetailRow label="Created" value={new Date(r.created_at).toLocaleDateString()} />
              </div>

              {/* Guest notes */}
              {guest?.notes && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Guest Notes & Preferences</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">{guest.notes}</p>
                </div>
              )}

              {/* Early check-in / late check-out toggles */}
              {(reservationStatus(r) === 'Confirmed' || reservationStatus(r) === 'Checked In') && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex gap-3">
                  <button
                    onClick={async () => {
                      await reservationApi.setFlags(r._id, { earlyCheckIn: !r.earlyCheckIn }).catch(() => {});
                      setViewReservation({ ...r, earlyCheckIn: !r.earlyCheckIn });
                      load(page, limit);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${r.earlyCheckIn ? 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-600 dark:text-amber-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <SunriseIcon className="w-3.5 h-3.5" /> Early Check-In {r.earlyCheckIn ? '✓' : ''}
                  </button>
                  <button
                    onClick={async () => {
                      await reservationApi.setFlags(r._id, { lateCheckOut: !r.lateCheckOut }).catch(() => {});
                      setViewReservation({ ...r, lateCheckOut: !r.lateCheckOut });
                      load(page, limit);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${r.lateCheckOut ? 'bg-purple-100 border-purple-400 text-purple-800 dark:bg-purple-900/40 dark:border-purple-600 dark:text-purple-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <SunsetIcon className="w-3.5 h-3.5" /> Late Check-Out {r.lateCheckOut ? '✓' : ''}
                  </button>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button onClick={() => setViewReservation(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit modal */}
      {editReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Reservation</h3>
              <button onClick={() => setEditReservation(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{editReservation.reservationId}</p>
            {editError && <p className="mb-3 text-sm text-red-500">{editError}</p>}
            {editLoading ? (
              <p className="py-6 text-center text-sm text-gray-400">Loading…</p>
            ) : (
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest</label>
                  <select className={inputCls} value={editForm.guestId} onChange={e => setEditForm(f => ({ ...f, guestId: e.target.value }))} required>
                    {editGuests.map(g => (
                      <option key={g._id} value={g._id}>{g.firstName} {g.lastName} ({g.customerId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
                  <select className={inputCls} value={editForm.roomType} onChange={e => setEditForm(f => ({ ...f, roomType: e.target.value }))} required>
                    {editRoomTypes.map(rt => (
                      <option key={rt._id} value={rt._id}>{rt.name} (${rt.price}/night)</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival</label>
                    <input type="date" className={inputCls} value={editForm.arrivalDate}
                      onChange={e => setEditForm(f => ({ ...f, arrivalDate: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure</label>
                    <input type="date" className={inputCls} value={editForm.departureDate} min={editForm.arrivalDate}
                      onChange={e => setEditForm(f => ({ ...f, departureDate: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adults</label>
                    <input type="number" min={1} className={inputCls} value={editForm.numAdults}
                      onChange={e => setEditForm(f => ({ ...f, numAdults: Number(e.target.value) }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Children</label>
                    <input type="number" min={0} className={inputCls} value={editForm.numChildren}
                      onChange={e => setEditForm(f => ({ ...f, numChildren: Number(e.target.value) }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booking Channel</label>
                  <select className={inputCls} value={editForm.bookingChannel} onChange={e => setEditForm(f => ({ ...f, bookingChannel: e.target.value }))} required>
                    <option value="">Select channel…</option>
                    {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditReservation(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                  <button type="submit" disabled={editSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                    {editSubmitting ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Extend modal */}
      {extendReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Extend Stay</h3>
              <button onClick={() => setExtendReservation(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {extendReservation.reservationId} · current checkout: <strong>{extendReservation.departureDate.slice(0, 10)}</strong>
            </p>
            {extendError && <p className="mb-3 text-sm text-red-500">{extendError}</p>}
            <form onSubmit={handleExtend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Departure Date</label>
                <input
                  type="date"
                  className={inputCls}
                  value={extendDate}
                  min={extendReservation.departureDate.slice(0, 10)}
                  onChange={e => setExtendDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setExtendReservation(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={extendSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {extendSubmitting ? 'Saving…' : 'Extend Stay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScanModal && (
        <QRScanModal onClose={() => { setShowScanModal(false); load(page, limit); }} />
      )}

      {/* Check-in room picker modal */}
      {checkInTarget && (() => {
        const guest = typeof checkInTarget.customerId === 'object' ? checkInTarget.customerId as Guest : null;
        const rt    = typeof checkInTarget.roomType === 'object'   ? checkInTarget.roomType   as RoomDetail : null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <LogInIcon className="w-4 h-4 text-green-500" />Check In
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {guest ? `${guest.firstName} ${guest.lastName}` : checkInTarget.reservationId} · {rt?.name ?? '—'}
                  </p>
                </div>
                <button onClick={() => setCheckInTarget(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Room</label>
                  {vacantLoading ? (
                    <p className="text-sm text-gray-400">Loading available rooms…</p>
                  ) : vacantRooms.length === 0 ? (
                    <p className="text-sm text-red-500">No vacant {rt?.name ?? ''} rooms available right now.</p>
                  ) : (
                    <select
                      className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm"
                      value={selectedCheckInRoom}
                      onChange={e => setSelectedCheckInRoom(e.target.value)}
                    >
                      <option value="">Select a room…</option>
                      {vacantRooms.map(room => (
                        <option key={room._id} value={room._id}>Room {room.roomNumber}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700">
                <button onClick={() => setCheckInTarget(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                  Cancel
                </button>
                <button
                  onClick={handleCheckIn}
                  disabled={!selectedCheckInRoom || checkInSubmitting || vacantLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-60"
                >
                  <LogInIcon className="w-4 h-4" />
                  {checkInSubmitting ? 'Checking in…' : 'Check In'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ReservationList;
