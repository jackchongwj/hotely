import React, { useEffect, useState } from 'react';
import { BedDouble, DollarSign, LogIn, LogOut } from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { RevenueChart } from './RevenueChart';
import { RoomStatusGrid } from './RoomStatusGrid';
import { RecentReservations } from './RecentReservations';
import { UpcomingCheckins } from './UpcomingCheckins';
import { StatCard } from './StatCard';

const Overview = () => {
  const [occupancy, setOccupancy] = useState<{ rate: number } | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [arrivals, setArrivals] = useState<number | null>(null);
  const [departures, setDepartures] = useState<number | null>(null);

  useEffect(() => {
    dashboardApi.getOccupancy().then(setOccupancy).catch(() => {});
    dashboardApi.getDailyRevenue().then(r => setRevenue(r.revenue)).catch(() => {});
    dashboardApi.getArrivals().then(r => setArrivals(r.count)).catch(() => {});
    dashboardApi.getDepartures().then(r => setDepartures(r.count)).catch(() => {});
  }, []);

  const stats = [
    {
      title: 'Occupancy Rate',
      value: occupancy != null ? `${occupancy.rate}%` : '—',
      change: '',
      changeType: 'positive' as const,
      icon: BedDouble,
    },
    {
      title: "Today's Revenue",
      value: revenue != null ? `$${revenue.toLocaleString()}` : '—',
      change: '',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Check-ins Today',
      value: arrivals != null ? String(arrivals) : '—',
      change: '',
      changeType: 'positive' as const,
      icon: LogIn,
    },
    {
      title: 'Check-outs Today',
      value: departures != null ? String(departures) : '—',
      change: '',
      changeType: 'positive' as const,
      icon: LogOut,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReservations />
        </div>
        <div>
          <UpcomingCheckins />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RoomStatusGrid />
        </div>
      </div>
    </div>
  );
};

export default Overview;
