
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  emp_id: number;
  name: string;
  shift: string;
  salary: number;
}

const EmployeeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    shift: '',
    salary: ''
  });

  // Fetch employee data from Supabase
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('*')
        .order('name');
        
      if (error) {
        toast.error("Error fetching employees: " + error.message);
        return;
      }
      
      if (data) {
        setEmployeeData(data as Employee[]);
      }
    } catch (error) {
      toast.error("Error fetching employees");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employeeData.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      const employeeToAdd = {
        name: newEmployee.name,
        shift: newEmployee.shift,
        salary: parseFloat(newEmployee.salary)
      };

      const { data, error } = await supabase
        .from('employee')
        .insert([employeeToAdd])
        .select();

      if (error) {
        toast.error("Error adding employee: " + error.message);
        return;
      }

      toast.success("Employee added successfully!");
      setEmployeeData([...employeeData, data[0] as Employee]);
      setIsModalOpen(false);
      setNewEmployee({
        name: '',
        shift: '',
        salary: ''
      });
    } catch (error) {
      toast.error("Error adding employee");
      console.error(error);
    }
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
            placeholder="Search by employee name..."
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
                <TableHead>Shift</TableHead>
                <TableHead>Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading employee data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.emp_id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.shift}</TableCell>
                    <TableCell>${employee.salary}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
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
            <DialogDescription>
              Add a new employee to your pharmacy staff
            </DialogDescription>
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
            <Button 
              type="button" 
              onClick={handleAddEmployee} 
              className="bg-pharmacy-secondary"
              disabled={!newEmployee.name || !newEmployee.shift}
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmployeeTable;
