import { confirm as confirmDialog } from '../../lib/confirm';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { roomDetailApi, RoomDetail } from '../../services/api';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const EMPTY = { name: '', description: '', price: 0 };

const RoomTypes = () => {
  const [types, setTypes] = useState<RoomDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [editing, setEditing] = useState<RoomDetail | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    roomDetailApi.getAll()
      .then(({ roomDetails }) => setTypes(roomDetails))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (t: RoomDetail) => {
    setEditing(t);
    setForm({ name: t.name, description: t.description ?? '', price: t.price });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await roomDetailApi.update(editing._id, form);
      } else {
        await roomDetailApi.create(form);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog('Delete this room type? Rooms using it will be unaffected but the type will no longer appear in booking forms.'))) return;
    await roomDetailApi.delete(id).catch(() => {});
    load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Room Types</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage room categories and nightly rates</p>
          </div>
          <button onClick={openAdd} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />Add Type
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading…</p>
          ) : types.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No room types yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map(t => (
                <div key={t._id} className="border dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">{t.name}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t._id)} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {t.description && <p className="text-sm text-gray-500 dark:text-gray-400">{t.description}</p>}
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-auto">${t.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/night</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{editing ? 'Edit Room Type' : 'Add Room Type'}</h3>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Nightly Rate ($)</label>
                <input type="number" min="0" step="1" className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving…' : editing ? 'Update' : 'Add Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
