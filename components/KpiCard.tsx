import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'orange' | 'green';
  trend?: 'up' | 'down' | 'stable';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
    red: 'bg-red-500/10 border-red-500/50 text-red-400',
    orange: 'bg-orange-500/10 border-orange-500/50 text-orange-400',
    green: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} flex items-center justify-between`}>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-100">{value}</span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-20`}>
        <Icon size={24} />
      </div>
    </div>
  );
};