import { SkeletonShiftGrid } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { shiftApi, staffApi, Shift, StaffMember } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

const DEPARTMENTS = ['Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Management'];

const DEPT_COLORS: Record<string, string> = {
  'Front Desk':      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  'Housekeeping':    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700',
  'Maintenance':     'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  'Food & Beverage': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'Security':        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700',
  'Management':      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
};

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const weekStart = (d: Date) => {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay() + 1);
  r.setHours(0, 0, 0, 0);
  return r;
};

const ShiftManagement = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const [weekOf, setWeekOf] = useState(() => weekStart(new Date()));
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [form, setForm] = useState({ userId: '', date: isoDate(new Date()), startTime: '08:00', endTime: '16:00', department: 'Front Desk', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekOf, i));
  const start = isoDate(weekOf);
  const end = isoDate(addDays(weekOf, 6));

  const load = () => {
    setLoading(true);
    Promise.all([
      shiftApi.getAll(start, end),
      staffApi.getList(),
    ]).then(([{ shifts }, { staff }]) => {
      setShifts(shifts);
      setStaff(staff);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [start]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { shift } = await shiftApi.create(form);
      setShifts(ss => [...ss, shift].sort((a, b) => a.date.localeCompare(b.date)));
      setShowModal(false);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await shiftApi.delete(id).catch(() => {});
    setShifts(ss => ss.filter(s => s._id !== id));
  };

  const shiftsOnDay = (day: Date) =>
    shifts.filter(s => s.date.slice(0, 10) === isoDate(day));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Shift Schedule</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Week of {fmtDay(weekOf)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOf(d => weekStart(addDays(d, -7)))} className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setWeekOf(weekStart(new Date()))} className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Today</button>
            <button onClick={() => setWeekOf(d => weekStart(addDays(d, 7)))} className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            {isAdmin && (
              <button onClick={() => { setForm(f => ({ ...f, date: isoDate(new Date()) })); setShowModal(true); }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                <PlusIcon className="w-4 h-4" />Add Shift
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto scrollbar-hide"><SkeletonShiftGrid /></div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-7 min-w-[700px]">
              {weekDays.map((day, i) => {
                const isToday = isoDate(day) === isoDate(new Date());
                return (
                  <div key={i} className={`border-r last:border-r-0 dark:border-gray-700 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <div className={`px-2 py-3 border-b dark:border-gray-700 text-center text-xs font-semibold ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <div>{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className={`text-base font-bold mt-0.5 ${isToday ? 'text-blue-700 dark:text-blue-400' : ''}`}>{day.getDate()}</div>
                    </div>
                    <div className="p-1.5 space-y-1 min-h-[120px]">
                      {shiftsOnDay(day).map(s => {
                        const u = s.userId;
                        return (
                          <div key={s._id} className={`rounded border p-1.5 text-xs ${DEPT_COLORS[s.department] ?? 'bg-gray-100 border-gray-200'}`}>
                            <div className="font-semibold truncate">{u ? `${u.fname} ${u.lname}` : '—'}</div>
                            <div className="text-xs opacity-80">{s.startTime}–{s.endTime}</div>
                            <div className="text-xs opacity-70">{s.department}</div>
                            {isAdmin && (
                              <button onClick={() => handleDelete(s._id)} className="mt-1 text-red-400 hover:text-red-600">
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Department legend */}
        <div className="px-6 py-3 border-t dark:border-gray-700 flex flex-wrap gap-3">
          {Object.entries(DEPT_COLORS).map(([dept, cls]) => (
            <span key={dept} className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${cls}`}>{dept}</span>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Add Shift</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Member</label>
                <select className={inputCls} value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} required>
                  <option value="">Select staff…</option>
                  {staff.map(s => <option key={s._id} value={s._id}>{s.fname} {s.lname} ({s.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start</label>
                  <input type="time" className={inputCls} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
                  <input type="time" className={inputCls} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select className={inputCls} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <input type="text" className={inputCls} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving…' : 'Add Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagement;
