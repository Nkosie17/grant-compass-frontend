
// This file provides a typed version of the Supabase client
import { supabase } from './client';
import type { Database } from '@/types/supabaseTypes';

// Export a typed version of the supabase client
export const db = supabase as unknown as ReturnType<typeof supabase.from> & {
  from<T extends keyof Database['public']['Tables']>(
    table: T
  ): ReturnType<typeof supabase.from<T>>;
};

