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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      Admins: {
        Row: {
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: []
      }
      Badges: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: number
          steps: number | null
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: number
          steps?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: number
          steps?: number | null
          type?: string | null
        }
        Relationships: []
      }
      Competitions: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          invite_key: string | null
          is_private: boolean | null
          name: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          invite_key?: string | null
          is_private?: boolean | null
          name?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          invite_key?: string | null
          is_private?: boolean | null
          name?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      Steps: {
        Row: {
          competition_id: number | null
          created_at: string
          date: string | null
          id: number
          steps: number | null
          user_id: string | null
        }
        Insert: {
          competition_id?: number | null
          created_at?: string
          date?: string | null
          id?: number
          steps?: number | null
          user_id?: string | null
        }
        Update: {
          competition_id?: number | null
          created_at?: string
          date?: string | null
          id?: number
          steps?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Steps_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "Competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Steps_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users_Meta"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Teams: {
        Row: {
          created_at: string
          id: number
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Users_Badges: {
        Row: {
          badge_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          badge_id: number
          created_at?: string
          user_id?: string
        }
        Update: {
          badge_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Users_Badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "Badges"
            referencedColumns: ["id"]
          },
        ]
      }
      Users_Goals: {
        Row: {
          competition_id: number
          goal_meters: number | null
          goal_steps: number | null
          user_id: string
        }
        Insert: {
          competition_id: number
          goal_meters?: number | null
          goal_steps?: number | null
          user_id: string
        }
        Update: {
          competition_id?: number
          goal_meters?: number | null
          goal_steps?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Users_Goals_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "Competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      Users_Meta: {
        Row: {
          created_at: string
          display_name: string | null
          profile_image_url: string | null
          step_length: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          profile_image_url?: string | null
          step_length?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          profile_image_url?: string | null
          step_length?: number | null
          user_id?: string
        }
        Relationships: []
      }
      Users_Teams: {
        Row: {
          created_at: string
          id: number
          team_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          team_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          team_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_Teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_team_members: {
        Args: { team_id_param: number }
        Returns: {
          display_name: string
          profile_image_url: string
          user_id: string
        }[]
      }
      get_top_teams: {
        Args: { p_competition_id: number; p_limit: number }
        Returns: {
          avg_steps_per_member: number
          id: number
          member_count: number
          member_ids: string
          name: string
          total_steps: number
          user_id: string
        }[]
      }
      get_top_users_by_steps: {
        Args: { p_competition_id: number; p_limit: number }
        Returns: {
          badge_icons: string
          display_name: string
          profile_image_url: string
          total_steps: number
        }[]
      }
      get_user_leaderboard_position: {
        Args: { in_competition_id: number; in_user_id: string }
        Returns: {
          total: number
          user_id: string
          user_position: number
        }[]
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
