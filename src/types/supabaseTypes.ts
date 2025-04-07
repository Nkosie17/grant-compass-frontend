
// Custom Supabase types to extend the generated types
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

// Re-export the basic database type
export type Database = GeneratedDatabase & {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'researcher' | 'grant_office' | 'admin';
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'researcher' | 'grant_office' | 'admin';
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'researcher' | 'grant_office' | 'admin';
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      grants: {
        Row: {
          id: string;
          title: string;
          description: string;
          amount: number;
          start_date: string;
          end_date: string;
          status: string;
          category: string;
          funding_source: string;
          submitted_by: string | null;
          submitted_date: string | null;
          researcher_id: string;
          researcher_name: string | null;
          department: string | null;
          review_comments: string | null;
          reviewed_by: string | null;
          reviewed_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      grant_opportunities: {
        Row: {
          id: string;
          title: string;
          description: string;
          funding_amount: number;
          deadline: string;
          eligibility: string;
          category: string;
          funding_source: string;
          application_url: string | null;
          posted_by: string | null;
          posted_date: string;
          created_at: string;
          updated_at: string;
        };
      };
      intellectual_property: {
        Row: {
          id: string;
          title: string;
          type: string;
          registration_number: string;
          filing_date: string;
          grant_id: string;
          researchers: string[];
          status: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: string;
          registration_number: string;
          filing_date: string;
          grant_id: string;
          researchers: string[];
          status: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: string;
          registration_number?: string;
          filing_date?: string;
          grant_id?: string;
          researchers?: string[];
          status?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      agreements: {
        Row: {
          id: string;
          title: string;
          type: string;
          grant_id: string;
          parties: string[];
          start_date: string;
          end_date: string;
          status: string;
          description: string | null;
          document_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          is_read: boolean;
          related_id: string | null;
          related_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          is_read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
      };
      grant_reports: {
        Row: {
          id: string;
          grant_id: string;
          title: string;
          due_date: string;
          submission_date: string | null;
          status: string;
          comments: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};

// Create a custom typed version of the supabase client
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>;

// Import this to avoid type errors
import { createClient } from '@supabase/supabase-js';
