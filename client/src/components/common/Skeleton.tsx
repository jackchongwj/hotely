import React from 'react';

const p = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

// ─── Primitives ───────────────────────────────────────────────────────────────

export const SkeletonLine = ({ w = 'full', h = 4, className = '' }: { w?: string; h?: number; className?: string }) => (
  <div className={`${p} h-${h} w-${w} ${className}`} />
);

// ─── Table rows ───────────────────────────────────────────────────────────────

const COL_WIDTHS = ['w-28', 'w-24', 'w-20', 'w-16', 'w-24', 'w-20', 'w-14', 'w-12'];

export const SkeletonTableRows = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
      <tr key={r} className="border-b border-gray-100 dark:border-gray-700">
        {Array.from({ length: cols }, (_, c) => (
          <td key={c} className="px-4 py-4">
            <div className={`${p} h-4 ${COL_WIDTHS[c % COL_WIDTHS.length]}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

export const SkeletonCard = ({ lines = 3 }: { lines?: number }) => (
  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
    <div className={`${p} h-4 w-3/4`} />
    {lines > 1 && <div className={`${p} h-3 w-1/2`} />}
    {lines > 2 && <div className={`${p} h-3 w-5/6`} />}
  </div>
);

export const SkeletonCards = ({ n = 4, lines = 3 }: { n?: number; lines?: number }) => (
  <div className="space-y-3 p-6">
    {Array.from({ length: n }, (_, i) => <SkeletonCard key={i} lines={lines} />)}
  </div>
);

// ─── Activity log rows ────────────────────────────────────────────────────────

export const SkeletonActivityRows = ({ n = 6 }: { n?: number }) => (
  <div className="divide-y divide-gray-100 dark:divide-gray-700">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="flex items-start gap-4 px-6 py-4">
        <div className={`${p} h-8 w-8 rounded-full shrink-0`} />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="flex gap-2">
            <div className={`${p} h-4 w-24`} />
            <div className={`${p} h-4 w-16`} />
          </div>
          <div className={`${p} h-3 w-3/4`} />
        </div>
        <div className={`${p} h-3 w-10 shrink-0 mt-1`} />
      </div>
    ))}
  </div>
);

// ─── Kanban (Housekeeping) ────────────────────────────────────────────────────

export const SkeletonKanban = () => (
  <div className="p-4 overflow-x-auto scrollbar-hide">
    <div className="grid grid-cols-3 gap-4 min-w-[640px]">
      {[3, 2, 4].map((count, col) => (
        <div key={col} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-4 space-y-3">
          <div className={`${p} h-5 w-24`} />
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm space-y-2">
              <div className={`${p} h-4 w-3/4`} />
              <div className={`${p} h-3 w-1/2`} />
              <div className={`${p} h-3 w-2/3`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Shift weekly grid ────────────────────────────────────────────────────────

export const SkeletonShiftGrid = () => (
  <div className="grid grid-cols-7 min-w-[700px]">
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} className="border-r last:border-r-0 dark:border-gray-700">
        <div className="px-2 py-3 border-b dark:border-gray-700 flex flex-col items-center gap-1">
          <div className={`${p} h-3 w-8`} />
          <div className={`${p} h-5 w-5`} />
        </div>
        <div className="p-1.5 space-y-1.5 min-h-[120px]">
          {i % 3 !== 2 && <div className={`${p} h-14 w-full rounded`} />}
          {i % 4 === 0 && <div className={`${p} h-14 w-full rounded`} />}
        </div>
      </div>
    ))}
  </div>
);

// ─── Compact room cards ───────────────────────────────────────────────────────

export const SkeletonRoomCards = ({ n = 12 }: { n?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className={`border-l-4 border-l-gray-300 dark:border-l-gray-600 border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-bl-lg p-3 space-y-2`}>
        <div className={`${p} h-6 w-10`} />
        <div className={`${p} h-3 w-20`} />
        <div className={`${p} h-3 w-14`} />
        <div className={`${p} h-6 w-full mt-auto`} />
      </div>
    ))}
  </div>
);

// ─── Stat cards (Dashboard) ───────────────────────────────────────────────────

export const SkeletonStatCards = ({ n = 4 }: { n?: number }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${n} gap-4`}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
        <div className="flex items-center gap-3">
          <div className={`${p} h-12 w-12 rounded-full shrink-0`} />
          <div className="space-y-2 flex-1">
            <div className={`${p} h-3 w-24`} />
            <div className={`${p} h-6 w-16`} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
