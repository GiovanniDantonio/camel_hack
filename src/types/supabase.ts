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
      attack_logs: {
        Row: {
          attack_id: string
          created_at: string | null
          id: string
          message: string
          stage: string | null
        }
        Insert: {
          attack_id: string
          created_at?: string | null
          id?: string
          message: string
          stage?: string | null
        }
        Update: {
          attack_id?: string
          created_at?: string | null
          id?: string
          message?: string
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attack_logs_attack_id_fkey"
            columns: ["attack_id"]
            isOneToOne: false
            referencedRelation: "attacks"
            referencedColumns: ["id"]
          },
        ]
      }
      attacks: {
        Row: {
          attack_type: string
          completed_at: string | null
          created_at: string | null
          current_stage: string
          detailed_report: string | null
          execution_logs: string | null
          id: string
          parameters: Json | null
          progress_percentage: number | null
          project_id: string | null
          result_summary: string | null
          started_at: string | null
          status: string
          updated_at: string | null
          vulnerability_id: string | null
        }
        Insert: {
          attack_type: string
          completed_at?: string | null
          created_at?: string | null
          current_stage: string
          detailed_report?: string | null
          execution_logs?: string | null
          id?: string
          parameters?: Json | null
          progress_percentage?: number | null
          project_id?: string | null
          result_summary?: string | null
          started_at?: string | null
          status: string
          updated_at?: string | null
          vulnerability_id?: string | null
        }
        Update: {
          attack_type?: string
          completed_at?: string | null
          created_at?: string | null
          current_stage?: string
          detailed_report?: string | null
          execution_logs?: string | null
          id?: string
          parameters?: Json | null
          progress_percentage?: number | null
          project_id?: string | null
          result_summary?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          vulnerability_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attacks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attacks_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      code_files: {
        Row: {
          branch_name: string | null
          commit_hash: string | null
          content: string | null
          created_at: string | null
          file_path: string
          id: string
          language: string | null
          last_scanned_at: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          branch_name?: string | null
          commit_hash?: string | null
          content?: string | null
          created_at?: string | null
          file_path: string
          id?: string
          language?: string | null
          last_scanned_at?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_name?: string | null
          commit_hash?: string | null
          content?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
          language?: string | null
          last_scanned_at?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_vulnerabilities: {
        Row: {
          created_at: string | null
          created_by: string | null
          cve_code: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cve_code?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cve_code?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_vulnerabilities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      github_profiles: {
        Row: {
          created_at: string
          github_access_token: string | null
          github_avatar_url: string | null
          github_bio: string | null
          github_username: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          github_access_token?: string | null
          github_avatar_url?: string | null
          github_bio?: string | null
          github_username: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          github_access_token?: string | null
          github_avatar_url?: string | null
          github_bio?: string | null
          github_username?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      OLD_projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          repository: Json | null
          repository_description: string | null
          repository_full_name: string
          repository_id: number
          repository_is_private: boolean
          repository_name: string
          scan_frequency: Database["public"]["Enums"]["scan_frequency"]
          target_url: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          repository?: Json | null
          repository_description?: string | null
          repository_full_name: string
          repository_id: number
          repository_is_private?: boolean
          repository_name: string
          scan_frequency?: Database["public"]["Enums"]["scan_frequency"]
          target_url: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          repository?: Json | null
          repository_description?: string | null
          repository_full_name?: string
          repository_id?: number
          repository_is_private?: boolean
          repository_name?: string
          scan_frequency?: Database["public"]["Enums"]["scan_frequency"]
          target_url?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_env_vars: {
        Row: {
          created_at: string | null
          id: string
          key: string
          project_id: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          project_id: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          project_id?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_env_vars_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "OLD_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          env_vars: Json | null
          id: string
          project_name: string
          repository_description: string | null
          repository_full_name: string | null
          repository_id: string | null
          repository_name: string | null
          repository_url: string | null
          scan_frequency: string | null
          target_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          env_vars?: Json | null
          id?: string
          project_name: string
          repository_description?: string | null
          repository_full_name?: string | null
          repository_id?: string | null
          repository_name?: string | null
          repository_url?: string | null
          scan_frequency?: string | null
          target_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          env_vars?: Json | null
          id?: string
          project_name?: string
          repository_description?: string | null
          repository_full_name?: string | null
          repository_id?: string | null
          repository_name?: string | null
          repository_url?: string | null
          scan_frequency?: string | null
          target_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scans: {
        Row: {
          branch: string | null
          commit_hash: string | null
          completed_at: string | null
          created_at: string | null
          current_stage: string | null
          execution_logs: string | null
          files_scanned: number | null
          id: string
          progress_percentage: number | null
          project_id: string | null
          result_summary: string | null
          risk_score: number | null
          scan_type: string
          started_at: string | null
          status: string
          target_components: Json | null
          triggered_by: string | null
          updated_at: string | null
          vulnerabilities_found: number | null
          vulnerability_types: string[] | null
        }
        Insert: {
          branch?: string | null
          commit_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stage?: string | null
          execution_logs?: string | null
          files_scanned?: number | null
          id?: string
          progress_percentage?: number | null
          project_id?: string | null
          result_summary?: string | null
          risk_score?: number | null
          scan_type: string
          started_at?: string | null
          status: string
          target_components?: Json | null
          triggered_by?: string | null
          updated_at?: string | null
          vulnerabilities_found?: number | null
          vulnerability_types?: string[] | null
        }
        Update: {
          branch?: string | null
          commit_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stage?: string | null
          execution_logs?: string | null
          files_scanned?: number | null
          id?: string
          progress_percentage?: number | null
          project_id?: string | null
          result_summary?: string | null
          risk_score?: number | null
          scan_type?: string
          started_at?: string | null
          status?: string
          target_components?: Json | null
          triggered_by?: string | null
          updated_at?: string | null
          vulnerabilities_found?: number | null
          vulnerability_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "scans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_bg_tasks: {
        Row: {
          created_at: string
          data: string | null
          finished: boolean
          id: number
        }
        Insert: {
          created_at?: string
          data?: string | null
          finished?: boolean
          id?: number
        }
        Update: {
          created_at?: string
          data?: string | null
          finished?: boolean
          id?: number
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          affected_components: string[] | null
          code_snippet_lines: string[] | null
          created_at: string | null
          cve: string | null
          description: string | null
          detected_at: string | null
          file_path: string | null
          id: string
          line_end: number | null
          line_start: number | null
          location: string
          project_id: string | null
          prompt: string | null
          reference_urls: string[] | null
          remediation: string | null
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          scan_id: string | null
          severity: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_components?: string[] | null
          code_snippet_lines?: string[] | null
          created_at?: string | null
          cve?: string | null
          description?: string | null
          detected_at?: string | null
          file_path?: string | null
          id?: string
          line_end?: number | null
          line_start?: number | null
          location: string
          project_id?: string | null
          prompt?: string | null
          reference_urls?: string[] | null
          remediation?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          scan_id?: string | null
          severity: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_components?: string[] | null
          code_snippet_lines?: string[] | null
          created_at?: string | null
          cve?: string | null
          description?: string | null
          detected_at?: string | null
          file_path?: string | null
          id?: string
          line_end?: number | null
          line_start?: number | null
          location?: string
          project_id?: string | null
          prompt?: string | null
          reference_urls?: string[] | null
          remediation?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          scan_id?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vulnerabilities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vulnerabilities_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_github_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      save_github_token: {
        Args: { p_github_token: string }
        Returns: undefined
      }
    }
    Enums: {
      attack_status: "pending" | "running" | "completed" | "failed"
      attack_type: "sql_injection" | "xss" | "csrf" | "rce" | "ssrf" | "other"
      scan_frequency: "daily" | "weekly" | "monthly"
      vulnerability_severity: "critical" | "high" | "medium" | "low"
      vulnerability_status: "open" | "in_progress" | "resolved"
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
    Enums: {
      attack_status: ["pending", "running", "completed", "failed"],
      attack_type: ["sql_injection", "xss", "csrf", "rce", "ssrf", "other"],
      scan_frequency: ["daily", "weekly", "monthly"],
      vulnerability_severity: ["critical", "high", "medium", "low"],
      vulnerability_status: ["open", "in_progress", "resolved"],
    },
  },
} as const
