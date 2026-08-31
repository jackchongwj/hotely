import { EmptyTableRow } from '../common/EmptyState';
import { SkeletonTableRows } from '../common/Skeleton';
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, FilterIcon, DollarSignIcon, CreditCardIcon, TrendingUpIcon, FileTextIcon } from 'lucide-react';
import { reservationApi, reservationStatus, reservationTotal, Reservation, Guest, RoomDetail } from '../../services/api';
import Pagination from '../common/Pagination';
import FolioModal from './FolioModal';
import InvoiceModal from './InvoiceModal';

const BillingSystem = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [summary, setSummary] = useState({ todayRevenue: 0, pending: 0, totalRevenue: 0 });
  const [folioReservation,   setFolioReservation]   = useState<Reservation | null>(null);
  const [invoiceReservation, setInvoiceReservation] = useState<Reservation | null>(null);

  const load = (p: number, l: number, search: string, status: string) => {
    setLoading(true);
    reservationApi.getAll(p, l, search, status)
      .then(({ reservations, total, pages }) => {
        setReservations(reservations);
        setTotal(total);
        setPages(pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page, limit, searchQuery, statusFilter); }, [page, limit, statusFilter]);

  useEffect(() => {
    reservationApi.getAll(1, 1000)
      .then(({ reservations: all }) => {
        const today = new Date().toISOString().slice(0, 10);
        const checkedOut = all.filter(r => r.checkedOut);
        setSummary({
          todayRevenue: checkedOut.filter(r => r.departureDate.slice(0, 10) === today).reduce((s, r) => s + reservationTotal(r), 0),
          pending:      all.filter(r => !r.checkedIn && !r.cancelled).reduce((s, r) => s + reservationTotal(r), 0),
          totalRevenue: checkedOut.reduce((s, r) => s + reservationTotal(r), 0),
        });
      }).catch(() => {});
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => { setPage(1); load(1, limit, value, statusFilter); }, 350);
  };

  const handleStatus = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const guestName = (r: Reservation) => {
    const g = typeof r.customerId === 'object' ? r.customerId as Guest : null;
    return g ? `${g.firstName} ${g.lastName}` : '—';
  };

  const statusBadge = (status: string) => {
    const base = 'px-2 py-0.5 text-xs font-medium rounded-full';
    switch (status) {
      case 'Checked Out': return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Checked Out</span>;
      case 'Checked In':  return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>Checked In</span>;
      case 'Cancelled':   return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>Cancelled</span>;
      default:            return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>Confirmed</span>;
    }
  };

  const thCls = 'px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider';

  return (
    <>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Today's Revenue",      value: `$${summary.todayRevenue.toLocaleString()}`,  icon: <DollarSignIcon className="h-6 w-6 text-green-600 dark:text-green-400" />,  bg: 'bg-green-50 dark:bg-green-900/20',   iconBg: 'bg-green-100 dark:bg-green-800' },
          { label: 'Pending (Estimated)',  value: `$${summary.pending.toLocaleString()}`,        icon: <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />,    bg: 'bg-blue-50 dark:bg-blue-900/20',     iconBg: 'bg-blue-100 dark:bg-blue-800' },
          { label: 'Total Revenue (All Time)', value: `$${summary.totalRevenue.toLocaleString()}`, icon: <TrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />, bg: 'bg-purple-50 dark:bg-purple-900/20', iconBg: 'bg-purple-100 dark:bg-purple-800' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} p-4 rounded-lg`}>
            <div className="flex items-center gap-4">
              <div className={`${c.iconBg} p-3 rounded-full`}>{c.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{c.label}</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Billing & Invoices</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{total} records</span>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm"
                placeholder="Search by reservation ID…"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 pr-3 text-sm"
                value={statusFilter}
                onChange={e => handleStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <table className="min-w-full"><tbody><SkeletonTableRows rows={6} cols={9} /></tbody></table>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead><tr>
                  {['Reservation ID', 'Guest', 'Room Type', 'Check-In', 'Check-Out', 'Nights', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className={thCls}>{h}</th>
                  ))}
                </tr></thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reservations.length === 0 ? (
                    <EmptyTableRow colSpan={9} message="No billing records found." sub="Try a different status filter." />
                  ) : reservations.map(r => {
                    const amt = reservationTotal(r);
                    const rtName = typeof r.roomType === 'object' ? (r.roomType as RoomDetail).name : '—';
                    return (
                      <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.reservationId}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{guestName(r)}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{rtName}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{r.arrivalDate.slice(0, 10)}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{r.departureDate.slice(0, 10)}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{r.daysOfStay}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{amt > 0 ? `$${amt.toLocaleString()}` : '—'}</td>
                        <td className="px-4 py-4">{statusBadge(reservationStatus(r))}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {(r.checkedIn || r.checkedOut) && (
                              <button
                                onClick={() => setInvoiceReservation(r)}
                                title="View / manage invoice"
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <FileTextIcon className="w-3.5 h-3.5" />Invoice
                              </button>
                            )}
                            {r.checkedIn && !r.checkedOut && (
                              <button onClick={() => setFolioReservation(r)} title="Add charges"
                                className="p-1 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300">
                                <FileTextIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
    </div>

    {folioReservation && (
      <FolioModal reservation={folioReservation} onClose={() => setFolioReservation(null)} />
    )}
    {invoiceReservation && (
      <InvoiceModal reservationId={invoiceReservation._id} onClose={() => setInvoiceReservation(null)} />
    )}
    </>
  );
};

export default BillingSystem;
