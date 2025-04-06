
import React from 'react';
import { PieChart, Users, AlertCircle, PackageOpen } from 'lucide-react';
import StatsCard from './StatsCard';

interface DashboardStatsProps {
  stats: {
    totalDrugs: number;
    lowStockItems: number;
    totalEmployees: number;
    restockingItems: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Total Drugs" 
        value={stats.totalDrugs} 
        icon={<PieChart className="h-6 w-6 text-pharmacy-primary" />}
        iconBgColor="bg-pharmacy-primary/10"
      />
      
      <StatsCard 
        title="Low Stock Items" 
        value={stats.lowStockItems} 
        icon={<AlertCircle className="h-6 w-6 text-red-500" />}
        iconBgColor="bg-red-100"
      />
      
      <StatsCard 
        title="Total Employees" 
        value={stats.totalEmployees} 
        icon={<Users className="h-6 w-6 text-pharmacy-secondary" />}
        iconBgColor="bg-pharmacy-secondary/10"
      />
      
      <StatsCard 
        title="Restocking Items" 
        value={stats.restockingItems} 
        icon={<PackageOpen className="h-6 w-6 text-amber-500" />}
        iconBgColor="bg-amber-100"
      />
    </div>
  );
};

export default DashboardStats;
