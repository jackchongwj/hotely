import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUpIcon, BarChart2Icon, CalendarDaysIcon, UsersIcon,
  DownloadIcon, BedDoubleIcon, RefreshCwIcon, ZapIcon,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { analyticsApi, dashboardApi } from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = '30d' | '90d';
type Tab = 'overview' | 'revenue' | 'occupancy' | 'bookings';

interface KPIs {
  totalRevenue: number; totalBookings: number; totalNights: number;
  revPAR: number; adr: number; avgStay: number;
  occupancyRate: number; occupiedRooms: number; totalRooms: number;
  currencySymbol: string;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (sym: string, n: number) =>
  `${sym}${n >= 1000 ? n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : n.toFixed(2)}`;

const shortMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const KPICard = ({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; accent: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${accent} shrink-0`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const SectionCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-12 text-sm text-gray-400">Loading…</div>
);

const PeriodToggle = ({ value, onChange }: { value: Period; onChange: (p: Period) => void }) => (
  <div className="flex gap-1">
    {(['30d', '90d'] as Period[]).map(p => (
      <button key={p} onClick={() => onChange(p)}
        className={`px-3 py-1 text-xs rounded-md border transition-colors ${value === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
        {p}
      </button>
    ))}
  </div>
);

// ─── Tab: Overview ────────────────────────────────────────────────────────────

