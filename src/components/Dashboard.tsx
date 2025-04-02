
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseConnection from './DatabaseConnection';
import InventoryTable from './InventoryTable';
import EmployeeTable from './EmployeeTable';
import { Card, CardContent } from "@/components/ui/card";
import { Database, PieChart, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pharmacy-text">Pharmacy Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Drugs</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">245</h3>
            </div>
            <div className="bg-pharmacy-primary/10 p-3 rounded-full">
              <PieChart className="h-6 w-6 text-pharmacy-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">12</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <PieChart className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">5</h3>
            </div>
            <div className="bg-pharmacy-secondary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-pharmacy-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <DatabaseConnection />
        </div>
        
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Database size={16} /> Inventory
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users size={16} /> Employees
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="mt-0">
              <InventoryTable />
            </TabsContent>
            
            <TabsContent value="employees" className="mt-0">
              <EmployeeTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
