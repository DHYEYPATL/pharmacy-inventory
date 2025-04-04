
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://pvzkcqbiucnukazcmkfh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emtjcWJpdWNudWthemNta2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTQxNTMsImV4cCI6MjA1OTE5MDE1M30.BUvL7jUUvxqs-5YQoKP89-clX7HsOf9yshfcmjRdBF0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export default supabase;
