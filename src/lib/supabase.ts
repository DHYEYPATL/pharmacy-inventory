
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Create a dummy client when credentials are not yet available
// This allows the app to initialize without errors
const createSupabaseClient = () => {
  const SUPABASE_URL = localStorage.getItem('supabaseUrl') || "";
  const SUPABASE_PUBLISHABLE_KEY = localStorage.getItem('supabaseKey') || "";
  
  // Only create a real client if we have credentials
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  
  // Return null when no credentials are available
  return null;
};

export const supabase = createSupabaseClient();
export default supabase;
