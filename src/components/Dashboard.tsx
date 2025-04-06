
import React, { useState, useEffect } from 'react';
import DatabaseConnection from './DatabaseConnection';
import DashboardStats from './dashboard/DashboardStats';
import DashboardTabs from './dashboard/DashboardTabs';
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
  const [isLoading, setIsLoading] = useState(true);

  // Check if supabase credentials are available and test connection
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      
      try {
        // Check if supabase client exists and test connection
        if (supabase) {
          try {
            // Test connection by attempting to query
            const { data, error } = await supabase.from('inventory').select('drug_id').limit(1);
            
            if (!error) {
              setIsConnected(true);
              loadStats();
            } else {
              console.error("Database connection error:", error);
              setIsConnected(false);
              // Clear any invalid credentials
              if (error.code === 'PGRST16') {
                localStorage.removeItem('supabaseUrl');
                localStorage.removeItem('supabaseKey');
                toast.error("Invalid database credentials. Please reconnect.");
              }
            }
          } catch (error) {
            console.error("Connection test failed:", error);
            setIsConnected(false);
          }
        } else {
          // No supabase client available
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const loadStats = async () => {
    if (!supabase) return;
    
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

  // Always show connection form, even when loading
  if (isLoading || !isConnected) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-pharmacy-text">Pharmacy Management System</h1>
        <p className="text-center mb-8 text-gray-600 max-w-lg">
          Welcome to the Pharmacy Management System. Please connect to your Supabase database to continue.
        </p>
        <div className="max-w-md w-full">
          <DatabaseConnection onConnect={() => {
            // Reload the page to initialize Supabase with new credentials
            window.location.reload();
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pharmacy-text">Pharmacy Management System</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <DatabaseConnection onConnect={() => window.location.reload()} />
        </div>
        
        <div className="md:col-span-2">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
