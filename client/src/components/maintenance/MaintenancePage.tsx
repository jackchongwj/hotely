import React, { useState, useEffect, useCallback } from 'react';
import {
  WrenchIcon, PlusIcon, FilterIcon, RefreshCwIcon,
  AlertTriangleIcon, ClockIcon, CheckCircleIcon, ZapIcon,
} from 'lucide-react';
import {
  maintenanceApi, MaintenanceTicket, TicketStatus, TicketPriority, TicketCategory,
  StaffUser, roomApi, userApi,
} from '../../services/api';

import { confirm as confirmDialog } from '../../lib/confirm';
import Pagination from '../common/Pagination';
import useEscapeKey from '../../hooks/useEscapeKey';
import { toastSuccess, toastError } from '../../lib/toast';
import { useAuth } from '../../context/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<TicketPriority, string> = {
  low:    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  open:        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  resolved:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  closed:      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed',
};

const CATEGORY_LABEL: Record<TicketCategory, string> = {
  plumbing: 'Plumbing', electrical: 'Electrical', hvac: 'HVAC',
  furniture: 'Furniture', appliance: 'Appliance', cleaning: 'Cleaning', other: 'Other',
};

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

// ─── Create Modal ─────────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: () => void;
  staff: StaffUser[];
  rooms: Array<{ _id: string; roomNumber: number }>;
}

