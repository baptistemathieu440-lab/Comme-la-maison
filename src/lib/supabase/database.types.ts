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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json
          id: number
          is_demo: boolean
          occurred_at: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json
          id?: never
          is_demo?: boolean
          occurred_at?: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json
          id?: never
          is_demo?: boolean
          occurred_at?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          config: Json
          description: string
          enabled: boolean
          event_type: string
          key: string
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config?: Json
          description: string
          enabled?: boolean
          event_type: string
          key: string
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config?: Json
          description?: string
          enabled?: boolean
          event_type?: string
          key?: string
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          created_at: string
          error: string | null
          event_id: number | null
          id: number
          result: Json
          rule_key: string
          status: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id?: number | null
          id?: never
          result?: Json
          rule_key: string
          status: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: number | null
          id?: never
          result?: Json
          rule_key?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "domain_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_rule_key_fkey"
            columns: ["rule_key"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["key"]
          },
        ]
      }
      bookings: {
        Row: {
          adults: number
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          children: number
          cleaning_fee_cents: number
          commission_base_cents: number
          commission_cents: number
          commission_rate_bps: number | null
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          external_ref: string | null
          guest_id: string | null
          ical_uid: string | null
          id: string
          internal_notes: string | null
          is_demo: boolean
          listing_id: string | null
          nights: number | null
          nights_amount_cents: number
          owner_net_cents: number
          platform_fee_cents: number
          platform_id: string
          property_id: string
          reference: string
          search_text: string | null
          source: string
          statement_id: string | null
          status: string
          stay: unknown
          tourist_tax_cents: number
          updated_at: string
        }
        Insert: {
          adults?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in: string
          check_out: string
          children?: number
          cleaning_fee_cents?: number
          commission_base_cents?: number
          commission_cents?: number
          commission_rate_bps?: number | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          guest_id?: string | null
          ical_uid?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          listing_id?: string | null
          nights?: number | null
          nights_amount_cents?: number
          owner_net_cents?: number
          platform_fee_cents?: number
          platform_id?: string
          property_id: string
          reference?: string
          search_text?: string | null
          source?: string
          statement_id?: string | null
          status?: string
          stay?: unknown
          tourist_tax_cents?: number
          updated_at?: string
        }
        Update: {
          adults?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in?: string
          check_out?: string
          children?: number
          cleaning_fee_cents?: number
          commission_base_cents?: number
          commission_cents?: number
          commission_rate_bps?: number | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          guest_id?: string | null
          ical_uid?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          listing_id?: string | null
          nights?: number | null
          nights_amount_cents?: number
          owner_net_cents?: number
          platform_fee_cents?: number
          platform_id?: string
          property_id?: string
          reference?: string
          search_text?: string | null
          source?: string
          statement_id?: string | null
          status?: string
          stay?: unknown
          tourist_tax_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_statement_fk"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_blocks: {
        Row: {
          booking_id: string | null
          created_at: string
          created_by: string | null
          end_date: string
          external_uid: string | null
          id: string
          is_demo: boolean
          kind: string
          listing_id: string | null
          notes: string | null
          property_id: string
          span: unknown
          start_date: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date: string
          external_uid?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          listing_id?: string | null
          notes?: string | null
          property_id: string
          span?: unknown
          start_date: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          external_uid?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          listing_id?: string | null
          notes?: string | null
          property_id?: string
          span?: unknown
          start_date?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_blocks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_blocks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_blocks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_blocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_blocks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address_line: string | null
          city: string | null
          company_name: string | null
          country: string
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          is_demo: boolean
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          profile_id: string | null
          search_text: string | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_demo?: boolean
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string | null
          search_text?: string | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_demo?: boolean
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string | null
          search_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          commission_rate_bps: number | null
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          is_demo: boolean
          notes: string | null
          owner_id: string
          property_id: string | null
          reference: string | null
          signed_on: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          commission_rate_bps?: number | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          owner_id: string
          property_id?: string | null
          reference?: string | null
          signed_on?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          commission_rate_bps?: number | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          owner_id?: string
          property_id?: string | null
          reference?: string | null
          signed_on?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          booking_id: string | null
          category: string
          created_at: string
          expense_id: string | null
          id: string
          is_demo: boolean
          maintenance_job_id: string | null
          mime_type: string | null
          owner_id: string | null
          property_id: string | null
          search_text: string | null
          size_bytes: number | null
          statement_id: string | null
          storage_path: string
          title: string
          uploaded_by: string | null
          visible_to_owner: boolean
        }
        Insert: {
          booking_id?: string | null
          category?: string
          created_at?: string
          expense_id?: string | null
          id?: string
          is_demo?: boolean
          maintenance_job_id?: string | null
          mime_type?: string | null
          owner_id?: string | null
          property_id?: string | null
          search_text?: string | null
          size_bytes?: number | null
          statement_id?: string | null
          storage_path: string
          title: string
          uploaded_by?: string | null
          visible_to_owner?: boolean
        }
        Update: {
          booking_id?: string | null
          category?: string
          created_at?: string
          expense_id?: string | null
          id?: string
          is_demo?: boolean
          maintenance_job_id?: string | null
          mime_type?: string | null
          owner_id?: string | null
          property_id?: string | null
          search_text?: string | null
          size_bytes?: number | null
          statement_id?: string | null
          storage_path?: string
          title?: string
          uploaded_by?: string | null
          visible_to_owner?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_maintenance_job_id_fkey"
            columns: ["maintenance_job_id"]
            isOneToOne: false
            referencedRelation: "maintenance_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_events: {
        Row: {
          actor_id: string | null
          attempts: number
          created_at: string
          entity_id: string | null
          entity_table: string
          id: number
          is_demo: boolean
          last_error: string | null
          payload: Json
          processed_at: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          attempts?: number
          created_at?: string
          entity_id?: string | null
          entity_table: string
          id?: never
          is_demo?: boolean
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          attempts?: number
          created_at?: string
          entity_id?: string | null
          entity_table?: string
          id?: never
          is_demo?: boolean
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
          type?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_cents: number
          booking_id: string | null
          category: string
          created_at: string
          created_by: string | null
          id: string
          incurred_on: string
          is_demo: boolean
          label: string
          maintenance_job_id: string | null
          notes: string | null
          owner_id: string | null
          paid_by: string
          property_id: string | null
          rebill_to_owner: boolean
          statement_id: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          booking_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          incurred_on?: string
          is_demo?: boolean
          label: string
          maintenance_job_id?: string | null
          notes?: string | null
          owner_id?: string | null
          paid_by?: string
          property_id?: string | null
          rebill_to_owner?: boolean
          statement_id?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          booking_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          incurred_on?: string
          is_demo?: boolean
          label?: string
          maintenance_job_id?: string | null
          notes?: string | null
          owner_id?: string | null
          paid_by?: string
          property_id?: string | null
          rebill_to_owner?: boolean
          statement_id?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_maintenance_job_id_fkey"
            columns: ["maintenance_job_id"]
            isOneToOne: false
            referencedRelation: "maintenance_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_statement_fk"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_places: {
        Row: {
          address: string | null
          area: string
          audiences: string[]
          best_period: string | null
          booking: string
          booking_url: string | null
          budget: number
          car_needed: boolean | null
          created_at: string
          created_by: string | null
          duration: string | null
          good_to_know: string | null
          highlights: string | null
          hours: string | null
          id: string
          internal_notes: string | null
          is_demo: boolean
          is_favorite: boolean
          is_published: boolean
          kind: string
          lat: number | null
          lng: number | null
          maps_url: string | null
          name: string
          photo_alt: string | null
          photo_credit: string | null
          photo_path: string | null
          position: number
          price_note: string | null
          rating: number | null
          rating_count: number | null
          rating_source: string | null
          setting: string
          slug: string
          sources: string[]
          status: string
          subcategory: string | null
          summary: string
          tags: string[]
          tip: string | null
          transport: string | null
          travel_time: string | null
          updated_at: string
          verified_on: string | null
          website_url: string | null
          where_to_eat: string | null
          wine_region: string | null
          zone: string
        }
        Insert: {
          address?: string | null
          area?: string
          audiences?: string[]
          best_period?: string | null
          booking?: string
          booking_url?: string | null
          budget?: number
          car_needed?: boolean | null
          created_at?: string
          created_by?: string | null
          duration?: string | null
          good_to_know?: string | null
          highlights?: string | null
          hours?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          is_favorite?: boolean
          is_published?: boolean
          kind: string
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name: string
          photo_alt?: string | null
          photo_credit?: string | null
          photo_path?: string | null
          position?: number
          price_note?: string | null
          rating?: number | null
          rating_count?: number | null
          rating_source?: string | null
          setting?: string
          slug: string
          sources?: string[]
          status?: string
          subcategory?: string | null
          summary?: string
          tags?: string[]
          tip?: string | null
          transport?: string | null
          travel_time?: string | null
          updated_at?: string
          verified_on?: string | null
          website_url?: string | null
          where_to_eat?: string | null
          wine_region?: string | null
          zone?: string
        }
        Update: {
          address?: string | null
          area?: string
          audiences?: string[]
          best_period?: string | null
          booking?: string
          booking_url?: string | null
          budget?: number
          car_needed?: boolean | null
          created_at?: string
          created_by?: string | null
          duration?: string | null
          good_to_know?: string | null
          highlights?: string | null
          hours?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          is_favorite?: boolean
          is_published?: boolean
          kind?: string
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name?: string
          photo_alt?: string | null
          photo_credit?: string | null
          photo_path?: string | null
          position?: number
          price_note?: string | null
          rating?: number | null
          rating_count?: number | null
          rating_source?: string | null
          setting?: string
          slug?: string
          sources?: string[]
          status?: string
          subcategory?: string | null
          summary?: string
          tags?: string[]
          tip?: string | null
          transport?: string | null
          travel_time?: string | null
          updated_at?: string
          verified_on?: string | null
          website_url?: string | null
          where_to_eat?: string | null
          wine_region?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_places_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          is_demo: boolean
          language: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          is_demo?: boolean
          language?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          language?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_photos: {
        Row: {
          created_at: string
          id: string
          incident_id: string
          is_demo: boolean
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          incident_id: string
          is_demo?: boolean
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          incident_id?: string
          is_demo?: boolean
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_photos_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          is_demo: boolean
          property_id: string
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          search_text: string | null
          severity: string
          status: string
          task_id: string | null
          title: string
          updated_at: string
          visible_to_owner: boolean
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          property_id: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          search_text?: string | null
          severity?: string
          status?: string
          task_id?: string | null
          title: string
          updated_at?: string
          visible_to_owner?: boolean
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          property_id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          search_text?: string | null
          severity?: string
          status?: string
          task_id?: string | null
          title?: string
          updated_at?: string
          visible_to_owner?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "owner_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "staff_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          invited_by: string | null
          owner_id: string | null
          revoked_at: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          full_name?: string
          id?: string
          invited_by?: string | null
          owner_id?: string | null
          revoked_at?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          invited_by?: string | null
          owner_id?: string | null
          revoked_at?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_counters: {
        Row: {
          last_number: number
          prefix: string
          year: number
        }
        Insert: {
          last_number?: number
          prefix: string
          year: number
        }
        Update: {
          last_number?: number
          prefix?: string
          year?: number
        }
        Relationships: []
      }
      listings: {
        Row: {
          created_at: string
          external_id: string | null
          ical_export_token: string
          ical_import_url: string | null
          id: string
          is_demo: boolean
          last_import_at: string | null
          last_import_error: string | null
          last_import_status: string | null
          listing_url: string | null
          notes: string | null
          platform_id: string
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          ical_export_token?: string
          ical_import_url?: string | null
          id?: string
          is_demo?: boolean
          last_import_at?: string | null
          last_import_error?: string | null
          last_import_status?: string | null
          listing_url?: string | null
          notes?: string | null
          platform_id: string
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_id?: string | null
          ical_export_token?: string
          ical_import_url?: string | null
          id?: string
          is_demo?: boolean
          last_import_at?: string | null
          last_import_error?: string | null
          last_import_status?: string | null
          listing_url?: string | null
          notes?: string | null
          platform_id?: string
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_jobs: {
        Row: {
          completed_on: string | null
          cost_cents: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          incident_id: string | null
          is_demo: boolean
          property_id: string
          provider_id: string | null
          scheduled_on: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_on?: string | null
          cost_cents?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          incident_id?: string | null
          is_demo?: boolean
          property_id: string
          provider_id?: string | null
          scheduled_on?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_on?: string | null
          cost_cents?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          incident_id?: string | null
          is_demo?: boolean
          property_id?: string
          provider_id?: string | null
          scheduled_on?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_jobs_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_jobs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_jobs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_deliveries: {
        Row: {
          attempted_at: string
          channel: string
          detail: string | null
          id: string
          notification_id: string
          status: string
        }
        Insert: {
          attempted_at?: string
          channel: string
          detail?: string | null
          id?: string
          notification_id: string
          status: string
        }
        Update: {
          attempted_at?: string
          channel?: string
          detail?: string | null
          id?: string
          notification_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          event_id: number | null
          id: string
          is_demo: boolean
          kind: string
          link: string | null
          read_at: string | null
          recipient_id: string
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          event_id?: number | null
          id?: string
          is_demo?: boolean
          kind: string
          link?: string | null
          read_at?: string | null
          recipient_id: string
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          event_id?: number | null
          id?: string
          is_demo?: boolean
          kind?: string
          link?: string | null
          read_at?: string | null
          recipient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "domain_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_statements: {
        Row: {
          adjustments_cents: number
          booking_count: number
          cleaning_ht_cents: number
          cleaning_rebill_cents: number
          cleaning_vat_cents: number
          commission_base_cents: number
          commission_cents: number
          commission_ht_cents: number
          commission_vat_cents: number
          company_snapshot: Json | null
          created_at: string
          due_on: string | null
          expenses_rebill_cents: number
          finalized_at: string | null
          finalized_by: string | null
          generated_at: string | null
          id: string
          is_demo: boolean
          issued_on: string | null
          nights_amount_cents: number
          nights_count: number
          notes: string | null
          number: string | null
          owner_id: string
          owner_net_cents: number
          owner_snapshot: Json | null
          paid_at: string | null
          pdf_path: string | null
          period_month: string
          platform_fee_cents: number
          sent_at: string | null
          status: string
          total_due_cents: number
          total_vat_cents: number
          updated_at: string
          vat_rate_bps: number
          vat_registered: boolean
        }
        Insert: {
          adjustments_cents?: number
          booking_count?: number
          cleaning_ht_cents?: number
          cleaning_rebill_cents?: number
          cleaning_vat_cents?: number
          commission_base_cents?: number
          commission_cents?: number
          commission_ht_cents?: number
          commission_vat_cents?: number
          company_snapshot?: Json | null
          created_at?: string
          due_on?: string | null
          expenses_rebill_cents?: number
          finalized_at?: string | null
          finalized_by?: string | null
          generated_at?: string | null
          id?: string
          is_demo?: boolean
          issued_on?: string | null
          nights_amount_cents?: number
          nights_count?: number
          notes?: string | null
          number?: string | null
          owner_id: string
          owner_net_cents?: number
          owner_snapshot?: Json | null
          paid_at?: string | null
          pdf_path?: string | null
          period_month: string
          platform_fee_cents?: number
          sent_at?: string | null
          status?: string
          total_due_cents?: number
          total_vat_cents?: number
          updated_at?: string
          vat_rate_bps?: number
          vat_registered?: boolean
        }
        Update: {
          adjustments_cents?: number
          booking_count?: number
          cleaning_ht_cents?: number
          cleaning_rebill_cents?: number
          cleaning_vat_cents?: number
          commission_base_cents?: number
          commission_cents?: number
          commission_ht_cents?: number
          commission_vat_cents?: number
          company_snapshot?: Json | null
          created_at?: string
          due_on?: string | null
          expenses_rebill_cents?: number
          finalized_at?: string | null
          finalized_by?: string | null
          generated_at?: string | null
          id?: string
          is_demo?: boolean
          issued_on?: string | null
          nights_amount_cents?: number
          nights_count?: number
          notes?: string | null
          number?: string | null
          owner_id?: string
          owner_net_cents?: number
          owner_snapshot?: Json | null
          paid_at?: string | null
          pdf_path?: string | null
          period_month?: string
          platform_fee_cents?: number
          sent_at?: string | null
          status?: string
          total_due_cents?: number
          total_vat_cents?: number
          updated_at?: string
          vat_rate_bps?: number
          vat_registered?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "owner_statements_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_statements_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          billing_email: string | null
          commission_rate_bps: number | null
          contact_id: string
          created_at: string
          created_by: string | null
          iban_encrypted: string | null
          iban_holder: string | null
          iban_last4: string | null
          id: string
          is_demo: boolean
          notes: string | null
          sepa_mandate_reference: string | null
          sepa_mandate_signed_on: string | null
          status: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          billing_email?: string | null
          commission_rate_bps?: number | null
          contact_id: string
          created_at?: string
          created_by?: string | null
          iban_encrypted?: string | null
          iban_holder?: string | null
          iban_last4?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          sepa_mandate_reference?: string | null
          sepa_mandate_signed_on?: string | null
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          billing_email?: string | null
          commission_rate_bps?: number | null
          contact_id?: string
          created_at?: string
          created_by?: string | null
          iban_encrypted?: string | null
          iban_holder?: string | null
          iban_last4?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          sepa_mandate_reference?: string | null
          sepa_mandate_signed_on?: string | null
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          created_by: string | null
          id: string
          is_demo: boolean
          method: string
          notes: string | null
          paid_on: string
          reference: string | null
          statement_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          method?: string
          notes?: string | null
          paid_on?: string
          reference?: string | null
          statement_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          method?: string
          notes?: string | null
          paid_on?: string
          reference?: string | null
          statement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          id: string
          name: string
          position: number
        }
        Insert: {
          id: string
          name: string
          position?: number
        }
        Update: {
          id?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address_line: string | null
          bathrooms: number | null
          bedrooms: number | null
          beds: number | null
          capacity: number | null
          check_in_time: string | null
          check_out_time: string | null
          city: string
          cleaning_checklist: Json | null
          commission_rate_bps: number | null
          created_at: string
          created_by: string | null
          default_cleaning_fee_cents: number | null
          description: string | null
          floor_info: string | null
          id: string
          internal_notes: string | null
          is_demo: boolean
          is_primary_residence: boolean
          name: string
          owner_id: string
          postal_code: string | null
          property_type: string
          public_description: string | null
          public_title: string | null
          reference: string
          registration_number: string | null
          search_text: string | null
          slug: string | null
          status: string
          surface_m2: number | null
          updated_at: string
          visible_on_site: boolean
        }
        Insert: {
          address_line?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          beds?: number | null
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          city?: string
          cleaning_checklist?: Json | null
          commission_rate_bps?: number | null
          created_at?: string
          created_by?: string | null
          default_cleaning_fee_cents?: number | null
          description?: string | null
          floor_info?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          is_primary_residence?: boolean
          name: string
          owner_id: string
          postal_code?: string | null
          property_type?: string
          public_description?: string | null
          public_title?: string | null
          reference?: string
          registration_number?: string | null
          search_text?: string | null
          slug?: string | null
          status?: string
          surface_m2?: number | null
          updated_at?: string
          visible_on_site?: boolean
        }
        Update: {
          address_line?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          beds?: number | null
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          city?: string
          cleaning_checklist?: Json | null
          commission_rate_bps?: number | null
          created_at?: string
          created_by?: string | null
          default_cleaning_fee_cents?: number | null
          description?: string | null
          floor_info?: string | null
          id?: string
          internal_notes?: string | null
          is_demo?: boolean
          is_primary_residence?: boolean
          name?: string
          owner_id?: string
          postal_code?: string | null
          property_type?: string
          public_description?: string | null
          public_title?: string | null
          reference?: string
          registration_number?: string | null
          search_text?: string | null
          slug?: string | null
          status?: string
          surface_m2?: number | null
          updated_at?: string
          visible_on_site?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      property_access: {
        Row: {
          access_instructions: string | null
          alarm_code: string | null
          door_code: string | null
          is_demo: boolean
          key_box_code: string | null
          key_box_location: string | null
          parking_info: string | null
          property_id: string
          updated_at: string
          updated_by: string | null
          wifi_name: string | null
          wifi_password: string | null
        }
        Insert: {
          access_instructions?: string | null
          alarm_code?: string | null
          door_code?: string | null
          is_demo?: boolean
          key_box_code?: string | null
          key_box_location?: string | null
          parking_info?: string | null
          property_id: string
          updated_at?: string
          updated_by?: string | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Update: {
          access_instructions?: string | null
          alarm_code?: string | null
          door_code?: string | null
          is_demo?: boolean
          key_box_code?: string | null
          key_box_location?: string | null
          parking_info?: string | null
          property_id?: string
          updated_at?: string
          updated_by?: string | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_access_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_access_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_demo: boolean
          is_public: boolean
          position: number
          property_id: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          is_public?: boolean
          position?: number
          property_id: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          is_public?: boolean
          position?: number
          property_id?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_activities: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_demo: boolean
          kind: string
          prospect_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          prospect_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          prospect_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_activities_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          assigned_to: string | null
          bedrooms: string | null
          capacity: string | null
          contact_id: string
          converted_owner_id: string | null
          created_at: string
          created_by: string | null
          id: string
          is_demo: boolean
          lost_reason: string | null
          message: string | null
          next_action: string | null
          next_action_on: string | null
          property_city: string | null
          property_type: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          bedrooms?: string | null
          capacity?: string | null
          contact_id: string
          converted_owner_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          lost_reason?: string | null
          message?: string | null
          next_action?: string | null
          next_action_on?: string | null
          property_city?: string | null
          property_type?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          bedrooms?: string | null
          capacity?: string | null
          contact_id?: string
          converted_owner_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          lost_reason?: string | null
          message?: string | null
          next_action?: string | null
          next_action_on?: string | null
          property_city?: string | null
          property_type?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_converted_owner_id_fkey"
            columns: ["converted_owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          active: boolean
          contact_id: string
          created_at: string
          id: string
          is_demo: boolean
          notes: string | null
          siret: string | null
          trade: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          contact_id: string
          created_at?: string
          id?: string
          is_demo?: boolean
          notes?: string | null
          siret?: string | null
          trade?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          contact_id?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          notes?: string | null
          siret?: string | null
          trade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string
          key: string
          label: string
        }
        Insert: {
          description?: string
          key: string
          label: string
        }
        Update: {
          description?: string
          key?: string
          label?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          bank_details: string | null
          company_name: string
          default_check_in_time: string
          default_check_out_time: string
          default_cleaning_checklist: Json
          default_commission_bps: number
          email: string | null
          head_office: string | null
          id: boolean
          invoice_prefix: string
          late_penalty_note: string | null
          legal_form: string | null
          legal_name: string | null
          liability_insurance: string | null
          payment_terms_days: number
          phone: string | null
          primary_residence_night_limit: number
          professional_card: string | null
          registration: string | null
          share_capital: string | null
          siren: string | null
          updated_at: string
          updated_by: string | null
          vat_number: string | null
          vat_rate_bps: number
          vat_registered: boolean
          website: string | null
        }
        Insert: {
          bank_details?: string | null
          company_name?: string
          default_check_in_time?: string
          default_check_out_time?: string
          default_cleaning_checklist?: Json
          default_commission_bps?: number
          email?: string | null
          head_office?: string | null
          id?: boolean
          invoice_prefix?: string
          late_penalty_note?: string | null
          legal_form?: string | null
          legal_name?: string | null
          liability_insurance?: string | null
          payment_terms_days?: number
          phone?: string | null
          primary_residence_night_limit?: number
          professional_card?: string | null
          registration?: string | null
          share_capital?: string | null
          siren?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_number?: string | null
          vat_rate_bps?: number
          vat_registered?: boolean
          website?: string | null
        }
        Update: {
          bank_details?: string | null
          company_name?: string
          default_check_in_time?: string
          default_check_out_time?: string
          default_cleaning_checklist?: Json
          default_commission_bps?: number
          email?: string | null
          head_office?: string | null
          id?: boolean
          invoice_prefix?: string
          late_penalty_note?: string | null
          legal_form?: string | null
          legal_name?: string | null
          liability_insurance?: string | null
          payment_terms_days?: number
          phone?: string | null
          primary_residence_night_limit?: number
          professional_card?: string | null
          registration?: string | null
          share_capital?: string | null
          siren?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_number?: string | null
          vat_rate_bps?: number
          vat_registered?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      statement_lines: {
        Row: {
          amount_cents: number
          booking_id: string | null
          commission_base_cents: number
          commission_cents: number
          commission_rate_bps: number | null
          created_at: string
          expense_id: string | null
          id: string
          is_demo: boolean
          kind: string
          label: string
          nights: number | null
          nights_amount_cents: number
          platform_fee_cents: number
          position: number
          property_id: string | null
          service_date: string | null
          statement_id: string
        }
        Insert: {
          amount_cents?: number
          booking_id?: string | null
          commission_base_cents?: number
          commission_cents?: number
          commission_rate_bps?: number | null
          created_at?: string
          expense_id?: string | null
          id?: string
          is_demo?: boolean
          kind: string
          label: string
          nights?: number | null
          nights_amount_cents?: number
          platform_fee_cents?: number
          position?: number
          property_id?: string | null
          service_date?: string | null
          statement_id: string
        }
        Update: {
          amount_cents?: number
          booking_id?: string | null
          commission_base_cents?: number
          commission_cents?: number
          commission_rate_bps?: number | null
          created_at?: string
          expense_id?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          label?: string
          nights?: number | null
          nights_amount_cents?: number
          platform_fee_cents?: number
          position?: number
          property_id?: string | null
          service_date?: string | null
          statement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statement_lines_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "statement_lines_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "statement_lines_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "statement_lines_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "statement_lines_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          conflicts: Json
          created_count: number
          error: string | null
          events_found: number
          finished_at: string | null
          id: string
          is_demo: boolean
          kind: string
          listing_id: string
          removed_count: number
          started_at: string
          status: string
          trigger: string
          updated_count: number
        }
        Insert: {
          conflicts?: Json
          created_count?: number
          error?: string | null
          events_found?: number
          finished_at?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          listing_id: string
          removed_count?: number
          started_at?: string
          status?: string
          trigger?: string
          updated_count?: number
        }
        Update: {
          conflicts?: Json
          created_count?: number
          error?: string | null
          events_found?: number
          finished_at?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          listing_id?: string
          removed_count?: number
          started_at?: string
          status?: string
          trigger?: string
          updated_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      task_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_demo: boolean
          kind: string
          storage_path: string
          task_id: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          kind?: string
          storage_path: string
          task_id: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          kind?: string
          storage_path?: string
          task_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "owner_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "staff_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          agent_notes: string | null
          assignee_id: string | null
          booking_id: string | null
          checklist: Json
          completed_at: string | null
          created_at: string
          created_by: string | null
          created_by_rule: string | null
          due_date: string
          id: string
          instructions: string | null
          is_demo: boolean
          property_id: string
          search_text: string | null
          started_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          agent_notes?: string | null
          assignee_id?: string | null
          booking_id?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          created_by_rule?: string | null
          due_date: string
          id?: string
          instructions?: string | null
          is_demo?: boolean
          property_id: string
          search_text?: string | null
          started_at?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          agent_notes?: string | null
          assignee_id?: string | null
          booking_id?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          created_by_rule?: string | null
          due_date?: string
          id?: string
          instructions?: string | null
          is_demo?: boolean
          property_id?: string
          search_text?: string | null
          started_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          role: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      owner_bookings: {
        Row: {
          adults: number | null
          check_in: string | null
          check_out: string | null
          children: number | null
          cleaning_fee_cents: number | null
          commission_base_cents: number | null
          commission_cents: number | null
          commission_rate_bps: number | null
          guest_first_name: string | null
          id: string | null
          is_demo: boolean | null
          nights: number | null
          nights_amount_cents: number | null
          owner_net_cents: number | null
          platform_fee_cents: number | null
          platform_id: string | null
          platform_name: string | null
          property_id: string | null
          property_name: string | null
          reference: string | null
          statement_id: string | null
          status: string | null
          tourist_tax_cents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_statement_fk"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "owner_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_tasks: {
        Row: {
          completed_at: string | null
          due_date: string | null
          id: string | null
          is_demo: boolean | null
          property_id: string | null
          property_name: string | null
          status: string | null
          type: string | null
          validated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_tasks: {
        Row: {
          address_line: string | null
          agent_notes: string | null
          booking_adults: number | null
          booking_check_in: string | null
          booking_check_out: string | null
          booking_children: number | null
          booking_id: string | null
          capacity: number | null
          checklist: Json | null
          city: string | null
          completed_at: string | null
          due_date: string | null
          floor_info: string | null
          guest_first_name: string | null
          id: string | null
          instructions: string | null
          is_demo: boolean | null
          next_check_in: string | null
          postal_code: string | null
          property_id: string | null
          property_name: string | null
          started_at: string | null
          status: string | null
          title: string | null
          type: string | null
          window_end: string | null
          window_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "owner_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      finalize_statement: { Args: { p_statement: string }; Returns: string }
      generate_statement: {
        Args: { p_month: string; p_owner: string }
        Returns: string
      }
      primary_residence_usage: {
        Args: { p_year: number }
        Returns: {
          night_limit: number
          nights: number
          property_id: string
        }[]
      }
      purge_demo_data: { Args: never; Returns: Json }
      roll_booking_statuses: { Args: never; Returns: number }
      search_global: {
        Args: { p_query: string }
        Returns: {
          id: string
          is_demo: boolean
          kind: string
          subtitle: string
          title: string
        }[]
      }
      seed_demo_data: { Args: never; Returns: Json }
      staff_task_access: {
        Args: { p_task: string }
        Returns: {
          access_instructions: string
          alarm_code: string
          door_code: string
          key_box_code: string
          key_box_location: string
          parking_info: string
          wifi_name: string
          wifi_password: string
        }[]
      }
      staff_update_task: {
        Args: {
          p_checklist?: Json
          p_notes?: string
          p_status?: string
          p_task: string
        }
        Returns: undefined
      }
      stats_property_months: {
        Args: { p_from: string; p_to: string }
        Returns: {
          blocked_nights: number
          booked_nights: number
          commission_base_cents: number
          commission_cents: number
          days: number
          imported_nights: number
          is_demo: boolean
          month: string
          nights_amount_cents: number
          owner_id: string
          owner_net_cents: number
          platform_fee_cents: number
          property_id: string
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

