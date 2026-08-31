import { EmptyTableRow } from '../common/EmptyState';
import { confirm as confirmDialog } from '../../lib/confirm';
import { SkeletonTableRows } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toastSuccess, toastError } from '../../lib/toast';
import { SearchIcon, PlusIcon, TrashIcon, PencilIcon, ClockIcon, XIcon, AlertTriangleIcon, UploadIcon, FileIcon, Trash2Icon } from 'lucide-react';
import { guestApi, Guest, GuestDocument, Reservation, RoomDetail, reservationStatus, reservationTotal } from '../../services/api';
import Pagination from '../common/Pagination';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'identification', 'nationality', 'dateOfBirth', 'address'] as const;
type Field = typeof FIELDS[number];

const EMPTY: Omit<Guest, '_id' | 'customerId' | 'notes' | 'documents'> = {
  firstName: '', lastName: '', email: '', phone: '', identification: '', dateOfBirth: '', nationality: '', address: '',
};

const STATUS_COLORS: Record<string, string> = {
  'Confirmed':   'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Checked In':  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Checked Out': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Cancelled':   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const GuestManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [form, setForm] = useState<typeof EMPTY & { notes: string }>({ ...EMPTY, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [duplicates, setDuplicates] = useState<Guest[]>([]);
  const dupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [historyGuest, setHistoryGuest] = useState<Guest | null>(null);
  const [history, setHistory] = useState<Reservation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [docGuest, setDocGuest] = useState<Guest | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const anyModalOpen = !!(showModal || docGuest || historyGuest);
  const closeTopModal = useCallback(() => {
    if (showModal) setShowModal(false);
    else if (docGuest) setDocGuest(null);
    else if (historyGuest) setHistoryGuest(null);
  }, [showModal, docGuest, historyGuest]);
  useEscapeKey(anyModalOpen, closeTopModal);

  const load = (p: number, l: number, search: string) => {
    setLoading(true);
    guestApi.getAll(p, l, search)
      .then(({ guests, total, pages }) => {
        setGuests(guests);
        setTotal(total);
        setPages(pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page, limit, searchQuery); }, [page, limit]);

  // Debounce search so typing doesn't fire a request per keystroke
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setPage(1);
      load(1, limit, value);
    }, 350);
  };

  const paged = guests; // server already returns the correct page slice

  const checkForDuplicates = (f: typeof form) => {
    if (editing) return;
    if (dupTimerRef.current) clearTimeout(dupTimerRef.current);
    dupTimerRef.current = setTimeout(async () => {
      if ((f.firstName && f.lastName) || f.identification) {
        const { duplicates } = await guestApi.checkDuplicates(f.firstName, f.lastName, f.identification).catch(() => ({ duplicates: [] }));
        setDuplicates(duplicates);
      } else {
        setDuplicates([]);
      }
    }, 500);
  };

  const setField = (field: string, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (['firstName', 'lastName', 'identification'].includes(field)) {
      checkForDuplicates(next);
    }
  };

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, notes: '' }); setError(''); setDuplicates([]); setShowModal(true); };
  const openEdit = (g: Guest) => {
    setEditing(g);
    setForm({ firstName: g.firstName, lastName: g.lastName, email: g.email, phone: g.phone, identification: g.identification, dateOfBirth: g.dateOfBirth?.slice(0, 10) ?? '', nationality: g.nationality, address: g.address, notes: g.notes ?? '' });
    setError('');
    setDuplicates([]);
    setShowModal(true);
  };

  const openHistory = (g: Guest) => {
    setHistoryGuest(g);
    setHistory([]);
    setHistoryLoading(true);
    guestApi.getReservations(g._id)
      .then(({ reservations }) => setHistory(reservations))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  };

  const openDocs = (g: Guest) => {
    setDocGuest(g);
    setUploadError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await guestApi.update(editing._id, form);
        toastSuccess('Guest updated');
      } else {
        await guestApi.create(form);
        toastSuccess('Guest added');
      }
      setShowModal(false);
      load(page, limit, searchQuery);
    } catch (err: any) {
      setError(err.message);
      toastError(err.message ?? 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog('Delete this guest? This cannot be undone.'))) return;
    await guestApi.delete(id).catch(() => {});
    toastSuccess('Guest deleted');
    load(page, limit, searchQuery);
  };

  const handleUpload = async (file: File) => {
    if (!docGuest) return;
    setUploading(true);
    setUploadError('');
    try {
      const { guest } = await guestApi.uploadDocument(docGuest._id, file);
      setDocGuest(guest);
      setGuests(gs => gs.map(g => g._id === guest._id ? guest : g));
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!docGuest) return;
    await guestApi.deleteDocument(docGuest._id, docId).catch(() => {});
    const updated = { ...docGuest, documents: (docGuest.documents ?? []).filter(d => d._id !== docId) };
    setDocGuest(updated);
    setGuests(gs => gs.map(g => g._id === updated._id ? updated : g));
  };

  const fieldLabel = (f: Field) => f.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Guest Management</h2>
          <button onClick={openAdd} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />Add Guest
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm" placeholder="Search by name, email, or ID…" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full"><tbody><SkeletonTableRows rows={6} cols={5} /></tbody></table>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    {['Guest', 'Customer ID', 'Contact', 'Nationality', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paged.length === 0 ? (
                    <EmptyTableRow colSpan={5} message="No guests found." sub="Try a different search term." />
                  ) : paged.map(g => (
                    <tr key={g._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-200">
                            {g.firstName[0]}{g.lastName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{g.firstName} {g.lastName}</div>
                            <div className="text-xs text-gray-500">{g.email}</div>
                            {g.notes && <div className="text-xs text-gray-400 italic truncate max-w-[160px]">{g.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{g.customerId}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{g.phone}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{g.nationality}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openHistory(g)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Reservation history"><ClockIcon className="w-4 h-4" /></button>
                          <button onClick={() => openDocs(g)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Documents">
                            <FileIcon className="w-4 h-4" />
                            {(g.documents?.length ?? 0) > 0 && <span className="sr-only">{g.documents!.length}</span>}
                          </button>
                          <button onClick={() => openEdit(g)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(g._id)} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </div>
      </div>

      {/* Guest history modal */}
      {historyGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{historyGuest.firstName} {historyGuest.lastName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{historyGuest.customerId} · {historyGuest.email}</p>
              </div>
              <button onClick={() => setHistoryGuest(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex-1">
              {historyLoading ? (
                <p className="text-center text-sm text-gray-500 py-8">Loading…</p>
              ) : history.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">No reservations found for this guest.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                    <tr>
                      {['Reservation', 'Room Type', 'Arrival', 'Departure', 'Nights', 'Total', 'Status'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {history.map(r => {
                      const status = reservationStatus(r);
                      const total = reservationTotal(r);
                      const rtName = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '—';
                      return (
                        <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">{r.reservationId}</td>
                          <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{rtName}</td>
                          <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{r.arrivalDate.slice(0, 10)}</td>
                          <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{r.departureDate.slice(0, 10)}</td>
                          <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{r.daysOfStay}</td>
                          <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{total > 0 ? `$${total.toLocaleString()}` : '—'}</td>
                          <td className="px-3 py-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[status] ?? ''}`}>{status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{history.length} reservation{history.length !== 1 ? 's' : ''}</span>
              <button onClick={() => setHistoryGuest(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Documents modal */}
      {docGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Documents</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{docGuest.firstName} {docGuest.lastName} · {docGuest.customerId}</p>
              </div>
              <button onClick={() => setDocGuest(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon className="w-5 h-5" /></button>
            </div>

            {uploadError && <p className="mb-3 text-sm text-red-500">{uploadError}</p>}

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
              {(docGuest.documents ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No documents uploaded yet.</p>
              ) : (docGuest.documents ?? []).map((doc: GuestDocument) => (
                <div key={doc._id} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`/uploads/${doc.filename}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                      {doc.originalName}
                    </a>
                  </div>
                  <button onClick={() => handleDeleteDoc(doc._id)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                    <Trash2Icon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-60"
            >
              <UploadIcon className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload ID / Passport (jpg, png, pdf · max 5 MB)'}
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit guest modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{editing ? 'Edit Guest' : 'Add New Guest'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto scrollbar-hide flex-1 px-6 py-4">
              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

              {duplicates.length > 0 && !editing && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangleIcon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Possible duplicate{duplicates.length > 1 ? 's' : ''} found</p>
                      {duplicates.map(d => (
                        <p key={d._id} className="text-xs text-amber-700 dark:text-amber-400">{d.firstName} {d.lastName} · {d.customerId} · {d.identification}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <form id="guest-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FIELDS.map(f => (
                    <div key={f}>
                      <label className={labelCls}>{fieldLabel(f)}</label>
                      <input
                        type={f === 'dateOfBirth' ? 'date' : f === 'email' ? 'email' : 'text'}
                        className={inputCls}
                        value={(form as any)[f]}
                        onChange={e => setField(f, e.target.value)}
                        required={['firstName', 'lastName', 'email'].includes(f)}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelCls}>Notes / Preferences</label>
                  <textarea
                    className={inputCls}
                    rows={3}
                    placeholder="e.g. Prefers high floor, vegetarian meals, anniversary on June 5…"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </form>
            </div>

            {/* Sticky footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
              <button type="submit" form="guest-form" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                {submitting ? 'Saving…' : editing ? 'Update Guest' : 'Add Guest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestManagement;
