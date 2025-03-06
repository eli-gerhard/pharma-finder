'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import type { Database } from '@/types/supabase';
import { EntryBox } from './EntryOptions';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import zipCodesData from '@/utils/data/zipCodes.json';
// import { unique } from 'next/dist/build/utils';

// Type definitions
type Medication = Database['public']['Tables']['medications']['Row'];
// type Stock = Database['public']['Tables']['stock']['Row']; // Don't need since not calling any stock
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
  onPharmacySelect: (pharmacy: Pharmacy | null) => void;
}

interface Entry {
  dosage: string;
  form: string;
  brand: string;
  generic: boolean;
  entryDate: Date;
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

// Types for our stock data
interface StockData {
  dosage: string;
  form: string;
  is_generic: boolean;
  last_pickup_date: Date;
  pharmacy_id: string;
  medication_id: string;
  brand: string | null;
}

// Insert stock data into Supabase
async function insertStockData(stockData: StockData) {
  console.log(stockData);
  try {
    const { data, error } = await supabase
      .from('stock')
      .insert([stockData])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting stock data:', error);
    return null;
  }
}

// LocationSearchButtons component
const LocationSearchButtons: React.FC<{
  onLocationRequest: () => void;
  onZipCodeRequest: () => void;
}> = ({ onLocationRequest, onZipCodeRequest }) => {
  return (
    <div className="w-full max-w-lg flex justify-self-center space-x-2 mb-4">
      <button
        onClick={onLocationRequest}
        className="flex-1 p-1 bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)] flex items-center justify-center transition-colors"
      >
        <MapPin size={16} className="mr-2" />
        Search Near Me
      </button>
      <button
        onClick={onZipCodeRequest}
        className="flex-1 p-1 bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)] flex items-center justify-center transition-colors"
      >
        <Search size={16} className="mr-2" />
        Search by ZipCode
      </button>
    </div>
  );
};

// MedicationSearch component
const MedicationSearch: React.FC<MedicationSearchProps> = ({ onMedicationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMedications = async () => {
      
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
    
      try {
        const testQuery = await supabase
          .rpc('search_medications', { search_term: searchQuery });
    
        if (testQuery.error) {
          throw testQuery.error;
        }
        if (testQuery.data) {
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
      <h2 className="mb-2 text-sm text-[var(--accent)]">
        <span className="text-base font-semibold">Which medication did you pick up?</span>
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          placeholder="Medication name..."
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
const PharmacyList: React.FC<PharmacyListProps> = ({ pharmacies, loading, onPharmacySelect }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const formatDistance = (dist: number): string => {
      if (dist < 1000) {
        return `${Math.round(dist)}m`;
      }
      return `${(dist / 1000).toFixed(1)}km`;
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
    <div className="w-full max-w-2xl mt-2 space-y-2">
      {!selectedPharmacy ? (
        pharmacies.map((pharmacy) => (
          <button
            key={pharmacy.id}
            className="bg-white w-full rounded-lg shadow p-2 hover:bg-gray-100 transition-shadow border border-[var(--puborder)]"
            onClick={() => {
              setSelectedPharmacy(pharmacy);
              onPharmacySelect(pharmacy);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-left text-lg text-sky-950">{pharmacy.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm text-left">{pharmacy.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  {formatDistance(pharmacy.distance)}
                </div>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="bg-white w-full rounded-lg shadow p-2 border border-[var(--puborder)]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-left text-lg text-sky-950">{selectedPharmacy.name}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm text-left">{selectedPharmacy.address}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPharmacy(null)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      
      {pharmacies.length === 0 && (
        <div className="text-center py-8">
          No pharmacies found within 2km.
        </div>
      )}
    </div>
  );
};

// Main search page component
const EntryPageClient: React.FC = () => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [isLocating, setIsLocating] = useState(true);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);
  const [entry, setEntry] = useState<Entry>({dosage: '', form: '', brand: '', generic: true, entryDate: new Date()});
  const [submit, setSubmit] = useState<boolean>(false);

  // Request geolocation from user
  const requestUserLocation = () => {
    setIsLocating(true);
    setError(null);
    
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
          console.error('Error getting location:', error);
          setError({
            message: 'Please enable location or enter your zip code.',
            type: 'geolocation'
          });
          setIsLocating(false);
        }
      );
    } else {
      setError({
        message: 'Geolocation is not supported by your browser.',
        type: 'geolocation'
      });
      setIsLocating(false);
    }
  };

  // Show zip code input dialog
  const requestZipCode = () => {
    setError({
      message: 'Please enter your zip code below.',
      type: 'zipcode'
    });
    setUserLocation(null); // Clear current location to show the ZIP input form
    setIsLocating(false);
  };

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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

  const handleEntryChange = useCallback((newEntry: Entry) => {
    setEntry(newEntry);
  }, []);

  const handleStockSubmit = useCallback((submitStock: boolean) => {
    setSubmit(submitStock);
  }, []);

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const nearbyPharmacies = async (userLocation: { lat: number; lng: number } | null) => {
      if (!userLocation) {
        console.log('Missing required data:', {
          hasLocation: !!userLocation
        });
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('nearby_pharmacies_to_user', {
          p_lat: userLocation.lat,
          p_lng: userLocation.lng,
          // p_radius: locFilters.distance * (locFilters.units === 'mi' ? 1609.34 : 1000)
          // p_unit: 'km'
          p_radius: 2000
        });

        if (error) {
          console.error('Error finding pharmacies:', error);
          return;
        }

        // console.log('Received pharmacy data:', data);
        setPharmacies(data as Pharmacy[]);
      } catch (err) {
        console.error('Exception in nearbyPharmacies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    nearbyPharmacies(userLocation);
  }, [selectedMedication, userLocation]);
  
  useEffect(() => {
    const populateStock = async (currentEntry: Entry) => {
      console.log('PS');
      console.log(submit);
      if (!selectedMedication || !selectedPharmacy || !entry || !submit) {
        console.log('Missing required data:', {
          hasMedication: !!selectedMedication,
          hasPharmacy: !!selectedPharmacy,
          hasEntry: !!entry,
          submitReady: submit
        });
        return;
      }
      console.log(selectedPharmacy);
      setLoading(true);
      if (submit) {
        try {

          //Populate stock table
          insertStockData({
            dosage: currentEntry.dosage,
            form: currentEntry.form,
            is_generic: currentEntry.generic,
            last_pickup_date: currentEntry.entryDate,
            pharmacy_id: selectedPharmacy.id,
            medication_id: selectedMedication.id,
            brand: currentEntry.brand || null
          });

          if (error) {
            console.error('Error populating stock:', error);
            return;
          }

        } catch (err) {
          console.error('Exception in populateStock:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    populateStock(entry);
  }, [entry, error, selectedMedication, selectedPharmacy, submit]);

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
          Medication Pickup Entry Form
        </h1>
        
        <div className="flex flex-col items-center space-y-6">
          
          {(userLocation) && (
            <div className="w-full max-w-2xl">
              <LocationSearchButtons 
                onLocationRequest={requestUserLocation}
                onZipCodeRequest={requestZipCode}
              />
              <h2 className="mb-2 text-sm">
                <span className="text-base font-semibold text-[var(--accent)]">
                  Select the pharmacy where you picked up your medication:
                </span>
              </h2>
              <PharmacyList pharmacies={pharmacies} loading={loading} onPharmacySelect={setSelectedPharmacy}/>
            </div>
          )}
          
          <MedicationSearch onMedicationSelect={setSelectedMedication} /> 
          {selectedMedication && (
            <EntryBox 
              selectedMedication={selectedMedication}
              onFilterChange={handleEntryChange}
              addStock={handleStockSubmit}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export { EntryPageClient, MedicationSearch, PharmacyList };