import EmptyState from '../common/EmptyState';
import { confirm as confirmDialog } from '../../lib/confirm';
import { SkeletonCards } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { PlusIcon, PinIcon, TrashIcon, PencilIcon, XIcon } from 'lucide-react';
import { announcementApi, Announcement } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

const timeAgo = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const Announcements = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', content: '', pinned: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    announcementApi.getAll()
      .then(({ announcements }) => setAnnouncements(announcements))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', content: '', pinned: false }); setError(''); setShowModal(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setForm({ title: a.title, content: a.content, pinned: a.pinned }); setError(''); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        const { announcement } = await announcementApi.update(editing._id, form);
        setAnnouncements(as => as.map(a => a._id === announcement._id ? announcement : a));
      } else {
        const { announcement } = await announcementApi.create(form);
        setAnnouncements(as => [announcement, ...as]);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog('Delete this announcement?'))) return;
    await announcementApi.delete(id).catch(() => {});
    setAnnouncements(as => as.filter(a => a._id !== id));
  };

  const togglePin = async (a: Announcement) => {
    const { announcement } = await announcementApi.update(a._id, { pinned: !a.pinned }).catch(() => ({ announcement: a }));
    setAnnouncements(as => as.map(x => x._id === announcement._id ? announcement : x).sort((x, y) => (y.pinned ? 1 : 0) - (x.pinned ? 1 : 0)));
  };

  const pinned = announcements.filter(a => a.pinned);
  const regular = announcements.filter(a => !a.pinned);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Announcements</h2>
          <button onClick={openAdd} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />Post
          </button>
        </div>

        {loading ? (
          <SkeletonCards n={4} />
        ) : announcements.length === 0 ? (
          <EmptyState message="No announcements yet." sub="Post one to keep the team informed." />
        ) : (
          <div className="p-6 space-y-4">
            {pinned.length > 0 && (
              <div className="space-y-3">
                {pinned.map(a => <AnnouncementCard key={a._id} a={a} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} onTogglePin={togglePin} />)}
              </div>
            )}
            {regular.length > 0 && (
              <div className="space-y-3">
                {pinned.length > 0 && <div className="border-t dark:border-gray-700 pt-3" />}
                {regular.map(a => <AnnouncementCard key={a._id} a={a} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} onTogglePin={togglePin} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">{editing ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon className="w-5 h-5" /></button>
            </div>
            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea className={inputCls} rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pin to top</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving…' : editing ? 'Update' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AnnouncementCard = ({ a, isAdmin, onEdit, onDelete, onTogglePin }: {
  a: Announcement; isAdmin: boolean;
  onEdit: (a: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePin: (a: Announcement) => void;
}) => (
  <div className={`rounded-lg border p-4 ${a.pinned ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {a.pinned && <PinIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">{a.title}</h3>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onTogglePin(a)} title={a.pinned ? 'Unpin' : 'Pin'} className={`p-1 rounded ${a.pinned ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 hover:text-amber-500'}`}>
          <PinIcon className="w-3.5 h-3.5" />
        </button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(a)} className="p-1 text-gray-400 hover:text-blue-500"><PencilIcon className="w-3.5 h-3.5" /></button>
            <button onClick={() => onDelete(a._id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-3.5 h-3.5" /></button>
          </>
        )}
      </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{a.content}</p>
    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
      {a.authorId && <span>{a.authorId.fname} {a.authorId.lname}</span>}
      <span>·</span>
      <span>{timeAgo(a.createdAt)}</span>
    </div>
  </div>
);

export default Announcements;
