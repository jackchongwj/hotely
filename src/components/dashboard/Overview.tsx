import React from 'react';
import { BedDouble, DollarSign, LogIn, LogOut } from 'lucide-react';
import { RevenueChart } from './RevenueChart';
import { RoomStatusGrid } from './RoomStatusGrid';
import { RecentReservations } from './RecentReservations';
import { UpcomingCheckins } from './UpcomingCheckins';
import { StatCard } from './StatCard';

const Overview = () => {
  const stats = [
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '5.2%',
      changeType: 'positive' as const,
      icon: BedDouble
    },
    {
      title: "Today's Revenue",
      value: '$12,458',
      change: '12.3%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Check-ins Today',
      value: '24',
      change: '+3',
      changeType: 'positive' as const,
      icon: LogIn
    },
    {
      title: 'Check-outs Today',
      value: '18',
      change: '-2',
      changeType: 'negative' as const,
      icon: LogOut
    }
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
          <RevenueChart />
        </div>
        <div>
          <RoomStatusGrid />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReservations />
        </div>
        <div>
          <UpcomingCheckins />
        </div>
      </div>
    </div>
  );
};

export default Overview;
