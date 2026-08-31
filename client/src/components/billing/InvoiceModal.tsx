import React, { useState, useEffect } from 'react';
import { XIcon, DownloadIcon, SendIcon, BanIcon, PlusIcon, CheckCircleIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { invoiceApi, Invoice, InvoiceStatus, PaymentMethod, Guest, Reservation } from '../../services/api';
import { toastSuccess, toastError } from '../../lib/toast';
import useEscapeKey from '../../hooks/useEscapeKey';
import { useAuth } from '../../context/AuthContext';

const METHODS: { value: PaymentMethod; label: string; refLabel: string }[] = [
  { value: 'cash',          label: 'Cash',                 refLabel: 'Notes (optional)' },
  { value: 'card',          label: 'Debit / Credit Card',  refLabel: 'Last 4 digits' },
  { value: 'ewallet',       label: 'E-Wallet',             refLabel: 'Transaction ID' },
  { value: 'bank_transfer', label: 'Bank Transfer',        refLabel: 'Transaction reference' },
  { value: 'other',         label: 'Other',                refLabel: 'Reference' },
];

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; cls: string }> = {
  draft:   { label: 'Draft',   cls: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  sent:    { label: 'Sent',    cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  partial: { label: 'Partial', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  paid:    { label: 'Paid',    cls: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  void:    { label: 'Void',    cls: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
};

const fmt = (n: number, sym = 'RM') =>
  `${sym}${Number(n).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

interface Props {
  reservationId: string;
  onClose: () => void;
}

const InvoiceModal = ({ reservationId, onClose }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending,   setSending]   = useState(false);
  const [voiding,   setVoiding]   = useState(false);

  // Payment form
  const [showPayForm, setShowPayForm] = useState(false);
  const [payMethod,   setPayMethod]   = useState<PaymentMethod>('cash');
  const [payAmount,   setPayAmount]   = useState('');
  const [payRef,      setPayRef]      = useState('');
  const [paying,      setPaying]      = useState(false);

  useEscapeKey(true, onClose);

  useEffect(() => {
    invoiceApi.getOrCreate(reservationId)
      .then(({ invoice }) => setInvoice(invoice))
      .catch(() => toastError('Failed to load invoice'))
      .finally(() => setLoading(false));
  }, [reservationId]);

  // Pre-fill payment amount with current balance
  useEffect(() => {
    if (invoice && showPayForm) setPayAmount(invoice.balance.toFixed(2));
  }, [invoice, showPayForm]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;
    setPaying(true);
    try {
      const { invoice: updated } = await invoiceApi.recordPayment(invoice._id, {
        method: payMethod, amount: amt, reference: payRef,
      });
      setInvoice(updated);
      setShowPayForm(false);
      setPayRef('');
      toastSuccess(updated.status === 'paid' ? 'Invoice fully paid!' : `Payment of ${fmt(amt)} recorded`);
    } catch (err: any) {
      toastError(err.message ?? 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const handleSend = async () => {
    if (!invoice) return;
    setSending(true);
    try {
      const { invoice: updated } = await invoiceApi.send(invoice._id);
      setInvoice(updated);
      toastSuccess('Invoice sent to guest');
    } catch (err: any) {
      toastError(err.message ?? 'Send failed');
    } finally {
      setSending(false);
    }
  };

  const handleVoid = async () => {
    if (!invoice) return;
    setVoiding(true);
    try {
      const { invoice: updated } = await invoiceApi.void(invoice._id);
      setInvoice(updated);
      toastSuccess('Invoice voided');
    } catch (err: any) {
      toastError(err.message ?? 'Void failed');
    } finally {
      setVoiding(false);
    }
  };

  const guest = invoice ? (typeof invoice.guestId === 'object' && invoice.guestId ? invoice.guestId as Guest : null) : null;
  const refMethod = METHODS.find(m => m.value === payMethod);
  const canPayMore = invoice && invoice.status !== 'paid' && invoice.status !== 'void';
  const canVoid    = invoice && isAdmin && invoice.status !== 'paid' && invoice.status !== 'void';
  const statusCfg  = invoice ? STATUS_CONFIG[invoice.status] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              {invoice ? invoice.invoiceNumber : 'Invoice'}
            </h3>
            {statusCfg && (
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-16 text-sm text-gray-400">Loading invoice…</div>
        ) : !invoice ? (
          <div className="flex-1 flex items-center justify-center py-16 text-sm text-red-500">Failed to load invoice</div>
        ) : (
          <>
            <div className="overflow-y-auto scrollbar-hide flex-1 px-6 py-4 space-y-5">

              {/* Guest + dates */}
              <div className="flex items-start justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {guest ? `${guest.firstName} ${guest.lastName}` : '—'}
                  </p>
                  {guest?.email && <p className="text-xs text-gray-500 dark:text-gray-400">{guest.email}</p>}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p>Issued: {new Date(invoice.createdAt).toLocaleDateString('en-MY')}</p>
                  {invoice.dueDate && <p>Due: {new Date(invoice.dueDate).toLocaleDateString('en-MY')}</p>}
                </div>
              </div>

              {/* Line items */}
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                      <th className="text-left pb-2 font-medium">Description</th>
                      <th className="text-right pb-2 font-medium w-12">Qty</th>
                      <th className="text-right pb-2 font-medium w-24">Unit</th>
                      <th className="text-right pb-2 font-medium w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {invoice.lineItems.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 text-gray-700 dark:text-gray-300">{item.description}</td>
                        <td className="py-2 text-right text-gray-600 dark:text-gray-400">{item.quantity}</td>
                        <td className="py-2 text-right text-gray-600 dark:text-gray-400">{fmt(item.unitPrice)}</td>
                        <td className="py-2 text-right font-medium text-gray-800 dark:text-gray-200">{fmt(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-1 border-t dark:border-gray-700 pt-3">
                {[
                  ['Subtotal', fmt(invoice.subtotal)],
                  ...(invoice.taxRate > 0 ? [[`Tax (${invoice.taxRate}%)`, fmt(invoice.taxAmount)]] : []),
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-white border-t dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span><span>{fmt(invoice.total)}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Amount Paid</span><span>({fmt(invoice.amountPaid)})</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t dark:border-gray-700 pt-2 mt-1 text-gray-800 dark:text-white">
                      <span>Balance Due</span>
                      <span className={invoice.balance <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {fmt(invoice.balance)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment history */}
              {invoice.payments.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment History</p>
                  <div className="space-y-2">
                    {invoice.payments.map(p => (
                      <div key={p._id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {METHODS.find(m => m.value === p.method)?.label ?? p.method}
                            </span>
                            {p.reference && <span className="ml-1.5 text-xs text-gray-400">· {p.reference}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{fmt(p.amount)}</p>
                          <p className="text-xs text-gray-400">{new Date(p.paidAt).toLocaleDateString('en-MY')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Record payment form */}
              {canPayMore && showPayForm && (
                <form onSubmit={handlePayment} className="border dark:border-gray-700 rounded-lg p-4 space-y-3 bg-blue-50/40 dark:bg-blue-900/10">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Record Payment</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Method</label>
                      <select
                        className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm"
                        value={payMethod}
                        onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                      >
                        {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (RM)</label>
                      <input
                        type="number" min="0.01" step="0.01" max={invoice.balance}
                        className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm"
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{refMethod?.refLabel}</label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm"
                        value={payRef}
                        onChange={e => setPayRef(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setShowPayForm(false)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300">
                      Cancel
                    </button>
                    <button type="submit" disabled={paying}
                      className="flex-1 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-60">
                      {paying ? 'Recording…' : `Record ${fmt(parseFloat(payAmount) || 0)}`}
                    </button>
                  </div>
                </form>
              )}

              {/* Paid confirmation */}
              {invoice.status === 'paid' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Invoice fully paid</p>
                </div>
              )}

              {/* Void warning */}
              {invoice.status === 'void' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangleIcon className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">This invoice has been voided</p>
                </div>
              )}

            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700 shrink-0 flex-wrap gap-2">
              <div className="flex gap-2">
                {canPayMore && !showPayForm && (
                  <button onClick={() => setShowPayForm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    <PlusIcon className="w-4 h-4" />Record Payment
                  </button>
                )}
                {canVoid && (
                  <button onClick={handleVoid} disabled={voiding}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60">
                    <BanIcon className="w-4 h-4" />{voiding ? 'Voiding…' : 'Void'}
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {guest?.email && (
                  <button onClick={handleSend} disabled={sending}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60">
                    <SendIcon className="w-4 h-4" />{sending ? 'Sending…' : invoice.sentAt ? 'Resend' : 'Send'}
                  </button>
                )}
                <a
                  href={invoiceApi.pdfUrl(invoice._id)}
                  download={`${invoice.invoiceNumber}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <DownloadIcon className="w-4 h-4" />PDF
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
