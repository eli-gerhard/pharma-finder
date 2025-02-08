export type Database = {
  public: {
    Tables: {
      pharmacies: {
        Row: {
          id: string
          name: string
          address: string
          latitude: number
          longitude: number
          phone: string | null
          website: string | null
          google_place_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pharmacies']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pharmacies']['Insert']>
      }
      medications: {
        Row: {
          id: string
          brand_name: string[] | null
          scientific_name: string
          dosages: string[]
          forms: string[]
          has_generic: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['medications']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['medications']['Insert']>
      }
      stock: {
        Row: {
          id: string
          pharmacy_id: string
          medication_id: string
          dosage: string
          form: string
          is_generic: boolean
          last_pickup_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stock']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stock']['Insert']>
      }
    }
  }
}