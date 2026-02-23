import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon
}: StatCardProps) {
  const isPositive = changeType === 'positive';
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5">
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-lg bg-[#f7f5f2] text-[#1e2433] dark:bg-gray-700 dark:text-gray-100">
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-[#1e2433] dark:text-gray-100 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
