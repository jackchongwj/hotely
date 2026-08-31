import React, { useState, useEffect } from 'react';
import { hotelSettingsApi, HotelSettings as HotelSettingsType } from '../../services/api';
import { CheckCircleIcon } from 'lucide-react';
import { toastSuccess, toastError } from '../../lib/toast';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'MYR', symbol: 'RM', label: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'THB', symbol: '฿', label: 'Thai Baht' },
];

const DEFAULTS: HotelSettingsType = {
  name: '', address: '', phone: '', email: '', website: '',
  checkInTime: '14:00', checkOutTime: '11:00',
  taxRate: 0, currency: 'USD', currencySymbol: '$',
  bankName: 'Maybank', bankAccountName: 'Jack Chong Wei Jie', bankAccountNumber: '112754096256',
};

const HotelSettings = () => {
  const [form, setForm] = useState<HotelSettingsType>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    hotelSettingsApi.get()
      .then(({ settings }) => setForm({ ...DEFAULTS, ...settings }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (field: keyof HotelSettingsType, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleCurrencyChange = (code: string) => {
    const c = CURRENCIES.find(c => c.code === code);
    if (c) setForm(f => ({ ...f, currency: c.code, currencySymbol: c.symbol }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await hotelSettingsApi.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toastSuccess('Settings saved');
    } catch (err: any) {
      setError(err.message);
      toastError(err.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-sm text-gray-500">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Hotel Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Hotel Profile</h3>
          <div>
            <label className={labelCls}>Hotel Name</label>
            <input type="text" className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <textarea className={inputCls} rows={2} value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone</label>
              <input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input type="url" className={inputCls} placeholder="https://…" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
        </div>

        {/* Check-In / Check-Out Times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Default Times</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Check-In Time</label>
              <input type="time" className={inputCls} value={form.checkInTime} onChange={e => set('checkInTime', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Check-Out Time</label>
              <input type="time" className={inputCls} value={form.checkOutTime} onChange={e => set('checkOutTime', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Tax & Currency */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Tax & Currency</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Currency</label>
              <select className={inputCls} value={form.currency} onChange={e => handleCurrencyChange(e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.label} ({c.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tax Rate (%)</label>
              <input type="number" min={0} max={100} step={0.01} className={inputCls}
                value={form.taxRate}
                onChange={e => set('taxRate', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          {form.taxRate > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A {form.taxRate}% tax will be applied to displayed totals ({form.currencySymbol}100 → {form.currencySymbol}{(100 * (1 + form.taxRate / 100)).toFixed(2)}).
            </p>
          )}
        </div>

        {/* Bank Transfer Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Bank Transfer Details</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Displayed on invoices when balance is outstanding. Guests pay directly to this account.</p>
          <div>
            <label className={labelCls}>Bank Name</label>
            <input type="text" className={inputCls} value={form.bankName ?? ''} onChange={e => set('bankName', e.target.value)} placeholder="e.g. Maybank" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Account Name</label>
              <input type="text" className={inputCls} value={form.bankAccountName ?? ''} onChange={e => set('bankAccountName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Account Number</label>
              <input type="text" className={inputCls} value={form.bankAccountNumber ?? ''} onChange={e => set('bankAccountNumber', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Email (SMTP info) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-2">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Email Confirmations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            To enable guest email confirmations, set the following environment variables on your server:
          </p>
          <code className="block bg-gray-50 dark:bg-gray-900 rounded p-3 text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
            SMTP_HOST=smtp.gmail.com<br />
            SMTP_PORT=587<br />
            SMTP_USER=your@email.com<br />
            SMTP_PASS=your-app-password<br />
            SMTP_FROM="Hotel Name &lt;noreply@hotel.com&gt;"
          </code>
          <p className="text-xs text-gray-400">Confirmation emails will be sent automatically on booking, check-in, and check-out.</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircleIcon className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Data Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">Data Export / Backup</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Download all data as CSV files for backup or analysis.</p>
        <div className="flex flex-wrap gap-3">
          <a href="/api/export/reservations" download className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Reservations
          </a>
          <a href="/api/export/guests" download className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Guests
          </a>
          <a href="/api/export/housekeeping" download className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Housekeeping
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotelSettings;