const OverviewTab = ({ kpis, period }: { kpis: KPIs | null; period: Period }) => {
  const sym = kpis?.currencySymbol ?? 'RM';
  const [trend, setTrend] = useState<{ date: string; revenue: number; bookings: number }[]>([]);
  const [occ,   setOcc]   = useState<{ date: string; rate: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getRevenueTrend(period),
      analyticsApi.getOccupancyTrend(period),
    ]).then(([r, o]) => {
      setTrend(r.trend);
      setOcc(o.trend);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  if (!kpis) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Revenue" value={fmt(sym, kpis.totalRevenue)}
          sub={`${period} period`} accent="bg-green-100 dark:bg-green-900/30"
          icon={<TrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />} />
        <KPICard label="Occupancy" value={`${kpis.occupancyRate}%`}
          sub={`${kpis.occupiedRooms} / ${kpis.totalRooms} rooms`} accent="bg-blue-100 dark:bg-blue-900/30"
          icon={<BedDoubleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />} />
        <KPICard label="RevPAR" value={fmt(sym, kpis.revPAR)}
          sub="Revenue per available room" accent="bg-purple-100 dark:bg-purple-900/30"
          icon={<ZapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />} />
        <KPICard label="ADR" value={fmt(sym, kpis.adr)}
          sub="Avg daily rate per sold room" accent="bg-amber-100 dark:bg-amber-900/30"
          icon={<BarChart2Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Revenue">
          {loading ? <Spinner /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} interval={Math.floor(trend.length / 6)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [fmt(sym, v), 'Revenue']} labelFormatter={l => `Date: ${l}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Occupancy Rate">
          {loading ? <Spinner /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={occ} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} interval={Math.floor(occ.length / 6)} />
                <YAxis unit="%" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: kpis.totalBookings.toLocaleString() },
          { label: 'Total Room Nights', value: kpis.totalNights.toLocaleString() },
          { label: 'Avg Length of Stay', value: `${kpis.avgStay} nights` },
          { label: 'Total Rooms', value: kpis.totalRooms.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tab: Revenue ─────────────────────────────────────────────────────────────

const RevenueTab = ({ kpis, period }: { kpis: KPIs | null; period: Period }) => {
  const sym = kpis?.currencySymbol ?? 'RM';
  const [trend,    setTrend]    = useState<{ date: string; revenue: number; bookings: number }[]>([]);
  const [byType,   setByType]   = useState<{ name: string; revenue: number; count: number }[]>([]);
  const [monthly,  setMonthly]  = useState<{ month: string; revenue: number; bookings: number }[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getRevenueTrend(period),
      analyticsApi.getRevenueByType(),
      analyticsApi.getMonthlySummary(),
    ]).then(([r, t, m]) => {
      setTrend(r.trend);
      setByType(t.breakdown);
      setMonthly(m.summary);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(sym, kpis?.totalRevenue ?? 0) },
          { label: 'RevPAR', value: fmt(sym, kpis?.revPAR ?? 0) },
          { label: 'ADR', value: fmt(sym, kpis?.adr ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Daily Revenue">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} interval={Math.floor(trend.length / 7)} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [fmt(sym, v), 'Revenue']} labelFormatter={l => `Date: ${l}`} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Monthly Revenue (Last 12 Months)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={shortMonth} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [fmt(sym, v), 'Revenue']} labelFormatter={shortMonth} />
            <Bar dataKey="revenue" fill="#8b5cf6" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {byType.length > 0 && (
        <SectionCard title="Revenue by Room Type">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byType} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [fmt(sym, v), 'Revenue']} />
                <Bar dataKey="revenue" radius={[4,4,0,0]}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byType} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => fmt(sym, v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

// ─── Tab: Occupancy ───────────────────────────────────────────────────────────

const OccupancyTab = ({ kpis, period }: { kpis: KPIs | null; period: Period }) => {
  const [trend, setTrend] = useState<{ date: string; occupied: number; total: number; rate: number }[]>([]);
  const [todayArrivals,   setArrivals]   = useState(0);
  const [todayDepartures, setDepartures] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getOccupancyTrend(period),
      dashboardApi.getArrivals().catch(() => ({ count: 0 })),
      dashboardApi.getDepartures().catch(() => ({ count: 0 })),
    ]).then(([o, arr, dep]) => {
      setTrend(o.trend);
      setArrivals(arr.count);
      setDepartures(dep.count);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Occupancy', value: `${kpis?.occupancyRate ?? 0}%` },
          { label: 'Occupied Rooms', value: `${kpis?.occupiedRooms ?? 0} / ${kpis?.totalRooms ?? 0}` },
          { label: 'Arriving Today', value: todayArrivals },
          { label: 'Departing Today', value: todayDepartures },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <SectionCard title={`Occupancy Trend (${period})`}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} interval={Math.floor(trend.length / 7)} />
            <YAxis unit="%" tick={{ fontSize: 10 }} domain={[0, 100]} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy Rate']} labelFormatter={l => `Date: ${l}`} />
            <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Occupied vs Available Rooms">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trend.filter((_, i) => i % Math.max(1, Math.floor(trend.length / 20)) === 0)}
            margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip labelFormatter={l => `Date: ${l}`} />
            <Bar dataKey="total"    fill="#e5e7eb" radius={[3,3,0,0]} name="Total Rooms" stackId="a" />
            <Bar dataKey="occupied" fill="#3b82f6" radius={[3,3,0,0]} name="Occupied"    stackId="b" />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
};

// ─── Tab: Bookings ────────────────────────────────────────────────────────────

const BookingsTab = ({ kpis }: { kpis: KPIs | null }) => {
  const sym = kpis?.currencySymbol ?? 'RM';
  const [channels, setChannels] = useState<{ channel: string; count: number; revenue: number }[]>([]);
  const [monthly,  setMonthly]  = useState<{ month: string; bookings: number }[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getBookingChannels(),
      analyticsApi.getMonthlySummary(),
    ]).then(([c, m]) => {
      setChannels(c.channels);
      setMonthly(m.summary);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const totalBookings = channels.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Bookings', value: kpis?.totalBookings.toLocaleString() ?? '—' },
          { label: 'Avg Length of Stay', value: `${kpis?.avgStay ?? 0} nights` },
          { label: 'Avg Revenue / Booking', value: kpis && kpis.totalBookings > 0 ? fmt(sym, kpis.totalRevenue / kpis.totalBookings) : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Booking Channels">
          {channels.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={channels} dataKey="count" nameKey="channel" cx="50%" cy="50%" outerRadius={80}
                    label={({ channel, percent }) => `${channel} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {channels.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v} bookings`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {channels.map((c, i) => (
                  <div key={c.channel} className="flex items-center gap-3 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="flex-1 text-gray-700 dark:text-gray-300 capitalize">{c.channel}</span>
                    <span className="text-gray-500 dark:text-gray-400">{c.count} bookings</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 w-24 text-right">{fmt(sym, c.revenue)}</span>
                    <span className="text-gray-400 w-10 text-right">{totalBookings > 0 ? Math.round((c.count / totalBookings) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Monthly Bookings (Last 12 Months)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={shortMonth} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [v, 'Bookings']} labelFormatter={shortMonth} />
              <Bar dataKey="bookings" fill="#10b981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',  icon: <BarChart2Icon className="w-4 h-4" /> },
  { id: 'revenue',   label: 'Revenue',   icon: <TrendingUpIcon className="w-4 h-4" /> },
  { id: 'occupancy', label: 'Occupancy', icon: <BedDoubleIcon className="w-4 h-4" /> },
  { id: 'bookings',  label: 'Bookings',  icon: <CalendarDaysIcon className="w-4 h-4" /> },
];

const Reports = () => {
  const [tab,    setTab]    = useState<Tab>('overview');
  const [period, setPeriod] = useState<Period>('30d');
  const [kpis,   setKpis]   = useState<KPIs | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);

  const loadKPIs = useCallback(() => {
    setKpiLoading(true);
    analyticsApi.getKPIs(period)
      .then(setKpis)
      .catch(() => {})
      .finally(() => setKpiLoading(false));
  }, [period]);

  useEffect(() => { loadKPIs(); }, [loadKPIs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Reports & Analytics</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <PeriodToggle value={period} onChange={p => { setPeriod(p); }} />
            <button onClick={loadKPIs} className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCwIcon className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
            <a href="/api/export/reservations" download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <DownloadIcon className="w-3.5 h-3.5" /> Reservations
            </a>
            <a href="/api/export/guests" download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <DownloadIcon className="w-3.5 h-3.5" /> Guests
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700 px-6 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {kpiLoading ? <Spinner /> : (
        <>
          {tab === 'overview'  && <OverviewTab  kpis={kpis} period={period} />}
          {tab === 'revenue'   && <RevenueTab   kpis={kpis} period={period} />}
          {tab === 'occupancy' && <OccupancyTab kpis={kpis} period={period} />}
          {tab === 'bookings'  && <BookingsTab  kpis={kpis} />}
        </>
      )}
    </div>
  );
};

export default Reports;
