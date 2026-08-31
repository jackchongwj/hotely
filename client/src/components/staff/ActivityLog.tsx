import EmptyState from '../common/EmptyState';
import { SkeletonActivityRows } from '../common/Skeleton';
import React, { useState, useEffect } from 'react';
import { RefreshCwIcon, FilterIcon } from 'lucide-react';
import { activityApi, ActivityLogEntry } from '../../services/api';
import Pagination from '../common/Pagination';

const ACTION_COLORS: Record<string, string> = {
  reservation_created:  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  reservation_cancelled:'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  check_in:             'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  check_out:            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const ACTION_LABELS: Record<string, string> = {
  reservation_created:  'Booking',
  reservation_cancelled:'Cancelled',
  check_in:             'Check-In',
  check_out:            'Check-Out',
};

const ACTION_OPTIONS = Object.entries(ACTION_LABELS);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const load = (p: number, l: number, action: string) => {
    setLoading(true);
    activityApi.getAll(p, l, action)
      .then(({ logs, total, pages }) => {
        setLogs(logs);
        setTotal(total);
        setPages(pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page, limit, actionFilter); }, [page, limit, actionFilter]);

  const handleFilterChange = (action: string) => {
    setActionFilter(action);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Activity Log</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{total} total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FilterIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="pl-8 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-1.5 text-sm"
                value={actionFilter}
                onChange={e => handleFilterChange(e.target.value)}
              >
                <option value="">All actions</option>
                {ACTION_OPTIONS.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <button onClick={() => load(page, limit, actionFilter)}
              className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCwIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonActivityRows n={8} />
        ) : logs.length === 0 ? (
          <EmptyState message="No activity recorded yet." sub="Actions like check-ins and bookings will appear here." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.map(log => {
              const user = log.userId;
              const userName = user ? `${user.fname} ${user.lname}` : 'System';
              return (
                <div key={log._id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-200 shrink-0">
                    {user ? `${user.fname[0]}${user.lname[0]}` : 'SY'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{userName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{log.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 pt-1">{timeAgo(log.createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="px-6 pb-4">
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
  );
};

export default ActivityLog;
