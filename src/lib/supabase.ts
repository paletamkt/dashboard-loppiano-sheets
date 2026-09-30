import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zuwnaejrihlhdmbwoirw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d25hZWpyaWhsaGRtYndvaXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDcxMzQsImV4cCI6MjA5MjEyMzEzNH0.Jr2YWcIxYr8naMdhwziEIWgGVWKTeLwqFnFglB8s5LA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
