
// This file provides a typed version of the Supabase client
import { supabase } from './client';
import type { Database } from './types';

// Export a typed version of the supabase client
export const db = supabase;
