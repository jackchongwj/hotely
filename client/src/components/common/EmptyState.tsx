import React from 'react';
import { InboxIcon } from 'lucide-react';

interface Props {
  message?: string;
  sub?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  colSpan?: number;
  compact?: boolean;
}

// Standalone empty state (for non-table contexts)
export const EmptyState = ({ message = 'Nothing here yet.', sub, icon, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
      {icon ?? <InboxIcon className="w-6 h-6" />}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{message}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
);

// Table-cell empty state — wraps in <tr><td> so it works inside a <tbody>
export const EmptyTableRow = ({ message = 'No records found.', colSpan = 6, sub }: Props) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10">
      <EmptyState message={message} sub={sub} compact />
    </td>
  </tr>
);

export default EmptyState;
