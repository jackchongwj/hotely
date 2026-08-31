import { SkeletonKanban } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, WrenchIcon, SparklesIcon, XIcon } from 'lucide-react';
import { housekeepingApi, roomApi, HousekeepingTask, Room } from '../../services/api';

const PRIORITY_COLORS: Record<string, string> = {
  High:   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Low:    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const STATUS_COLS = ['Pending', 'In Progress', 'Completed'] as const;
const STATUS_HEADER_COLORS = {
  'Pending':     'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  'In Progress': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  'Completed':   'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
};

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

type Category = 'Housekeeping' | 'Maintenance';

const MAINTENANCE_TYPES = ['Plumbing', 'Electrical', 'HVAC', 'Furniture', 'Appliance', 'Structural', 'Other'];
const HOUSEKEEPING_TYPES = ['Cleaning', 'Turndown', 'Deep Clean', 'Linen Change', 'Inspection', 'Other'];

const Housekeeping = () => {
  const [category, setCategory] = useState<Category>('Housekeeping');
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [form, setForm] = useState({ type: '', description: '', priority: 'Medium' as HousekeepingTask['priority'], roomId: '', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = (cat: Category) => {
    setLoading(true);
    Promise.all([
      housekeepingApi.getAll(cat),
      roomApi.getAll(),
    ]).then(([{ tasks }, { rooms }]) => {
      setTasks(tasks);
      setRooms(rooms);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(category); }, [category]);

  const handleStatusChange = async (id: string, status: HousekeepingTask['status']) => {
    await housekeepingApi.update(id, { status });
    load(category);
  };

  const handleDelete = async (id: string) => {
    await housekeepingApi.delete(id);
    load(category);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await housekeepingApi.create({ ...form, category });
      setShowModal(false);
      setForm({ type: '', description: '', priority: 'Medium', roomId: '', dueDate: '' });
      load(category);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const byStatus = (status: typeof STATUS_COLS[number]) =>
    tasks.filter(t => t.status === status);

  const typeOptions = category === 'Maintenance' ? MAINTENANCE_TYPES : HOUSEKEEPING_TYPES;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setCategory('Housekeeping')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${category === 'Housekeeping' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'}`}
            >
              <SparklesIcon className="w-4 h-4" /> Housekeeping
            </button>
            <button
              onClick={() => setCategory('Maintenance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${category === 'Maintenance' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'}`}
            >
              <WrenchIcon className="w-4 h-4" /> Maintenance
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />
            {category === 'Maintenance' ? 'New Request' : 'Create Task'}
          </button>
        </div>

        {loading ? (
          <SkeletonKanban />
        ) : (
          <div className="p-4 overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-3 gap-4 min-w-[640px]">
            {STATUS_COLS.map(col => (
              <div key={col} className={`rounded-lg border p-4 ${STATUS_HEADER_COLORS[col]} flex flex-col`}>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 shrink-0">{col} <span className="ml-1 text-xs text-gray-500">({byStatus(col).length})</span></h3>
                <div className="space-y-3 overflow-y-auto scrollbar-hide max-h-[60vh]">
                  {byStatus(col).map(task => {
                    const room = typeof task.roomId === 'object' ? task.roomId as Room : null;
                    const roomNo = room ? `Room ${room.roomNumber}` : '—';
                    return (
                      <div key={task._id} className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.type}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{task.description}</p>
                        <p className="text-xs text-gray-400">{roomNo}</p>
                        {task.dueDate && <p className="text-xs text-gray-400 mt-1">Due: {task.dueDate.slice(0, 10)}</p>}
                        <div className="mt-2 flex items-center gap-2">
                          <select
                            className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded text-xs py-1"
                            value={task.status}
                            onChange={e => handleStatusChange(task._id, e.target.value as HousekeepingTask['status'])}
                          >
                            {STATUS_COLS.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <button onClick={() => handleDelete(task._id)} className="p-1 text-red-400 hover:text-red-600">
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {byStatus(col).length === 0 && <p className="text-xs text-gray-400 text-center py-6">No tasks</p>}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Task / Maintenance Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {category === 'Maintenance' ? 'New Maintenance Request' : 'New Housekeeping Task'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form id="hk-form" onSubmit={handleCreate} className="overflow-y-auto scrollbar-hide flex-1 px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {category === 'Maintenance' ? 'Issue Type' : 'Task Type'}
                </label>
                <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="">Select type…</option>
                  {typeOptions.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room</label>
                <select className={inputCls} value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))} required>
                  <option value="">Select room…</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select className={inputCls} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as HousekeepingTask['priority'] }))}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
            </form>
            <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
              <button type="submit" form="hk-form" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                {submitting ? 'Creating…' : category === 'Maintenance' ? 'Submit Request' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Housekeeping;
