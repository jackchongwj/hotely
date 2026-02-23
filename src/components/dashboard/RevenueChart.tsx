import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Mon',
    revenue: 8400
  },
  {
    name: 'Tue',
    revenue: 9200
  },
  {
    name: 'Wed',
    revenue: 7800
  },
  {
    name: 'Thu',
    revenue: 10500
  },
  {
    name: 'Fri',
    revenue: 13200
  },
  {
    name: 'Sat',
    revenue: 15800
  },
  {
    name: 'Sun',
    revenue: 12458
  }
];

export function RevenueChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#1e2433] dark:text-gray-100">
            Revenue Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 7 days performance
          </p>
        </div>
        <select className="text-sm border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-[#f7f5f2] dark:bg-gray-700 text-[#1e2433] dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#d4a853]">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4a853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#9ca3af',
                fontSize: 12
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#9ca3af',
                fontSize: 12
              }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1e2433',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{
                color: '#d4a853'
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                'Revenue'
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#d4a853"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
