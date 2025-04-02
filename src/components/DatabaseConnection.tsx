
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from 'lucide-react';
import { supabase, initializeSupabase } from '@/lib/supabase';

interface ConnectionConfig {
  url: string;
  apiKey: string;
}

const DatabaseConnection: React.FC = () => {
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    url: import.meta.env.VITE_SUPABASE_URL || '',
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're already connected on component load
  useEffect(() => {
    const checkConnection = async () => {
      if (connectionConfig.url && connectionConfig.apiKey) {
        try {
          // Initialize Supabase with the current config values
          initializeSupabase(connectionConfig.url, connectionConfig.apiKey);
          
          const { data, error } = await supabase.from('pharmacy_info').select('*').limit(1);
          if (!error) {
            setIsConnected(true);
            toast.success("Already connected to Supabase");
          }
        } catch (error) {
          // Connection failed, but no need to show an error since we're just checking
        }
      }
    };
    
    checkConnection();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionConfig((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = async () => {
    if (!connectionConfig.url || !connectionConfig.apiKey) {
      toast.error("Supabase URL and API Key are required");
      return;
    }
    
    setIsLoading(true);
    toast.loading("Connecting to Supabase...");
    
    try {
      // Initialize Supabase with the new credentials
      initializeSupabase(connectionConfig.url, connectionConfig.apiKey);
      
      // Test the connection by making a simple query
      const { data, error } = await supabase.from('pharmacy_info').select('*').limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          // This is an expected error if the table doesn't exist yet
          setIsConnected(true);
          toast.success("Connected to Supabase successfully. Please create the required tables.");
        } else {
          toast.error("Connection failed: " + error.message);
        }
        setIsLoading(false);
        return;
      }
      
      setIsConnected(true);
      toast.success("Successfully connected to Supabase");
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
            Find this in your Supabase project settings
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
      <CardFooter className="flex justify-end">
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
