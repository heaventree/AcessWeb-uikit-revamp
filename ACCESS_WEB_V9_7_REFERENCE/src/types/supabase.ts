export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key: string
          scopes: string[]
          last_used: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key: string
          scopes?: string[]
          last_used?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key?: string
          scopes?: string[]
          last_used?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_logs: {
        Row: {
          id: string
          api_key_id: string
          endpoint: string
          method: string
          status_code: number
          response_time: number
          created_at: string
        }
        Insert: {
          id?: string
          api_key_id: string
          endpoint: string
          method: string
          status_code: number
          response_time: number
          created_at?: string
        }
        Update: {
          id?: string
          api_key_id?: string
          endpoint?: string
          method?: string
          status_code?: number
          response_time?: number
          created_at?: string
        }
      }
      webhooks: {
        Row: {
          id: string
          user_id: string
          url: string
          events: string[]
          secret: string
          is_active: boolean
          last_triggered: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          events?: string[]
          secret: string
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          events?: string[]
          secret?: string
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      generate_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_api_request: {
        Args: {
          p_api_key_id: string
          p_endpoint: string
          p_method: string
          p_status_code: number
          p_response_time: number
        }
        Returns: string
      }
      trigger_webhooks: {
        Args: {
          p_user_id: string
          p_event: string
          p_payload: Json
        }
        Returns: void
      }
      validate_api_key: {
        Args: {
          api_key: string
        }
        Returns: string
      }
    }
  }
}