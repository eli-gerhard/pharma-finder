'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import type { Database } from '@/types/supabase';
import { FilterBar } from './FilterComponent';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import zipCodesData from '@/utils/data/zipCodes.json';

// Type definitions
type Medication = Database['public']['Tables']['medications']['Row'];
type Pharmacy = Database['public']['Tables']['pharmacies']['Row'] & {
  distance: number;
  last_pickup_date: string;
};

interface MedicationSearchProps {
  onMedicationSelect: (medication: Medication | null) => void;
}

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  loading: boolean;
  unit: string;
}

interface Filters {
  dosages: string[];
  forms: string[];
  brands: string[];
  generic: boolean;
  distance: number;
  units: 'mi' | 'km';
  pickup: number;
 }

 interface LocationError {
  message: string;
  type: 'geolocation' | 'zipcode';
}

interface ZipCodeData {
  zip: string;
  latitude: number;
  longitude: number;
  borough: string;
}

// MedicationSearch component
const MedicationSearch: React.FC<MedicationSearchProps> = ({ onMedicationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMedications = async () => {
      // console.log('Search triggered with query:', searchQuery);
      // console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      // console.log('Making query to Supabase...');
      
      if (searchQuery.length < 2) {
        // console.log('Query too short, skipping search');
        setResults([]);
        return;
      }
    
      setLoading(true);
      // console.log('Starting search...');
      // console.log('Searching for:', searchQuery);
      // console.log('Testing basic query...');
    
      try {
        const testQuery = await supabase
          .rpc('search_medications', { search_term: searchQuery });
        
    
        if (testQuery.error) {
          throw testQuery.error;
        }
    
        if (testQuery.data) {
          // console.log('Search results:', testQuery.data);
          // console.log('Raw Supabase response:', testQuery.data);
          setResults(testQuery.data as Medication[]);
        }

      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMedications, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-2xl relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {results.length > 0 && ( //Dropdown list
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
        {results.map((medication) => (
            <button
              key={medication.id}
              className="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              onClick={() => {
                onMedicationSelect(medication)
                setSearchQuery('');
              }}
            >
              {medication.brand_name && medication.brand_name.length > 0 ? (
                <div className="font-medium text-sky-900">
                  Brands: {medication.brand_name.length > 3 
                    ? medication.brand_name.slice(0, 3).join(', ') + ', ...'
                    : medication.brand_name.join(', ')
                  }
                </div>
                ) : (
                <div className="font-medium text-sky-900">
                  Brands: N/A
                </div>
              )}
              <div className="text-sm text-gray-800">{medication.scientific_name}</div>
              </button>
          ))}
        </div>
      )}

    </div>
  );
};

