
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Get credentials from localStorage if available, otherwise use empty strings
const SUPABASE_URL = localStorage.getItem('supabaseUrl') || "";
const SUPABASE_PUBLISHABLE_KEY = localStorage.getItem('supabaseKey') || "";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export default supabase;
