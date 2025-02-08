import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import type { Database } from '@/types/supabase'

type Pharmacy = Database['public']['Tables']['pharmacies']['Row']
type Medication = Database['public']['Tables']['medications']['Row']
type Stock = Database['public']['Tables']['stock']['Row']

export const useNearbyPharmacies = (
  lat: number,
  lng: number,
  medicationId: string,
  radius: number = 5000 // meters
) => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true)
      
      const { data, error } = await supabase
        .rpc('nearby_pharmacies_with_medication', {
          p_lat: lat,
          p_lng: lng,
          p_medication_id: medicationId,
          p_radius: radius
        })

      if (error) {
        setError(error)
      } else {
        setPharmacies(data || [])
      }
      
      setLoading(false)
    }

    if (lat && lng && medicationId) {
      fetchPharmacies()
    }
  }, [lat, lng, medicationId, radius])

  return { pharmacies, loading, error }
}