
// This file provides a typed version of the Supabase client
import { supabase } from './client';
import type { Database } from '@/types/supabaseTypes';

// Export a typed version of the supabase client
export const db = supabase as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient<Database>>;
