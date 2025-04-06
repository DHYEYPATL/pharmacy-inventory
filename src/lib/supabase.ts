
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Only create a Supabase client when credentials are properly set
const createSupabaseClient = () => {
  const SUPABASE_URL = localStorage.getItem('supabaseUrl');
  const SUPABASE_PUBLISHABLE_KEY = localStorage.getItem('supabaseKey');
  
  // Only create a real client if we have valid credentials
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && 
      SUPABASE_URL.trim() !== "" && SUPABASE_PUBLISHABLE_KEY.trim() !== "") {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  
  // Return null when no valid credentials are available
  return null;
};

export const supabase = createSupabaseClient();
export default supabase;