// PharmacyList component
const PharmacyList: React.FC<PharmacyListProps> = ({ pharmacies, loading, unit }) => {
  const formatDistance = (dist: number): string => {
    if (unit === 'mi') {
      if (dist < 1) {
        return `${dist.toFixed(2)}mi`;
      }
      return `${Math.round(dist)}mi`;
    } else {
      if (dist < 1000) {
        return `${Math.round(dist)}m`;
      }
      return `${(dist / 1000).toFixed(0)}km`;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mt-4 p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mt-4 space-y-4">
      {pharmacies.map((pharmacy) => (
        <div
          key={pharmacy.id}
          className="bg-white w-full border border-[var(--puborder)] rounded-lg shadow p-2 hover:bg-gray-100 transition-shadow"
          >
          <div className="flex justify-between items-start">
            <div>
            <h3 className="font-medium text-left text-lg text-sky-950">{pharmacy.name}</h3>
            <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm text-left">{pharmacy.address}</span>
              </div>
            </div>
            <div className="text-right align-bottom">
              <div className="text-sm font-medium text-blue-600">
                {formatDistance(pharmacy.distance)}
              </div>
              <div className="flex items-center text-gray-600 mt-3">
                <Clock size={16} className="mr-1" />
                <span className="text-sm pb-0">
                  Last pickup: {formatDate(pharmacy.last_pickup_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {pharmacies.length === 0 && (
        <div className="text-center py-8">
          No pharmacies found with this medication in stock recently.
        </div>
      )}
    </div>
  );
};

// Main search page component
const SearchPageClient: React.FC = () => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [error, setError] = useState<LocationError | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [filters, setFilters] = useState<Filters>({dosages: [], forms: [], brands: [], generic: true, distance: 10, units: 'mi', pickup: 30});

  const getCoordinatesFromZipCode = async (zipCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const zipData = (zipCodesData as ZipCodeData[]).find(
        (entry) => entry.zip === zipCode
      );

      if (zipData) {
        // Use the local data's coordinates
        setUserLocation({ 
          lat: zipData.latitude, 
          lng: zipData.longitude 
        });
      } else {
        setError({
          message: 'Invalid zip code. Please try again.',
          type: 'zipcode'
        });
      }
    } catch (error) {
      // console.error('Error getting location:', error);
      setError({
        message: 'Error finding location from zip code. Please try again.',
        type: 'zipcode'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle zip code form submission
  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zipCodeNum = parseInt(zipCode);
    if (zipCode.length === 5 && zipCodeNum >= 10000 && zipCodeNum <= 11700) {
      getCoordinatesFromZipCode(zipCode);
    } else {
      setError({
        message: 'Please enter a valid NYC zip code (10000-11700)',
        type: 'zipcode'
      });
    }
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setError(null);
          setIsLocating(false);
        },
        (error) => {
          // console.error('Error getting location:', error);
          setError({
            message: 'Please enable location or enter your zip code.',
            type: 'geolocation'
          });
          setIsLocating(false);
        }
      );
    } else {
      setError({
        message: 'Please enable location or enter your zip code.',
        type: 'geolocation'
      });
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    const fetchPharmacies = async (currentFilters: Filters) => {
      // console.log('Fetching pharmacies with:', {
      //   medication: selectedMedication,
      //   location: userLocation
      // });

      if (!selectedMedication || !userLocation) {
        console.log('Missing required data:', {
          hasMedication: !!selectedMedication,
          hasLocation: !!userLocation
        });
        return;
      }

      setLoading(true);
      try {
        // console.log('Making RPC call with params:', {
        //   p_lat: userLocation.lat,
        //   p_lng: userLocation.lng,
        //   p_medication_id: selectedMedication.id,
        //   p_radius: 10000
        // });

        const { data, error } = await supabase.rpc('nearby_pharmacies_with_medication', {
          p_lat: userLocation.lat,
          p_lng: userLocation.lng,
          p_medication_id: selectedMedication.id,
          p_radius: currentFilters.distance * (currentFilters.units === 'mi' ? 1609.34 : 1000),
          p_dosage: currentFilters.dosages.length > 0 ? currentFilters.dosages.join(" ") : null,
          p_form: currentFilters.forms.length > 0 ? currentFilters.forms.join(" ") : null,
          p_generic: currentFilters.generic,
          p_brand: currentFilters.brands.length > 0 ? currentFilters.brands.join(" ") : null,
          p_pickup: currentFilters.pickup,
          p_unit: currentFilters.units
        });

        if (error) {
          console.error('Error fetching pharmacies:', error);
          return;
        }

        // console.log('Received pharmacy data:', data);
        setPharmacies(data as Pharmacy[]);
      } catch (err) {
        console.error('Exception in fetchPharmacies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPharmacies(filters);
  }, [filters]);
  // }, [selectedMedication, userLocation, filters]);

  return (
    <div className="min-h-screen py-0">
      <div className="max-w-5xl mx-auto px-4">
        
        {((error || !userLocation) && !isLocating) && (
          <div className="fixed left-1/2 max-w-96 transform -translate-x-1/2 text-center space-y-4 bg-sky-900 p-2 rounded-lg w-4/5 border z-20">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {(!userLocation || error?.type === 'geolocation') && (
              <form onSubmit={handleZipCodeSubmit} className="space-y-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
                  placeholder="Enter zip code"
                  pattern="[0-9]*"
                  maxLength={5}
                  className="w-full p-2 border rounded text-center text-sky-950"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={zipCode.length !== 5 || loading}
                  className="w-full p-2 bg-sky-950 text-white rounded border disabled:bg-gray-300"
                >
                  {loading ? 'Finding location...' : 'Search by Zip Code'}
                </button>
              </form>
            )}
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-center mb-2">
          Search for Pharmacies with Your Medicaiton
        </h1>
        
        <div className="flex flex-col items-center space-y-6">
          <MedicationSearch onMedicationSelect={setSelectedMedication} />
          
          {selectedMedication && (
            <FilterBar 
              selectedMedication={selectedMedication}
              onFilterChange={(newFilters) => {
                setFilters(newFilters)
                console.log(newFilters);
              }}
            />
          )}
          
          {selectedMedication && (
            <div className="w-full max-w-2xl">
              <h2 className="mb-2 text-sm">
                <span className="text-base font-semibold">Showing results for:</span>
                <br /> <span className="text-sm text-[var(--accent)]">{selectedMedication.scientific_name}</span>
              </h2>
              <PharmacyList pharmacies={pharmacies} loading={loading} unit={filters.units}/>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export { SearchPageClient, MedicationSearch, PharmacyList };