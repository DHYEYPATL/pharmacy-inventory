
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface Drug {
  drug_id: number;
  drug_name: string;
  company: string;
  storage_date: string;
  expiry_date: string;
  retail_price: number;
  current_quantity: number;
}

const InventoryTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryData, setInventoryData] = useState<Drug[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newDrug, setNewDrug] = useState({
    drug_name: '',
    company: '',
    storage_date: '',
    expiry_date: '',
    retail_price: '',
    current_quantity: ''
  });

  // Fetch inventory data from Supabase
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('drug_name');
        
      if (error) {
        toast.error("Error fetching inventory: " + error.message);
        return;
      }
      
      if (data) {
        setInventoryData(data as Drug[]);
      }
    } catch (error) {
      toast.error("Error fetching inventory");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventoryData.filter(drug => 
    drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drug.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDrug(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDrug = async () => {
    try {
      const drugToAdd = {
        drug_name: newDrug.drug_name,
        company: newDrug.company,
        storage_date: newDrug.storage_date,
        expiry_date: newDrug.expiry_date,
        retail_price: parseFloat(newDrug.retail_price),
        current_quantity: parseInt(newDrug.current_quantity)
      };

      const { data, error } = await supabase
        .from('inventory')
        .insert([drugToAdd])
        .select();

      if (error) {
        toast.error("Error adding drug: " + error.message);
        return;
      }

      toast.success("Drug added successfully!");
      setInventoryData([...inventoryData, data[0] as Drug]);
      setIsModalOpen(false);
      setNewDrug({
        drug_name: '',
        company: '',
        storage_date: '',
        expiry_date: '',
        retail_price: '',
        current_quantity: ''
      });
    } catch (error) {
      toast.error("Error adding drug");
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-pharmacy-primary text-white rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle>Inventory Management</CardTitle>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-white text-pharmacy-primary hover:bg-pharmacy-light"
        >
          <Plus size={18} className="mr-1" /> Add Drug
        </Button>
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
            <TableHeader className="bg-pharmacy-accent">
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Storage Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Current Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading inventory data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((drug) => (
                  <TableRow key={drug.drug_id}>
                    <TableCell>{drug.drug_name}</TableCell>
                    <TableCell>{drug.company}</TableCell>
                    <TableCell>{drug.storage_date}</TableCell>
                    <TableCell>{drug.expiry_date}</TableCell>
                    <TableCell>${drug.retail_price}</TableCell>
                    <TableCell>{drug.current_quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No drugs found matching your search.
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
            <DialogTitle>Add New Drug</DialogTitle>
            <DialogDescription>
              Add a new drug to your pharmacy inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="drug_name" className="text-sm font-medium">Drug Name</label>
                <Input
                  id="drug_name"
                  name="drug_name"
                  value={newDrug.drug_name}
                  onChange={handleInputChange}
                  placeholder="Enter drug name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <Input
                  id="company"
                  name="company"
                  value={newDrug.company}
                  onChange={handleInputChange}
                  placeholder="Manufacturing company"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="storage_date" className="text-sm font-medium">Storage Date</label>
                <Input
                  id="storage_date"
                  name="storage_date"
                  type="date"
                  value={newDrug.storage_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="expiry_date" className="text-sm font-medium">Expiry Date</label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={newDrug.expiry_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="retail_price" className="text-sm font-medium">Retail Price</label>
                <Input
                  id="retail_price"
                  name="retail_price"
                  value={newDrug.retail_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="current_quantity" className="text-sm font-medium">Quantity</label>
                <Input
                  id="current_quantity"
                  name="current_quantity"
                  type="number"
                  value={newDrug.current_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              type="button" 
              onClick={handleAddDrug} 
              className="bg-pharmacy-primary"
              disabled={!newDrug.drug_name || !newDrug.company}
            >
              Add Drug
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InventoryTable;
