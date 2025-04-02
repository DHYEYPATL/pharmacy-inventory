
import { createClient } from '@supabase/supabase-js';

// Initialize with values from your Supabase project
const supabaseUrl = 'https://pvzkcqbiucnukazcmkfh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emtjcWJpdWNudWthemNta2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTQxNTMsImV4cCI6MjA1OTE5MDE1M30.BUvL7jUUvxqs-5YQoKP89-clX7HsOf9yshfcmjRdBF0';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to update the Supabase client with new credentials (kept for backward compatibility)
export const initializeSupabase = (url: string, key: string) => {
  return createClient(url, key);
};

export default supabase;
