import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Search, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface RestockItem {
  restock_id: number;
  drug_name: string;
  quantity_needed: number;
  price_per_unit: number;
  supplier: string;
}

const RestockingTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restockingData, setRestockingData] = useState<RestockItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [newRestockItem, setNewRestockItem] = useState({
    drug_name: '',
    quantity_needed: '',
    price_per_unit: '',
    supplier: ''
  });

  // Fetch restocking data from Supabase
  const fetchRestockingItems = async () => {
    setIsLoading(true);
    try {
      // Check if supabase client exists
      if (!supabase) {
        setConnectionError(true);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('restocking')
        .select('*')
        .order('drug_name');
        
      if (error) {
        toast.error("Error fetching restocking items: " + error.message);
        return;
      }
      
      if (data) {
        setRestockingData(data as RestockItem[]);
      }
    } catch (error) {
      toast.error("Error fetching restocking data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRestockingItems();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRestockingItems = restockingData.filter(item => 
    item.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRestockItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRestockItem = async () => {
    try {
      if (!supabase) {
        toast.error("Database connection not available");
        return;
      }

      const itemToAdd = {
        drug_name: newRestockItem.drug_name,
        quantity_needed: parseInt(newRestockItem.quantity_needed),
        price_per_unit: parseFloat(newRestockItem.price_per_unit),
        supplier: newRestockItem.supplier
      };

      const { data, error } = await supabase
        .from('restocking')
        .insert([itemToAdd])
        .select();

      if (error) {
        toast.error("Error adding restock item: " + error.message);
        return;
      }

      toast.success("Restock item added successfully!");
      setRestockingData([...restockingData, data[0] as RestockItem]);
      setIsModalOpen(false);
      setNewRestockItem({
        drug_name: '',
        quantity_needed: '',
        price_per_unit: '',
        supplier: ''
      });
    } catch (error) {
      toast.error("Error adding restock item");
      console.error(error);
    }
  };

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
      <CardHeader className="bg-amber-500 text-white rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle>Restocking Items</CardTitle>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-white text-amber-600 hover:bg-amber-100"
        >
          <Plus size={18} className="mr-1" /> Add Item
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by drug name or supplier..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-amber-50">
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Quantity Needed</TableHead>
                <TableHead>Price Per Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading restocking items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRestockingItems.length > 0 ? (
                filteredRestockingItems.map((item) => (
                  <TableRow key={item.restock_id} className="bg-amber-50/30">
                    <TableCell className="font-medium">{item.drug_name}</TableCell>
                    <TableCell>{item.quantity_needed}</TableCell>
                    <TableCell>${item.price_per_unit.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>${(item.quantity_needed * item.price_per_unit).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No restocking items found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Restocking Item</DialogTitle>
            <DialogDescription>
              Add a new item to your restocking list
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="drug_name" className="text-sm font-medium">Drug Name</label>
                <Input
                  id="drug_name"
                  name="drug_name"
                  value={newRestockItem.drug_name}
                  onChange={handleInputChange}
                  placeholder="Enter drug name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={newRestockItem.supplier}
                  onChange={handleInputChange}
                  placeholder="Supplier name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity_needed" className="text-sm font-medium">Quantity Needed</label>
                <Input
                  id="quantity_needed"
                  name="quantity_needed"
                  type="number"
                  value={newRestockItem.quantity_needed}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price_per_unit" className="text-sm font-medium">Price Per Unit</label>
                <Input
                  id="price_per_unit"
                  name="price_per_unit"
                  type="number"
                  step="0.01"
                  value={newRestockItem.price_per_unit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              type="button" 
              onClick={handleAddRestockItem} 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={!newRestockItem.drug_name || !newRestockItem.supplier}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RestockingTable;
