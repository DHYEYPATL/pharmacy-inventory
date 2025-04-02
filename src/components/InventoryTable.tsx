
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search } from 'lucide-react';

// Mock inventory data
const mockInventoryData = [
  { id: 1, name: 'Paracetamol', company: 'MediPharma', storageDate: '2023-09-15', expiryDate: '2025-09-15', retailPrice: '5.99', currentQuantity: 150 },
  { id: 2, name: 'Ibuprofen', company: 'HealthCure', storageDate: '2023-10-20', expiryDate: '2025-10-20', retailPrice: '4.50', currentQuantity: 200 },
  { id: 3, name: 'Amoxicillin', company: 'BioMed', storageDate: '2023-08-10', expiryDate: '2024-08-10', retailPrice: '12.99', currentQuantity: 75 },
  { id: 4, name: 'Cetirizine', company: 'AllerCare', storageDate: '2023-11-05', expiryDate: '2025-11-05', retailPrice: '7.25', currentQuantity: 120 },
  { id: 5, name: 'Omeprazole', company: 'GastroHealth', storageDate: '2023-07-25', expiryDate: '2024-07-25', retailPrice: '9.99', currentQuantity: 90 },
  { id: 6, name: 'Ciprofloxacin', company: 'BioMed', storageDate: '2023-06-30', expiryDate: '2024-06-30', retailPrice: '14.50', currentQuantity: 60 },
];

const InventoryTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryData, setInventoryData] = useState(mockInventoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDrug, setNewDrug] = useState({
    name: '',
    company: '',
    storageDate: '',
    expiryDate: '',
    retailPrice: '',
    currentQuantity: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventoryData.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drug.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDrug(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDrug = () => {
    const newId = Math.max(...inventoryData.map(drug => drug.id)) + 1;
    const drugToAdd = {
      id: newId,
      name: newDrug.name,
      company: newDrug.company,
      storageDate: newDrug.storageDate,
      expiryDate: newDrug.expiryDate,
      retailPrice: newDrug.retailPrice,
      currentQuantity: parseInt(newDrug.currentQuantity)
    };

    setInventoryData([...inventoryData, drugToAdd]);
    setIsModalOpen(false);
    setNewDrug({
      name: '',
      company: '',
      storageDate: '',
      expiryDate: '',
      retailPrice: '',
      currentQuantity: ''
    });
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
              {filteredInventory.length > 0 ? (
                filteredInventory.map((drug) => (
                  <TableRow key={drug.id}>
                    <TableCell>{drug.name}</TableCell>
                    <TableCell>{drug.company}</TableCell>
                    <TableCell>{drug.storageDate}</TableCell>
                    <TableCell>{drug.expiryDate}</TableCell>
                    <TableCell>${drug.retailPrice}</TableCell>
                    <TableCell>{drug.currentQuantity}</TableCell>
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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Drug Name</label>
                <Input
                  id="name"
                  name="name"
                  value={newDrug.name}
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
                <label htmlFor="storageDate" className="text-sm font-medium">Storage Date</label>
                <Input
                  id="storageDate"
                  name="storageDate"
                  type="date"
                  value={newDrug.storageDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={newDrug.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="retailPrice" className="text-sm font-medium">Retail Price</label>
                <Input
                  id="retailPrice"
                  name="retailPrice"
                  value={newDrug.retailPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="currentQuantity" className="text-sm font-medium">Quantity</label>
                <Input
                  id="currentQuantity"
                  name="currentQuantity"
                  type="number"
                  value={newDrug.currentQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddDrug} className="bg-pharmacy-primary">Add Drug</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InventoryTable;
