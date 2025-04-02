
import { createClient } from '@supabase/supabase-js';

// Initialize with empty values that will be updated later
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a Supabase client with initial values
export let supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Function to update the Supabase client with new credentials
export const initializeSupabase = (url: string, key: string) => {
  supabaseUrl = url;
  supabaseAnonKey = key;
  supabase = createClient(url, key);
  
  // Return the client for convenience
  return supabase;
};

export default supabase;
