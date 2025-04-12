
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-pharmacy-text mt-1">{value}</h3>
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
