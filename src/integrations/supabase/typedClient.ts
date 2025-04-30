
// This file provides a typed version of the Supabase client
import { createClient } from '@supabase/supabase-js';
import { supabase } from './client';
import type { Database } from '@/types/supabaseTypes';

// Export a typed version of the supabase client to use in place of the regular client
// This provides better TypeScript support for the database tables
export const db = supabase;

// Helper function to get a typed table reference - fixed type parameters
export function useTable<
  TableName extends keyof Database['public']['Tables'],
  RowType = Database['public']['Tables'][TableName]['Row']
>(tableName: TableName) {
  return supabase.from(tableName);
}
