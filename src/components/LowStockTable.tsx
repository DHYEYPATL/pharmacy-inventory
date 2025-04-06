import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface DrugItem {
  drug_id: number;
  drug_name: string;
  company: string;
  storage_date: string;
  expiry_date: string;
  retail_price: number;
  current_quantity: number;
}

const LowStockTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockItems, setLowStockItems] = useState<DrugItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  // Fetch low stock drugs from Supabase
  const fetchLowStockItems = async () => {
    setIsLoading(true);
    try {
      // Check if supabase client exists
      if (!supabase) {
        setConnectionError(true);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .lt('current_quantity', 25)
        .order('current_quantity');
        
      if (error) {
        toast.error("Error fetching low stock items: " + error.message);
        return;
      }
      
      if (data) {
        setLowStockItems(data as DrugItem[]);
      }
    } catch (error) {
      toast.error("Error fetching low stock items");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = lowStockItems.filter(drug => 
    drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drug.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show error if no connection is available
  if (connectionError) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4">Database connection not available. Please connect to your Supabase database.</p>
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
            Reconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle size={20} /> 
          Low Stock Items (Below 25 units)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by drug name or company..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-red-50">
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading low stock items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((drug) => (
                  <TableRow key={drug.drug_id} className="bg-red-50/30">
                    <TableCell className="font-medium">{drug.drug_name}</TableCell>
                    <TableCell>{drug.company}</TableCell>
                    <TableCell>{drug.expiry_date}</TableCell>
                    <TableCell>${drug.retail_price}</TableCell>
                    <TableCell className="text-red-600 font-bold">{drug.current_quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No low stock items found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
