export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agreements: {
        Row: {
          created_at: string | null
          description: string | null
          document_url: string | null
          end_date: string
          grant_id: string | null
          id: string
          parties: string[]
          start_date: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          end_date: string
          grant_id?: string | null
          id?: string
          parties: string[]
          start_date: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string
          grant_id?: string | null
          id?: string
          parties?: string[]
          start_date?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grant_opportunities: {
        Row: {
          application_url: string | null
          category: string
          created_at: string | null
          deadline: string
          description: string
          eligibility: string
          funding_amount: number
          funding_source: string
          id: string
          posted_by: string | null
          posted_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          category: string
          created_at?: string | null
          deadline: string
          description: string
          eligibility: string
          funding_amount: number
          funding_source: string
          id?: string
          posted_by?: string | null
          posted_date?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          category?: string
          created_at?: string | null
          deadline?: string
          description?: string
          eligibility?: string
          funding_amount?: number
          funding_source?: string
          id?: string
          posted_by?: string | null
          posted_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      grant_reports: {
        Row: {
          comments: string | null
          created_at: string | null
          due_date: string
          grant_id: string | null
          id: string
          status: string
          submission_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          due_date: string
          grant_id?: string | null
          id?: string
          status: string
          submission_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          due_date?: string
          grant_id?: string | null
          id?: string
          status?: string
          submission_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_reports_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          department: string | null
          description: string
          end_date: string
          funding_source: string
          id: string
          researcher_id: string
          researcher_name: string | null
          review_comments: string | null
          reviewed_by: string | null
          reviewed_date: string | null
          start_date: string
          status: string
          submitted_by: string | null
          submitted_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          department?: string | null
          description: string
          end_date: string
          funding_source: string
          id?: string
          researcher_id: string
          researcher_name?: string | null
          review_comments?: string | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          start_date: string
          status: string
          submitted_by?: string | null
          submitted_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          department?: string | null
          description?: string
          end_date?: string
          funding_source?: string
          id?: string
          researcher_id?: string
          researcher_name?: string | null
          review_comments?: string | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          start_date?: string
          status?: string
          submitted_by?: string | null
          submitted_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      intellectual_property: {
        Row: {
          created_at: string | null
          description: string | null
          filing_date: string
          grant_id: string | null
          id: string
          registration_number: string
          researchers: string[]
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          filing_date: string
          grant_id?: string | null
          id?: string
          registration_number: string
          researchers: string[]
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          filing_date?: string
          grant_id?: string | null
          id?: string
          registration_number?: string
          researchers?: string[]
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intellectual_property_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          related_type: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          related_type?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          related_type?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
