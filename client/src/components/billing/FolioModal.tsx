import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, TrashIcon, ReceiptIcon } from 'lucide-react';
import { folioApi, FolioCharge, Reservation, Guest, RoomDetail } from '../../services/api';
import { toastSuccess, toastError } from '../../lib/toast';
import useEscapeKey from '../../hooks/useEscapeKey';

const CATEGORIES = ['Room Service', 'Minibar', 'Laundry', 'Parking', 'Phone', 'Spa', 'Other'];

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

interface Props {
  reservation: Reservation;
  onClose: () => void;
}

const FolioModal = ({ reservation, onClose }: Props) => {
  const [charges, setCharges] = useState<FolioCharge[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Other' });
  const [submitting, setSubmitting] = useState(false);

  const guest = typeof reservation.customerId === 'object' ? reservation.customerId as Guest : null;
  const roomType = typeof reservation.roomType === 'object' ? reservation.roomType as RoomDetail : null;

  useEscapeKey(true, onClose);

  useEffect(() => {
    folioApi.getAll(reservation._id)
      .then(({ charges, total }) => { setCharges(charges); setTotal(total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reservation._id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.description || isNaN(amt) || amt <= 0) return;
    setSubmitting(true);
    try {
      const { charge } = await folioApi.add({
        reservationId: reservation._id,
        description: form.description,
        amount: amt,
        category: form.category,
      });
      setCharges(cs => [...cs, charge]);
      setTotal(t => +(t + amt).toFixed(2));
      setForm({ description: '', amount: '', category: 'Other' });
      toastSuccess('Charge added');
    } catch (err: any) {
      toastError(err.message ?? 'Failed to add charge');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, amount: number) => {
    await folioApi.delete(id).catch(() => {});
    setCharges(cs => cs.filter(c => c._id !== id));
    setTotal(t => +(t - amount).toFixed(2));
  };

  const roomCharges = (roomType?.price ?? 0) * reservation.daysOfStay;
  const grandTotal = roomCharges + total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
              <ReceiptIcon className="w-5 h-5 text-blue-500" />
              Folio — {reservation.reservationId}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {guest?.firstName} {guest?.lastName} · {reservation.daysOfStay} night{reservation.daysOfStay !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide flex-1 px-6 py-4 space-y-4">
          {/* Room charge summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Room × {reservation.daysOfStay}n @ ${roomType?.price ?? 0}</span>
              <span className="font-medium">${roomCharges.toLocaleString()}</span>
            </div>
          </div>

          {/* Folio charges */}
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
          ) : charges.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No additional charges yet.</p>
          ) : (
            <div className="space-y-2">
              {charges.map(c => (
                <div key={c._id} className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{c.description}</p>
                    <p className="text-xs text-gray-400">{c.category} · {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 shrink-0">${c.amount.toFixed(2)}</span>
                  <button onClick={() => handleDelete(c._id, c.amount)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="border-t dark:border-gray-700 pt-3 flex justify-between text-sm font-semibold text-gray-800 dark:text-white">
            <span>Grand Total</span>
            <span>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          {/* Add charge form */}
          {!reservation.checkedOut && !reservation.cancelled && (
            <form onSubmit={handleAdd} className="border-t dark:border-gray-700 pt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Add Charge</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <input className={inputCls} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <input type="number" min="0.01" step="0.01" className={inputCls} placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                <PlusIcon className="w-4 h-4" />{submitting ? 'Adding…' : 'Add Charge'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolioModal;
