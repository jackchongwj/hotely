import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface Props {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

const btnBase = 'min-w-[2rem] h-8 px-1.5 flex items-center justify-center rounded text-sm border transition-colors';
const btnActive = 'bg-blue-600 border-blue-600 text-white font-medium';
const btnInactive = 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
const btnDisabled = 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed';

const Pagination: React.FC<Props> = ({ page, pages, total, limit, onPageChange, onLimitChange }) => {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2 shrink-0">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={e => { onLimitChange(Number(e.target.value)); onPageChange(1); }}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="text-gray-500 dark:text-gray-400">
          {total === 0 ? 'No results' : `${from}–${to} of ${total}`}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnInactive}`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {pageWindow(page, pages).map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="min-w-[2rem] h-8 flex items-center justify-center text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`${btnBase} ${p === page ? btnActive : btnInactive}`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages || pages === 0}
          className={`${btnBase} ${page === pages || pages === 0 ? btnDisabled : btnInactive}`}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
