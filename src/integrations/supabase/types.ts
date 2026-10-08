export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      guestnotes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          notepage_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          notepage_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          notepage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestnotes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guestnotes_notepage_id_fkey"
            columns: ["notepage_id"]
            isOneToOne: false
            referencedRelation: "notepages"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          note_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          note_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      note_notetags: {
        Row: {
          note_id: string
          notetag_id: string
        }
        Insert: {
          note_id: string
          notetag_id: string
        }
        Update: {
          note_id?: string
          notetag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_notetags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_notetags_notetag_id_fkey"
            columns: ["notetag_id"]
            isOneToOne: false
            referencedRelation: "notetags"
            referencedColumns: ["id"]
          },
        ]
      }
      notepages: {
        Row: {
          accent: string
          bg: string
          body_font: string
          cover_path: string | null
          created_at: string
          description: string
          hand_font: string
          heading_font: string
          id: string
          ink: string
          name: string
          owner_id: string
          paid_until: string | null
          slug: string
        }
        Insert: {
          accent?: string
          bg?: string
          body_font?: string
          cover_path?: string | null
          created_at?: string
          description?: string
          hand_font?: string
          heading_font?: string
          id?: string
          ink?: string
          name: string
          owner_id: string
          paid_until?: string | null
          slug: string
        }
        Update: {
          accent?: string
          bg?: string
          body_font?: string
          cover_path?: string | null
          created_at?: string
          description?: string
          hand_font?: string
          heading_font?: string
          id?: string
          ink?: string
          name?: string
          owner_id?: string
          paid_until?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "notepages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string
          created_at: string
          html: string
          id: string
          notepage_id: string
          preview: string
          published_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          html?: string
          id?: string
          notepage_id: string
          preview?: string
          published_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          html?: string
          id?: string
          notepage_id?: string
          preview?: string
          published_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_notepage_id_fkey"
            columns: ["notepage_id"]
            isOneToOne: false
            referencedRelation: "notepages"
            referencedColumns: ["id"]
          },
        ]
      }
      notetags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string
          country: string
          country_code: string
          created_at: string
          display_name: string
          id: string
          interests: string[]
          links: Json
          portrait_url: string | null
        }
        Insert: {
          bio?: string
          country?: string
          country_code?: string
          created_at?: string
          display_name?: string
          id: string
          interests?: string[]
          links?: Json
          portrait_url?: string | null
        }
        Update: {
          bio?: string
          country?: string
          country_code?: string
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[]
          links?: Json
          portrait_url?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
