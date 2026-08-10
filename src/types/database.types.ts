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
      flash_card_decks: {
        Row: {
          area_id: number
          created_at: string
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          area_id: number
          created_at?: string
          id?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          area_id?: number
          created_at?: string
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flash_card_decks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "subject_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flash_card_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      flash_cards: {
        Row: {
          answer: string
          created_at: string
          deck_id: number
          id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          deck_id: number
          id?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          deck_id?: number
          id?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flash_cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "flash_card_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_answer_keys: {
        Row: {
          correct_option_id: number
          session_question_id: number
        }
        Insert: {
          correct_option_id: number
          session_question_id: number
        }
        Update: {
          correct_option_id?: number
          session_question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_session_answer_keys_session_question_id_fkey"
            columns: ["session_question_id"]
            isOneToOne: true
            referencedRelation: "game_session_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_flash_card_answer_keys: {
        Row: {
          correct_answer: string
          session_flash_card_id: number
        }
        Insert: {
          correct_answer: string
          session_flash_card_id: number
        }
        Update: {
          correct_answer?: string
          session_flash_card_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_session_flash_card_answer_keys_session_flash_card_id_fkey"
            columns: ["session_flash_card_id"]
            isOneToOne: true
            referencedRelation: "game_session_flash_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_flash_cards: {
        Row: {
          card_order: number
          deadline_at: string | null
          flash_card_id: number | null
          id: number
          presented_at: string | null
          question_text: string
          response_time_ms: number | null
          result: string | null
          resolved_at: string | null
          reveal_at: string | null
          session_id: string
          status: string
          submitted_answer: string | null
          submitted_at: string | null
        }
        Insert: {
          card_order: number
          deadline_at?: string | null
          flash_card_id?: number | null
          id?: number
          presented_at?: string | null
          question_text: string
          response_time_ms?: number | null
          result?: string | null
          resolved_at?: string | null
          reveal_at?: string | null
          session_id: string
          status?: string
          submitted_answer?: string | null
          submitted_at?: string | null
        }
        Update: {
          card_order?: number
          deadline_at?: string | null
          flash_card_id?: number | null
          id?: number
          presented_at?: string | null
          question_text?: string
          response_time_ms?: number | null
          result?: string | null
          resolved_at?: string | null
          reveal_at?: string | null
          session_id?: string
          status?: string
          submitted_answer?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_session_flash_cards_flash_card_id_fkey"
            columns: ["flash_card_id"]
            isOneToOne: false
            referencedRelation: "flash_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_flash_cards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_questions: {
        Row: {
          deadline_at: string | null
          id: number
          options: Json
          presented_at: string | null
          question_id: number | null
          question_order: number
          question_set_id: number | null
          question_text: string
          response_time_ms: number | null
          result: string | null
          resolved_at: string | null
          reveal_at: string | null
          selected_option_id: number | null
          session_id: string
          status: string
          subject_id: number | null
          subject_name: string
          submitted_at: string | null
        }
        Insert: {
          deadline_at?: string | null
          id?: number
          options: Json
          presented_at?: string | null
          question_id?: number | null
          question_order: number
          question_set_id?: number | null
          question_text: string
          response_time_ms?: number | null
          result?: string | null
          resolved_at?: string | null
          reveal_at?: string | null
          selected_option_id?: number | null
          session_id: string
          status?: string
          subject_id?: number | null
          subject_name: string
          submitted_at?: string | null
        }
        Update: {
          deadline_at?: string | null
          id?: number
          options?: Json
          presented_at?: string | null
          question_id?: number | null
          question_order?: number
          question_set_id?: number | null
          question_text?: string
          response_time_ms?: number | null
          result?: string | null
          resolved_at?: string | null
          reveal_at?: string | null
          selected_option_id?: number | null
          session_id?: string
          status?: string
          subject_id?: number | null
          subject_name?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_session_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_questions_question_set_id_fkey"
            columns: ["question_set_id"]
            isOneToOne: false
            referencedRelation: "question_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          activity_stats_recorded_at: string | null
          area_id: number | null
          area_name: string
          current_question_order: number
          difficulty: string | null
          end_reason: string | null
          ended_at: string | null
          flash_card_deck_id: number | null
          game_type: string
          id: string
          prepared_at: string
          session_type: string
          started_at: string | null
          status: string
          timer_seconds: number
          total_questions: number
          user_id: string
        }
        Insert: {
          activity_stats_recorded_at?: string | null
          area_id?: number | null
          area_name: string
          current_question_order?: number
          difficulty?: string | null
          end_reason?: string | null
          ended_at?: string | null
          flash_card_deck_id?: number | null
          game_type: string
          id?: string
          prepared_at?: string
          session_type?: string
          started_at?: string | null
          status?: string
          timer_seconds: number
          total_questions?: number
          user_id: string
        }
        Update: {
          activity_stats_recorded_at?: string | null
          area_id?: number | null
          area_name?: string
          current_question_order?: number
          difficulty?: string | null
          end_reason?: string | null
          ended_at?: string | null
          flash_card_deck_id?: number | null
          game_type?: string
          id?: string
          prepared_at?: string
          session_type?: string
          started_at?: string | null
          status?: string
          timer_seconds?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "subject_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_flash_card_deck_id_fkey"
            columns: ["flash_card_deck_id"]
            isOneToOne: false
            referencedRelation: "flash_card_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviewee_activity_stats: {
        Row: {
          completed_sessions: number
          created_at: string
          last_review_activity_date: string | null
          review_streak_days: number
          total_answered_items: number
          total_correct_answers: number
          total_sessions: number
          total_study_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_sessions?: number
          created_at?: string
          last_review_activity_date?: string | null
          review_streak_days?: number
          total_answered_items?: number
          total_correct_answers?: number
          total_sessions?: number
          total_study_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_sessions?: number
          created_at?: string
          last_review_activity_date?: string | null
          review_streak_days?: number
          total_answered_items?: number
          total_correct_answers?: number
          total_sessions?: number
          total_study_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewee_activity_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviewee_invitation_email_logs: {
        Row: {
          delivery_status: string
          email: string
          id: number
          invitation_type: string
          requested_at: string
          requested_by: string
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          delivery_status?: string
          email: string
          id?: number
          invitation_type: string
          requested_at?: string
          requested_by: string
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          delivery_status?: string
          email?: string
          id?: number
          invitation_type?: string
          requested_at?: string
          requested_by?: string
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          created_at: string
          id: number
          is_correct: boolean
          option_text: string
          question_id: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_correct?: boolean
          option_text: string
          question_id: number
          sort_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_correct?: boolean
          option_text?: string
          question_id?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_sets: {
        Row: {
          created_at: string
          difficulty: string | null
          game_type: string
          id: number
          subject_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          game_type: string
          id?: number
          subject_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          game_type?: string
          id?: number
          subject_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_sets_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: number
          question_set_id: number
          question_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          question_set_id: number
          question_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          question_set_id?: number
          question_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_question_set_id_fkey"
            columns: ["question_set_id"]
            isOneToOne: false
            referencedRelation: "question_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: number
          role_id: number
        }
        Insert: {
          permission_id: number
          role_id: number
        }
        Update: {
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      subject_areas: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          area_id: number
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          area_id: number
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Update: {
          area_id?: number
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "subject_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      trivias: {
        Row: {
          content: string
          created_at: string
          id: number
          publish_date: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          publish_date: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          publish_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role_id: number
          user_id: string
        }
        Insert: {
          id?: number
          role_id: number
          user_id?: string
        }
        Update: {
          id?: number
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey1"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          account_setup_completed_at: string | null
          email: string
          full_name: string
          mode_of_review: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          account_setup_completed_at?: string | null
          email?: string
          full_name: string
          mode_of_review?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Update: {
          account_setup_completed_at?: string | null
          email?: string
          full_name?: string
          mode_of_review?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advance_flash_card_session: {
        Args: { selected_session_id: string }
        Returns: Json
      }
      advance_quiz_session: {
        Args: { selected_session_id: string }
        Returns: Json
      }
      claim_reviewee_invitation: {
        Args: {
          selected_email: string
          selected_invitation_type: string
          selected_requested_by: string
          selected_user_id: string | null
        }
        Returns: Json
      }
      complete_reviewee_invitation: {
        Args: {
          selected_log_id: number
          selected_user_id: string | null
          was_sent: boolean
        }
        Returns: undefined
      }
      exit_flash_card_session: {
        Args: { selected_session_id: string }
        Returns: Json
      }
      exit_quiz_session: {
        Args: { selected_session_id: string }
        Returns: Json
      }
      flash_card_reviewee_user_id: { Args: never; Returns: string }
      flash_card_session_summary: {
        Args: {
          authenticated_user_id: string
          selected_session_id: string
        }
        Returns: Json
      }
      get_user_roles: { Args: { uid: string }; Returns: string[] }
      get_activity_history_details: {
        Args: { selected_session_id: string }
        Returns: Json
      }
      has_permission: { Args: { perm: string; uid: string }; Returns: boolean }
      jwt_custom_claims: { Args: { event: Json }; Returns: Json }
      normalize_flash_card_answer: {
        Args: { selected_answer: string }
        Returns: string
      }
      preview_flash_card_session: {
        Args: { selected_area_id: number }
        Returns: Json
      }
      preview_paes_quiz_session: {
        Args: { selected_subject_id: number }
        Returns: Json
      }
      preview_quiz_session: {
        Args: {
          selected_area_id: number
          selected_difficulty: string
          selected_game_type: string
        }
        Returns: Json
      }
      quiz_reviewee_user_id: { Args: never; Returns: string }
      quiz_session_summary: {
        Args: {
          authenticated_user_id: string
          selected_session_id: string
        }
        Returns: Json
      }
      quiz_timer_seconds: {
        Args: {
          selected_difficulty: string
          selected_game_type: string
        }
        Returns: number
      }
      reveal_flash_card_answer: {
        Args: { selected_session_flash_card_id: number }
        Returns: Json
      }
      reveal_quiz_answer: {
        Args: { selected_session_question_id: number }
        Returns: Json
      }
      start_flash_card_session_after_countdown: {
        Args: { selected_area_id: number }
        Returns: Json
      }
      start_paes_quiz_session_after_countdown: {
        Args: { selected_subject_id: number }
        Returns: Json
      }
      start_quiz_session_after_countdown: {
        Args: {
          selected_area_id: number
          selected_difficulty: string
          selected_game_type: string
        }
        Returns: Json
      }
      submit_flash_card_answer: {
        Args: {
          selected_answer: string
          selected_session_flash_card_id: number
        }
        Returns: Json
      }
      submit_quiz_answer: {
        Args: {
          selected_option_id: number
          selected_session_question_id: number
        }
        Returns: Json
      }
      timeout_flash_card: {
        Args: { selected_session_flash_card_id: number }
        Returns: Json
      }
      timeout_quiz_question: {
        Args: { selected_session_question_id: number }
        Returns: Json
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