const CreateModal = ({ onClose, onCreated, staff, rooms }: CreateModalProps) => {
  useEscapeKey(true, onClose);
  const [form, setForm] = useState({
    title: '', description: '', category: 'other' as TicketCategory,
    priority: 'medium' as TicketPriority, roomId: '', assignedTo: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await maintenanceApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        roomId: form.roomId || undefined,
        assignedTo: form.assignedTo || undefined,
      });
      toastSuccess('Ticket created');
      onCreated();
      onClose();
    } catch {
      toastError('Failed to create ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <WrenchIcon className="w-5 h-5 text-amber-500" /> New Maintenance Ticket
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Leaking faucet in Room 101" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Additional details…" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value as TicketCategory)}>
                {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={inputCls} value={form.priority} onChange={e => set('priority', e.target.value as TicketPriority)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Room (optional)</label>
              <select className={inputCls} value={form.roomId} onChange={e => set('roomId', e.target.value)}>
                <option value="">— None —</option>
                {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assign To (optional)</label>
              <select className={inputCls} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                <option value="">— Unassigned —</option>
                {staff.map(s => <option key={s._id} value={s._id}>{s.fname} {s.lname}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-md font-medium">
              {saving ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  ticket: MaintenanceTicket;
  onClose: () => void;
  onUpdated: () => void;
  staff: StaffUser[];
  isAdmin: boolean;
}

const DetailModal = ({ ticket, onClose, onUpdated, staff, isAdmin }: DetailModalProps) => {
  useEscapeKey(true, onClose);
  const [form, setForm] = useState({
    status: ticket.status,
    priority: ticket.priority,
    assignedTo: typeof ticket.assignedTo === 'object' && ticket.assignedTo ? (ticket.assignedTo as any)._id ?? '' : '',
    resolutionNotes: ticket.resolutionNotes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await maintenanceApi.update(ticket._id, {
        status: form.status as TicketStatus,
        priority: form.priority as TicketPriority,
        assignedTo: form.assignedTo || null,
        resolutionNotes: form.resolutionNotes,
      });
      toastSuccess('Ticket updated');
      onUpdated();
      onClose();
    } catch {
      toastError('Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!(await confirmDialog(`Delete ticket ${ticket.ticketNumber}? This cannot be undone.`, { danger: true }))) return;
    await maintenanceApi.delete(ticket._id).catch(() => {});
    toastSuccess('Ticket deleted');
    onUpdated();
    onClose();
  };

  const reporter = ticket.reportedBy ? `${ticket.reportedBy.fname} ${ticket.reportedBy.lname}` : 'System';
  const roomLabel = ticket.roomId ? `Room ${ticket.roomId.roomNumber}` : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-start justify-between shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-mono mb-0.5">{ticket.ticketNumber}</p>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">{ticket.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none ml-4">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><span className="text-gray-500 dark:text-gray-400">Room</span><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{roomLabel}</p></div>
            <div><span className="text-gray-500 dark:text-gray-400">Category</span><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{CATEGORY_LABEL[ticket.category]}</p></div>
            <div><span className="text-gray-500 dark:text-gray-400">Reported By</span><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{reporter}</p></div>
            <div><span className="text-gray-500 dark:text-gray-400">Created</span><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{new Date(ticket.createdAt).toLocaleDateString('en-MY', { day:'2-digit', month:'short', year:'numeric' })}</p></div>
          </div>
          {ticket.description && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded p-3">{ticket.description}</p>
            </div>
          )}
          <div className="border-t dark:border-gray-700 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Priority</label>
                <select className={inputCls} value={form.priority} onChange={e => set('priority', e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Assigned To</label>
              <select className={inputCls} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                <option value="">— Unassigned —</option>
                {staff.map(s => <option key={s._id} value={s._id}>{s.fname} {s.lname}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Resolution Notes</label>
              <textarea className={inputCls} rows={3} value={form.resolutionNotes} onChange={e => set('resolutionNotes', e.target.value)} placeholder="What was done to resolve this issue?" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between shrink-0">
          {isAdmin
            ? <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">Delete</button>
            : <span />
          }
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-md font-medium">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const MaintenancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const [tickets, setTickets]     = useState<MaintenanceTicket[]>([]);
  const [stats, setStats]         = useState({ open: 0, in_progress: 0, resolved: 0, urgent: 0 });
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [staff, setStaff]         = useState<StaffUser[]>([]);
  const [rooms, setRooms]         = useState<Array<{ _id: string; roomNumber: number }>>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected]   = useState<MaintenanceTicket | null>(null);

  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      maintenanceApi.getAll({ status: filterStatus || undefined, priority: filterPriority || undefined, category: filterCategory || undefined, page, limit: 20 }),
      maintenanceApi.getStats(),
    ]).then(([data, s]) => {
      setTickets(data.tickets);
      setTotal(data.total);
      setPages(data.pages);
      setStats(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [filterStatus, filterPriority, filterCategory, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    roomApi.getAll().then(({ rooms }) => setRooms(rooms.map(r => ({ _id: r._id, roomNumber: r.roomNumber })))).catch(() => {});
    userApi.getAll().then(({ users }) => setStaff(users)).catch(() => {});
  }, []);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v); setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open',        value: stats.open,        icon: AlertTriangleIcon, color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'In Progress', value: stats.in_progress, icon: ClockIcon,         color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Resolved',    value: stats.resolved,    icon: CheckCircleIcon,   color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Urgent',      value: stats.urgent,      icon: ZapIcon,           color: 'text-purple-500',bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-lg p-4 flex items-center gap-3`}>
            <Icon className={`w-8 h-8 ${color}`} />
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Maintenance Tickets</h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filters */}
            <div className="relative">
              <FilterIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
                value={filterStatus} onChange={e => handleFilterChange(setFilterStatus)(e.target.value)}>
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
              value={filterPriority} onChange={e => handleFilterChange(setFilterPriority)(e.target.value)}>
              <option value="">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
              value={filterCategory} onChange={e => handleFilterChange(setFilterCategory)(e.target.value)}>
              <option value="">All categories</option>
              {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button onClick={load} className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCwIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
              <PlusIcon className="w-4 h-4" /> New Ticket
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <WrenchIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No tickets found.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create one when something needs fixing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  {['Ticket', 'Room', 'Category', 'Priority', 'Status', 'Assigned To', 'Created'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tickets.map(t => (
                  <tr key={t._id}
                    onClick={() => setSelected(t)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-gray-400">{t.ticketNumber}</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5 max-w-[200px] truncate">{t.title}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {t.roomId ? `Room ${t.roomId.roomNumber}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{CATEGORY_LABEL[t.category]}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PRIORITY_BADGE[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[t.status]}`}>
                        {STATUS_LABEL[t.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {t.assignedTo ? `${t.assignedTo.fname} ${t.assignedTo.lname}` : <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString('en-MY', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 pb-4">
          <Pagination page={page} pages={pages} total={total} limit={20}
            onPageChange={setPage} onLimitChange={() => {}} />
        </div>
      </div>

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={load} staff={staff} rooms={rooms} />
      )}
      {selected && (
        <DetailModal ticket={selected} onClose={() => setSelected(null)} onUpdated={load} staff={staff} isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default MaintenancePage;
