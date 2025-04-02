import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionConfig {
  url: string;
  apiKey: string;
}

const DatabaseConnection: React.FC = () => {
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    url: "https://pvzkcqbiucnukazcmkfh.supabase.co",
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emtjcWJpdWNudWthemNta2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTQxNTMsImV4cCI6MjA1OTE5MDE1M30.BUvL7jUUvxqs-5YQoKP89-clX7HsOf9yshfcmjRdBF0"
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (connectionConfig.url && connectionConfig.apiKey) {
      setIsLoading(true);
      try {
        // Try to connect to inventory table since we know it exists now
        const { data, error } = await supabase
          .from('inventory')
          .select('drug_id')
          .limit(1);
        
        if (!error) {
          setIsConnected(true);
          toast.success("Successfully connected to Supabase");
        } else {
          if (error.code === 'PGRST116') {
            toast.info("Connected to Supabase, but inventory table not found. Create tables first.");
          } else {
            toast.error("Connection error: " + error.message);
          }
        }
      } catch (error) {
        toast.error("Connection failed: " + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionConfig(prev => ({
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
      // Try to connect to inventory table
      const { data, error } = await supabase
        .from('inventory')
        .select('drug_id')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          setIsConnected(true);
          toast.success("Connected to Supabase. Please create the required tables.");
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
