
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search } from 'lucide-react';

// Mock employee data
const mockEmployeeData = [
  { id: 1, name: 'John Doe', employeeId: 'EMP001', shift: 'Morning', salary: '3500' },
  { id: 2, name: 'Jane Smith', employeeId: 'EMP002', shift: 'Evening', salary: '3200' },
  { id: 3, name: 'Michael Johnson', employeeId: 'EMP003', shift: 'Night', salary: '3800' },
  { id: 4, name: 'Emily Brown', employeeId: 'EMP004', shift: 'Morning', salary: '3400' },
  { id: 5, name: 'William Davis', employeeId: 'EMP005', shift: 'Evening', salary: '3100' },
];

const EmployeeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeData, setEmployeeData] = useState(mockEmployeeData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    shift: '',
    salary: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employeeData.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = () => {
    const newId = Math.max(...employeeData.map(employee => employee.id)) + 1;
    const employeeToAdd = {
      id: newId,
      name: newEmployee.name,
      employeeId: newEmployee.employeeId,
      shift: newEmployee.shift,
      salary: newEmployee.salary
    };

    setEmployeeData([...employeeData, employeeToAdd]);
    setIsModalOpen(false);
    setNewEmployee({
      name: '',
      employeeId: '',
      shift: '',
      salary: ''
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-pharmacy-secondary text-white rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle>Employee Management</CardTitle>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-white text-pharmacy-secondary hover:bg-pharmacy-light"
        >
          <Plus size={18} className="mr-1" /> Add Employee
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by employee name or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-pharmacy-accent">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.shift}</TableCell>
                    <TableCell>${employee.salary}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No employees found matching your search.
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
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                placeholder="Enter employee name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="employeeId" className="text-sm font-medium">Employee ID</label>
              <Input
                id="employeeId"
                name="employeeId"
                value={newEmployee.employeeId}
                onChange={handleInputChange}
                placeholder="e.g. EMP006"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="shift" className="text-sm font-medium">Shift</label>
              <Input
                id="shift"
                name="shift"
                value={newEmployee.shift}
                onChange={handleInputChange}
                placeholder="Morning, Evening, or Night"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-medium">Salary</label>
              <Input
                id="salary"
                name="salary"
                value={newEmployee.salary}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddEmployee} className="bg-pharmacy-secondary">Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmployeeTable;
