
// This file provides a typed version of the Supabase client
import { createClient } from '@supabase/supabase-js';
import { supabase } from './client';
import type { Database } from '@/types/supabaseTypes';

// Export a typed version of the supabase client to use in place of the regular client
// This provides better TypeScript support for the database tables
export const db = supabase;

// Helper function to get a typed table reference
export function useTable<T extends keyof Database['public']['Tables']>(tableName: T) {
  return supabase.from<Database['public']['Tables'][T]['Row']>(tableName);
}
