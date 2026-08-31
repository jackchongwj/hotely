import { confirm as confirmDialog } from '../../lib/confirm';
import { SkeletonRoomCards } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, FilterIcon, TrashIcon, XIcon } from 'lucide-react';
import { roomApi, Room, RoomDetail, Reservation, Guest } from '../../services/api';

const STATUS_BAR: Record<string, string> = {
  'Vacant':       'border-l-green-500',
  'Occupied':     'border-l-blue-500',
  'Maintenance':  'border-l-amber-500',
  'Out Of Order': 'border-l-red-500',
};

const STATUS_BADGE: Record<string, string> = {
  'Vacant':       'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Occupied':     'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Maintenance':  'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  'Out Of Order': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const STATUS_DOT: Record<string, string> = {
  'Vacant':       'bg-green-500',
  'Occupied':     'bg-blue-500',
  'Maintenance':  'bg-amber-500',
  'Out Of Order': 'bg-red-500',
};

const STATUS_BAR_COLOR: Record<string, string> = {
  'Vacant':       'bg-green-500',
  'Occupied':     'bg-blue-500',
  'Maintenance':  'bg-amber-500',
  'Out Of Order': 'bg-red-500',
};

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

const STATUSES = ['Vacant', 'Occupied', 'Maintenance', 'Out Of Order'] as const;

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  useEscapeKey(showAddModal, () => setShowAddModal(false));
  const [roomTypes, setRoomTypes] = useState<RoomDetail[]>([]);
  const [addForm, setAddForm] = useState({ roomNumber: '', roomType: '' });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  const load = () => {
    setLoading(true);
    roomApi.getAll()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAddModal = async () => {
    setAddForm({ roomNumber: '', roomType: '' });
    setAddError('');
    setShowAddModal(true);
    if (roomTypes.length === 0) {
      const { roomDetails } = await roomApi.getTypes().catch(() => ({ roomDetails: [] }));
      setRoomTypes(roomDetails);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError('');
    try {
      await roomApi.create({ roomNumber: Number(addForm.roomNumber), roomType: addForm.roomType });
      setShowAddModal(false);
      load();
    } catch (err: any) {
      setAddError(err.message ?? 'Failed to add room');
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Room['roomStatus']) => {
    await roomApi.update(id, { roomStatus: status }).catch(() => {});
    setRooms(rs => rs.map(r => r._id === id ? { ...r, roomStatus: status } : r));
  };

  const handleDelete = async (id: string, num: number) => {
    if (!(await confirmDialog(`Delete room ${num}? This cannot be undone.`))) return;
    await roomApi.delete(id).catch(() => {});
    setRooms(rs => rs.filter(r => r._id !== id));
  };

  const filtered = rooms.filter(r => {
    const type = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '';
    if (filter !== 'all' && r.roomStatus !== filter) return false;
    if (searchQuery && !String(r.roomNumber).includes(searchQuery) && !type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = STATUSES.map(s => ({ s, n: rooms.filter(r => r.roomStatus === s).length }));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Room Management</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{rooms.length} rooms</span>
          </div>
          <button onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusIcon className="w-4 h-4" />Add Room
          </button>
        </div>

        <div className="p-6">
          {/* Summary strip */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {counts.map(({ s, n }) => (
              <div key={s} className={`rounded-lg border-l-4 ${STATUS_BAR[s]} bg-gray-50 dark:bg-gray-700/50 px-3 py-2`}>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{n}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" className="pl-9 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-1.5 text-sm"
                placeholder="Search by number or type…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select className="pl-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-1.5 text-sm pr-3"
                value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <SkeletonRoomCards n={12} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map(room => {
                const rtObj = typeof room.roomType === 'object' ? room.roomType as RoomDetail : null;
                const typeName = rtObj?.name ?? '—';
                const price = rtObj?.price ?? 0;

                const res = typeof room.currentReservation === 'object' && room.currentReservation
                  ? room.currentReservation as Reservation : null;
                const currentGuest = res && typeof res.customerId === 'object'
                  ? res.customerId as Guest : null;

                return (
                  <div key={room._id}
                    className={`relative border-l-4 ${STATUS_BAR[room.roomStatus] ?? 'border-l-gray-400'} border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-bl-lg bg-white dark:bg-gray-800 p-3 flex flex-col gap-2`}>

                    {/* Room number + delete */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white leading-none">{room.roomNumber}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[room.roomStatus] ?? 'bg-gray-400'}`} />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{room.roomStatus}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(room._id, room.roomNumber)}
                        className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors p-0.5">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Room type + price */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{typeName}</p>
                      {price > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">${price}/night</p>}
                    </div>

                    {/* Current guest */}
                    {currentGuest && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300 truncate">{currentGuest.firstName} {currentGuest.lastName}</p>
                        {res?.departureDate && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">Until {res.departureDate.slice(0, 10)}</p>
                        )}
                      </div>
                    )}

                    {/* Maintenance/OOO note */}
                    {(room.roomStatus === 'Maintenance' || room.roomStatus === 'Out Of Order') && !currentGuest && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1">
                        <p className="text-xs text-amber-700 dark:text-amber-300">{room.roomStatus === 'Maintenance' ? 'Under maintenance' : 'Out of order'}</p>
                      </div>
                    )}

                    {/* Status dropdown */}
                    <select
                      className="mt-auto block w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded text-xs py-1 px-1.5"
                      value={room.roomStatus}
                      onChange={e => handleStatusUpdate(room._id, e.target.value as Room['roomStatus'])}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-sm text-gray-500 py-8">No rooms match your filters.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-base font-medium text-gray-800 dark:text-gray-200">Room Status Overview</h2>
        </div>
        <div className="p-6 space-y-3">
          {counts.map(({ s, n }) => {
            const pct = rooms.length > 0 ? Math.round((n / rooms.length) * 100) : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-28">{s}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${STATUS_BAR_COLOR[s] ?? 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16 text-right">{n} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Add Room</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            {addError && <p className="mb-3 text-sm text-red-500">{addError}</p>}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                <input
                  type="number" min={1} className={inputCls} required
                  value={addForm.roomNumber}
                  onChange={e => setAddForm(f => ({ ...f, roomNumber: e.target.value }))}
                  placeholder="e.g. 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
                <select
                  className={inputCls} required
                  value={addForm.roomType}
                  onChange={e => setAddForm(f => ({ ...f, roomType: e.target.value }))}>
                  <option value="">Select type…</option>
                  {roomTypes.map(rt => (
                    <option key={rt._id} value={rt._id}>{rt.name} (${rt.price}/night)</option>
                  ))}
                </select>
                {roomTypes.length === 0 && (
                  <p className="mt-1 text-xs text-gray-400">No room types found. Add types in Settings → Room Types first.</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={addSubmitting || roomTypes.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {addSubmitting ? 'Adding…' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
