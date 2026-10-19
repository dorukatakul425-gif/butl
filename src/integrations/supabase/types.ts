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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievement_acks: {
        Row: {
          achievement_id: string
          acknowledged_at: string
          level: number
          user_id: string
        }
        Insert: {
          achievement_id: string
          acknowledged_at?: string
          level: number
          user_id: string
        }
        Update: {
          achievement_id?: string
          acknowledged_at?: string
          level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_acks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bottle_prices: {
        Row: {
          bottle: string
          price: number
          vip_only: boolean
        }
        Insert: {
          bottle: string
          price: number
          vip_only?: boolean
        }
        Update: {
          bottle?: string
          price?: number
          vip_only?: boolean
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: number
          receiver_id: string | null
          room_id: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          receiver_id?: string | null
          room_id: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          receiver_id?: string | null
          room_id?: number
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      decor_prices: {
        Row: {
          item: string
          price: number
        }
        Insert: {
          item: string
          price: number
        }
        Update: {
          item?: string
          price?: number
        }
        Relationships: []
      }
      gesture_events: {
        Row: {
          created_at: string
          gesture: string
          id: number
          room_id: number
          sender_id: string
        }
        Insert: {
          created_at?: string
          gesture: string
          id?: never
          room_id: number
          sender_id: string
        }
        Update: {
          created_at?: string
          gesture?: string
          id?: never
          room_id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gesture_events_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gesture_events_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gesture_prices: {
        Row: {
          gesture: string
          kisses_required: number
          price: number
          vip_only: boolean
        }
        Insert: {
          gesture: string
          kisses_required?: number
          price: number
          vip_only?: boolean
        }
        Update: {
          gesture?: string
          kisses_required?: number
          price?: number
          vip_only?: boolean
        }
        Relationships: []
      }
      gift_events: {
        Row: {
          created_at: string
          gift_type: string
          id: number
          receiver_id: string
          room_id: number
          seed: number
          sender_id: string
        }
        Insert: {
          created_at?: string
          gift_type: string
          id?: never
          receiver_id: string
          room_id: number
          seed?: number
          sender_id: string
        }
        Update: {
          created_at?: string
          gift_type?: string
          id?: never
          receiver_id?: string
          room_id?: number
          seed?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_events_gift_type_fkey"
            columns: ["gift_type"]
            isOneToOne: false
            referencedRelation: "gift_prices"
            referencedColumns: ["gift_type"]
          },
          {
            foreignKeyName: "gift_events_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_events_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_events_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_prices: {
        Row: {
          gift_type: string
          kisses_required: number
          price: number
          vip_only: boolean
        }
        Insert: {
          gift_type: string
          kisses_required?: number
          price: number
          vip_only?: boolean
        }
        Update: {
          gift_type?: string
          kisses_required?: number
          price?: number
          vip_only?: boolean
        }
        Relationships: []
      }
      gold_packages: {
        Row: {
          bonus: number
          gold: number
          real: number
        }
        Insert: {
          bonus?: number
          gold: number
          real: number
        }
        Update: {
          bonus?: number
          gold?: number
          real?: number
        }
        Relationships: []
      }
      premium_packages: {
        Row: {
          days: number
          id: string
          price: number
        }
        Insert: {
          days: number
          id: string
          price: number
        }
        Update: {
          days?: number
          id?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          daily_bonus_day: number
          daily_bonus_on: string | null
          dat: number
          frame: string
          gold: number
          harem_owner: string | null
          harem_value: number
          id: string
          kisses: number
          male: boolean
          name: string
          owned_items: string[]
          photo_url: string | null
          player_no: number
          premium_until: string | null
          stone: string
          tokens: number
          username: string
          vip_until: string | null
          welcome_gold: boolean
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          daily_bonus_day?: number
          daily_bonus_on?: string | null
          dat?: number
          frame?: string
          gold?: number
          harem_owner?: string | null
          harem_value?: number
          id: string
          kisses?: number
          male?: boolean
          name: string
          owned_items?: string[]
          photo_url?: string | null
          player_no?: never
          premium_until?: string | null
          stone?: string
          tokens?: number
          username: string
          vip_until?: string | null
          welcome_gold?: boolean
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          daily_bonus_day?: number
          daily_bonus_on?: string | null
          dat?: number
          frame?: string
          gold?: number
          harem_owner?: string | null
          harem_value?: number
          id?: string
          kisses?: number
          male?: boolean
          name?: string
          owned_items?: string[]
          photo_url?: string | null
          player_no?: never
          premium_until?: string | null
          stone?: string
          tokens?: number
          username?: string
          vip_until?: string | null
          welcome_gold?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_harem_owner_fkey"
            columns: ["harem_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      room_players: {
        Row: {
          joined_at: string
          last_seen: string
          room_id: number
          seat: number
          user_id: string
        }
        Insert: {
          joined_at?: string
          last_seen?: string
          room_id: number
          seat: number
          user_id: string
        }
        Update: {
          joined_at?: string
          last_seen?: string
          room_id?: number
          seat?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bottle: string
          created_at: string
          decisions: Json
          id: number
          music: Json | null
          phase: string
          phase_at: string
          round: number
          spinner: number | null
          target: number | null
        }
        Insert: {
          bottle?: string
          created_at?: string
          decisions?: Json
          id?: never
          music?: Json | null
          phase?: string
          phase_at?: string
          round?: number
          spinner?: number | null
          target?: number | null
        }
        Update: {
          bottle?: string
          created_at?: string
          decisions?: Json
          id?: never
          music?: Json | null
          phase?: string
          phase_at?: string
          round?: number
          spinner?: number | null
          target?: number | null
        }
        Relationships: []
      }
      table_history: {
        Row: {
          room_id: number
          user_id: string
          visited_at: string
        }
        Insert: {
          room_id: number
          user_id: string
          visited_at?: string
        }
        Update: {
          room_id?: number
          user_id?: string
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_prices: {
        Row: {
          gold: number
          tokens: number
        }
        Insert: {
          gold: number
          tokens: number
        }
        Update: {
          gold?: number
          tokens?: number
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked: string
          blocker: string
          created_at: string
        }
        Insert: {
          blocked: string
          blocker: string
          created_at?: string
        }
        Update: {
          blocked?: string
          blocker?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_fkey"
            columns: ["blocked"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_fkey"
            columns: ["blocker"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_packages: {
        Row: {
          days: number
          id: string
          price: number
        }
        Insert: {
          days: number
          id: string
          price: number
        }
        Update: {
          days?: number
          id?: string
          price?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _do_spin: { Args: { p_room: number }; Returns: boolean }
      _finish_choice: { Args: { p_room: number }; Returns: undefined }
      _has_pair: { Args: { p_room: number }; Returns: boolean }
      _next_seat: { Args: { p_after: number; p_room: number }; Returns: number }
      ack_achievement: {
        Args: { p_id: string; p_level: number }
        Returns: undefined
      }
      block_user: {
        Args: { p_block?: boolean; p_user: string }
        Returns: undefined
      }
      buy_bottle: { Args: { p_bottle: string }; Returns: number }
      buy_decor: { Args: { p_item: string }; Returns: number }
      buy_gold: { Args: { p_real: number }; Returns: number }
      buy_premium: { Args: { p_option?: string }; Returns: string }
      buy_tokens: { Args: { p_gold: number }; Returns: number }
      buy_vip: { Args: { p_option: string }; Returns: string }
      change_table: {
        Args: { p_room?: number }
        Returns: {
          room_id: number
          seat: number
        }[]
      }
      claim_daily_bonus: { Args: never; Returns: Json }
      decide: { Args: { p_kiss: boolean }; Returns: undefined }
      harem_purchase: { Args: { p_target: string }; Returns: Json }
      heartbeat: { Args: never; Returns: undefined }
      join_room: {
        Args: never
        Returns: {
          room_id: number
          seat: number
        }[]
      }
      leave_room: { Args: never; Returns: undefined }
      list_tables: {
        Args: never
        Returns: {
          bottle: string
          is_current: boolean
          men: number
          room_id: number
          women: number
        }[]
      }
      my_achievements: {
        Args: never
        Returns: {
          achievement_id: string
          acknowledged_at: string
          level: number
        }[]
      }
      my_room: { Args: never; Returns: number }
      play_music: { Args: { p_item: Json; p_service: string }; Returns: number }
      room_tick: { Args: { p_room: number }; Returns: undefined }
      send_chat: {
        Args: { p_receiver?: string; p_text: string }
        Returns: undefined
      }
      send_gesture: { Args: { p_gesture: string }; Returns: number }
      send_gift: {
        Args: { p_gift: string; p_receivers: string[]; p_seed?: number }
        Returns: number
      }
      server_now: { Args: never; Returns: string }
      set_decor: {
        Args: { p_frame: string; p_stone: string }
        Returns: undefined
      }
      spin_bottle: { Args: never; Returns: number }
      top_players: {
        Args: { p_period?: string; p_section: string }
        Returns: {
          id: string
          male: boolean
          name: string
          photo_url: string
          rank: number
          score: number
        }[]
      }
      user_achievements: {
        Args: { p_user: string }
        Returns: {
          achievement_id: string
          level: number
        }[]
      }
      user_profile_stats: { Args: { p_user: string }; Returns: Json }
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
