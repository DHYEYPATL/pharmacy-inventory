
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseConnection from './DatabaseConnection';
import InventoryTable from './InventoryTable';
import EmployeeTable from './EmployeeTable';
import LowStockTable from './LowStockTable';
import RestockingTable from './RestockingTable';
import { Card, CardContent } from "@/components/ui/card";
import { Database, PieChart, Users, AlertCircle, PackageOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface DashboardStats {
  totalDrugs: number;
  lowStockItems: number;
  totalEmployees: number;
  restockingItems: number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [stats, setStats] = useState<DashboardStats>({
    totalDrugs: 0,
    lowStockItems: 0,
    totalEmployees: 0,
    restockingItems: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  // Check database connection and load stats
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to ping the database
        const { error } = await supabase.from('inventory').select('drug_id').limit(1);
        if (!error) {
          setIsConnected(true);
          loadStats();
        }
      } catch (error) {
        console.error("Database connection error:", error);
      }
    };

    checkConnection();
  }, []);

  const loadStats = async () => {
    try {
      // Get total drugs
      const { data: drugs, error: drugsError } = await supabase
        .from('inventory')
        .select('drug_id');
      
      if (!drugsError && drugs) {
        setStats(prev => ({ ...prev, totalDrugs: drugs.length }));
      }

      // Get low stock items (less than 25 items)
      const { data: lowStock, error: lowStockError } = await supabase
        .from('inventory')
        .select('drug_id')
        .lt('current_quantity', 25);
      
      if (!lowStockError && lowStock) {
        setStats(prev => ({ ...prev, lowStockItems: lowStock.length }));
      }

      // Get total employees
      const { data: employees, error: employeesError } = await supabase
        .from('employee')
        .select('emp_id');
      
      if (!employeesError && employees) {
        setStats(prev => ({ ...prev, totalEmployees: employees.length }));
      }

      // Get total restocking items
      const { data: restocking, error: restockingError } = await supabase
        .from('restocking')
        .select('restock_id');
      
      if (!restockingError && restocking) {
        setStats(prev => ({ ...prev, restockingItems: restocking.length }));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pharmacy-text">Pharmacy Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Drugs</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">{stats.totalDrugs}</h3>
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
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">{stats.lowStockItems}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">{stats.totalEmployees}</h3>
            </div>
            <div className="bg-pharmacy-secondary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-pharmacy-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Restocking Items</p>
              <h3 className="text-2xl font-bold text-pharmacy-text mt-1">{stats.restockingItems}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <PackageOpen className="h-6 w-6 text-amber-500" />
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
