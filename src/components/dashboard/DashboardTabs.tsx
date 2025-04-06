
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryTable from '../InventoryTable';
import EmployeeTable from '../EmployeeTable';
import LowStockTable from '../LowStockTable';
import RestockingTable from '../RestockingTable';
import { Database, PieChart, Users, AlertCircle, PackageOpen } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="inventory" className="flex items-center gap-2">
          <Database size={16} /> Inventory
        </TabsTrigger>
        <TabsTrigger value="lowstock" className="flex items-center gap-2">
          <AlertCircle size={16} /> Low Stock
        </TabsTrigger>
        <TabsTrigger value="restocking" className="flex items-center gap-2">
          <PackageOpen size={16} /> Restocking
        </TabsTrigger>
        <TabsTrigger value="employees" className="flex items-center gap-2">
          <Users size={16} /> Employees
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="inventory" className="mt-0">
        <InventoryTable />
      </TabsContent>

      <TabsContent value="lowstock" className="mt-0">
        <LowStockTable />
      </TabsContent>
      
      <TabsContent value="restocking" className="mt-0">
        <RestockingTable />
      </TabsContent>
      
      <TabsContent value="employees" className="mt-0">
        <EmployeeTable />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
