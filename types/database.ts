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
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
          expires_at: string | null
          is_active: boolean | null
          allow_multiple_votes: boolean | null
          is_anonymous: boolean | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          allow_multiple_votes?: boolean | null
          is_anonymous?: boolean | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          allow_multiple_votes?: boolean | null
          is_anonymous?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          option_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          option_order?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          option_order?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          voter_ip: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          voter_ip?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          voter_ip?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      poll_results: {
        Row: {
          poll_id: string | null
          title: string | null
          option_id: string | null
          option_text: string | null
          option_order: number | null
          vote_count: number | null
          percentage: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_poll_with_options: {
        Args: {
          poll_uuid: string
        }
        Returns: Json
      }
      user_has_voted: {
        Args: {
          poll_uuid: string
          user_uuid?: string
        }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Type aliases for easier use
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollUpdate = Database['public']['Tables']['polls']['Update']

export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

export type PollResult = Database['public']['Views']['poll_results']['Row']

// Additional types for the application
export interface PollWithOptions extends Poll {
  options: PollOption[]
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
  allowMultipleVotes?: boolean
  isAnonymous?: boolean
}

export interface VoteData {
  poll_id: string
  option_id: string
  user_id: string
}

export interface PollResponse {
  success: boolean
  message: string
  poll?: Poll
  error?: string
}