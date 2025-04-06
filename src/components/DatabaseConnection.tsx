
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from 'lucide-react';

interface ConnectionConfig {
  url: string;
  apiKey: string;
}

interface DatabaseConnectionProps {
  onConnect?: () => void;
}

const DatabaseConnection: React.FC<DatabaseConnectionProps> = ({ onConnect }) => {
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    url: "",
    apiKey: ""
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we already have connection info stored
  useEffect(() => {
    const storedUrl = localStorage.getItem('supabaseUrl');
    const storedKey = localStorage.getItem('supabaseKey');
    
    if (storedUrl && storedKey) {
      setConnectionConfig({
        url: storedUrl,
        apiKey: storedKey
      });
      setIsConnected(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearConnection = () => {
    // Clear stored credentials
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    
    // Reset form
    setConnectionConfig({
      url: "",
      apiKey: ""
    });
    setIsConnected(false);
    
    toast.success("Connection information cleared");
    
    // Reload page to reset Supabase client
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleConnect = async () => {
    if (!connectionConfig.url || !connectionConfig.apiKey) {
      toast.error("Supabase URL and API Key are required");
      return;
    }
    
    setIsLoading(true);
    toast.loading("Connecting to Supabase...");
    
    try {
      // Create a temporary Supabase client with the provided credentials
      const { createClient } = await import('@supabase/supabase-js');
      const tempSupabase = createClient(connectionConfig.url, connectionConfig.apiKey);
      
      // Try to connect to inventory table
      const { data, error } = await tempSupabase
        .from('inventory')
        .select('drug_id')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist but connection is valid
          setIsConnected(true);
          toast.success("Connected to Supabase. Please create the required tables.");
          
          // Save connection details
          localStorage.setItem('supabaseUrl', connectionConfig.url);
          localStorage.setItem('supabaseKey', connectionConfig.apiKey);
          
          // Call onConnect callback if provided
          if (onConnect) {
            onConnect();
          }
        } else {
          toast.error("Connection failed: " + error.message);
        }
        setIsLoading(false);
        return;
      }
      
      // If we're here, it means we successfully connected
      // Save the connection details to localStorage for later use
      localStorage.setItem('supabaseUrl', connectionConfig.url);
      localStorage.setItem('supabaseKey', connectionConfig.apiKey);
      
      setIsConnected(true);
      toast.success("Successfully connected to Supabase");

      // Call onConnect callback if provided
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      toast.error("Connection failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-pharmacy-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          <span>Supabase Connection</span>
        </CardTitle>
        <CardDescription className="text-white/80">
          Connect to your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">Supabase URL</label>
          <Input 
            id="url" 
            name="url"
            value={connectionConfig.url} 
            onChange={handleInputChange}
            placeholder="https://your-project.supabase.co"
            readOnly={isConnected}
          />
          <p className="text-xs text-muted-foreground">
            Your Supabase project URL from the settings
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">Supabase Anon Key</label>
          <Input
            id="apiKey"
            name="apiKey"
            type="password"
            value={connectionConfig.apiKey}
            onChange={handleInputChange}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            readOnly={isConnected}
          />
          <p className="text-xs text-muted-foreground">
            Your public anon key from Supabase project settings
          </p>
        </div>
        <div className="pt-2">
          {isConnected && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              Connected to Supabase
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConnected && (
          <Button 
            onClick={handleClearConnection}
            variant="destructive"
          >
            Disconnect
          </Button>
        )}
        <Button 
          onClick={handleConnect}
          className="bg-pharmacy-primary hover:bg-blue-700"
          disabled={isConnected || isLoading || !connectionConfig.url || !connectionConfig.apiKey}
        >
          {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Connect to Supabase'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnection;
