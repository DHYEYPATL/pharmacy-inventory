
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from 'lucide-react';

interface ConnectionConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

const DatabaseConnection: React.FC = () => {
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    host: 'localhost',
    port: '3306',
    database: 'pharmacy_db',
    username: '',
    password: ''
  });
  const [isConnected, setIsConnected] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionConfig((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = () => {
    // This would be where you'd actually connect to a database
    // For demo purposes, we'll just simulate a connection
    toast.loading("Connecting to database...");
    
    // Simulating connection delay
    setTimeout(() => {
      setIsConnected(true);
      toast.success("Successfully connected to database");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-pharmacy-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          <span>Database Connection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="host" className="text-sm font-medium">Host</label>
            <Input 
              id="host" 
              name="host"
              value={connectionConfig.host} 
              onChange={handleInputChange}
              placeholder="e.g. localhost"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="port" className="text-sm font-medium">Port</label>
            <Input
              id="port"
              name="port"
              value={connectionConfig.port}
              onChange={handleInputChange}
              placeholder="e.g. 3306"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="database" className="text-sm font-medium">Database Name</label>
          <Input
            id="database"
            name="database"
            value={connectionConfig.database}
            onChange={handleInputChange}
            placeholder="e.g. pharmacy_db"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">Username</label>
          <Input
            id="username"
            name="username"
            value={connectionConfig.username}
            onChange={handleInputChange}
            placeholder="Database username"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            value={connectionConfig.password}
            onChange={handleInputChange}
            placeholder="Database password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleConnect}
          className="bg-pharmacy-primary hover:bg-blue-700"
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect Database'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnection;
