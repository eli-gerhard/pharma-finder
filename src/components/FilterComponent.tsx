import React, { useState, useCallback, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { Database } from '@/types/supabase';

// Type definitions
type Medication = Database['public']['Tables']['medications']['Row'];

interface Filters {
  dosages: string[];
  forms: string[];
  brands: string[];
  generic: boolean;
  distance: number;
  units: 'mi' | 'km';
  pickup: number;
}

interface FilterBarProps {
  selectedMedication: Medication;
  onFilterChange: (filters: Filters) => void;
}

interface DropdownCheckboxProps {
  title: string;
  options: string[];
  type: keyof Pick<Filters, 'dosages' | 'forms' | 'brands'>;
  disabled: boolean;
}

interface SwitchProps {
  label: string;
  value: boolean;
  type: keyof Pick<Filters, 'generic' | 'units'>;
  opt1: string;
  opt2: string;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

interface SliderProps {
  label: string;
  value: number;
  max: string;
  type: keyof Pick<Filters, 'distance' | 'pickup'>;
  onChange: (value: number) => void;
}

const FilterBar = ({ selectedMedication, onFilterChange }: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    dosage: false,
    form: false,
    brand: false
  });
  
  const [filters, setFilters] = useState<Filters>({
    dosages: [],
    forms: [],
    brands: [],
    generic: false,
    distance: 10,
    units: 'mi',
    pickup: 30
  });

//   const handleCheckboxChange = (filterType: keyof Pick<Filters, 'dosages' | 'forms' | 'brands'>, value: string): void => {
//     setFilters((prev: Filters) => {
//       const updated = {...prev};
//       if (updated[filterType].includes(value)) {
//         updated[filterType] = updated[filterType].filter((item: string) => item !== value);
//       } else {
//         updated[filterType] = [...updated[filterType], value];
//       }
//       onFilterChange(updated);
//       return updated;
//     });
//   };

  const handleCheckboxChange = useCallback((filterType: keyof Pick<Filters, 'dosages' | 'forms' | 'brands'>, value: string): void => {
    // setFilters(prev => ({ ...prev, [filterType]: value }));
    setFilters((prev: Filters) => {
      const updated = {...prev};
      if (updated[filterType].includes(value)) {
        updated[filterType] = updated[filterType].filter((item: string) => item !== value);
      } else {
        updated[filterType] = [...updated[filterType], value];
      }
    //   onFilterChange(updated);
      return updated;
    });
  },[]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({ title, options, type, disabled }) => (
    <div className="relative inline-block mr-2 w-28 bg-[var(--popup)]"> {/*Dropdown Buttons*/}
      <button
        onClick={() => setIsOpen(prev => ({ ...prev, [type]: !prev[type] }))}
        disabled={disabled}
        className={`w-full px-2 border rounded-lg flex items-center justify-center space-x-0 border-[var(--puborder)] ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[var(--hover)]'
        }`}
      >
        <span>{title}</span>
        <ChevronDown size={16} />
      </button>

      {/*Dropdown Checkbox Menu*/}
      {isOpen[type] && !disabled && ( 
        <div className="absolute z-20 mt-0 border rounded-lg shadow-lg w-48 bg-[var(--popup)] border-[var(--puborder)]">
          {options.map((option: string) => (
            <label key={option} className="flex items-center px-4 py-2 rounded-lg hover:bg-[var(--hover)] cursor-pointer">
              <input
                type="checkbox"
                checked={filters[type].includes(option)}
                onChange={() => handleCheckboxChange(type, option)}
                className="hidden"
              />
              <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                filters[type].includes(option) ? 'bg-sky-500 border-blue-500' : 'border-gray-300'
              }`}>
                {filters[type].includes(option) && <Check size={12} color="white" />}
              </div>
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  {/*Switches*/}
  const Switch: React.FC<SwitchProps> = ({ label, type, value, onChange, opt1, opt2, disabled }) => (
    <div className="relative inline-block mr-2 w-32 bg-[var(--popup)]"> {/*Dropdown Buttons*/}
      <button
        onClick={() => setIsOpen(prev => ({ ...prev, [type]: !prev[type] }))}
        disabled={disabled}
        className={`w-full px-2 border rounded-lg flex items-center justify-center space-x-0 border-[var(--puborder)] ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[var(--hover)]'
        }`}
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </button>

      {/*Dropdown Switch Menu*/}
      {isOpen[type] && !disabled && ( 
        <label className={`relative inline-flex pr-1 pl-1 border rounded-lg w-full items-center justify-center bg-[var(--popup)] border-[var(--puborder)] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <span className={`mr-2 bg-[var(--popup)] ${disabled ? 'text-gray-400' : ''}`}>{opt1}</span>
        <div
          className={`relative w-8 h-4 transition-colors duration-200 ease-in-out rounded-full bg-[var(--popup)] border-[var(--puborder)] ${
            disabled ? 'bg-sky-500' : value ? 'bg-sky-500' : 'bg-sky-500'
          }`}
          onClick={() => !disabled && onChange(!value)}
        >
          <div
            className={`absolute left-0 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full shadow-md ${
              value ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
        <span className={`ml-2 ${disabled ? 'text-gray-400' : ''}`}>{opt2}</span>
      </label>
      )}
    </div>
  );

  const Slider: React.FC<SliderProps> = ({ label, value, type, max, onChange }) => (
    <div className="relative inline-block mr-2 w-44 bg-[var(--popup)]"> {/*Dropdown Buttons*/}
      <button
        onClick={() => setIsOpen(prev => ({ ...prev, [type]: !prev[type] }))}
        className={`w-full px-2 border rounded-lg flex items-center justify-center space-x-0 bg-[var(--popup)] border-[var(--puborder)]`}
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </button>
      {isOpen[type] && ( 
        <div className="inline-flex w-full items-center pl-2 pr-2 rounded-lg border justify-center bg-[var(--popup)] border-[var(--puborder)]">
            {/* <span className="mr-2">{min}</span> */}
            <input
                type="range"
                min="1"
                max={max}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(parseInt(e.target.value))}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer bg-[var(--popup)]"
            />
            <span className="ml-2">{value}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-2 border rounded-lg bg-[var(--popup)] border-[var(--puborder)] space-y-2">
      <div className="flex flex-wrap gap-y-1 text-sm align-top justify-center bg-[var(--popup)]">
        <DropdownCheckbox
          title="Dosage"
          options={selectedMedication.dosages}
          type="dosages"
          disabled={!selectedMedication.dosages.length}
        />
        <DropdownCheckbox
          title="Form"
          options={selectedMedication.forms}
          type="forms"
          disabled={!selectedMedication.forms.length}
        />
        <DropdownCheckbox
          title="Brand"
          options={selectedMedication.brand_name || []}
          type="brands"
          disabled={!selectedMedication.brand_name?.length}
        />
        <Switch
          label="Generic Only"
          value={filters.generic}
          type="generic"
          opt1="Yes"
          opt2="No"
          onChange={(value: boolean) => {
            setFilters(prev => {
              const updated = { ...prev, generic: value };
              onFilterChange(updated);
              return updated;
            });
          }}
          disabled={!selectedMedication.has_generic}
        />
        </div>
        <div className="flex flex-wrap gap-y-1 text-sm align-top justify-center bg-[var(--popup)]">
        <Slider
          label="Days Since Entry"
          value={filters.pickup}
          type="pickup"
          max="90"
          onChange={(value: number) => {
            setFilters(prev => {
              const updated = { ...prev, pickup: value };
              onFilterChange(updated);
              return updated;
            });
          }}
        />
        <Slider
          label={`Distance (${filters.units})`}
          value={filters.distance}
          type="distance"
          max="40"
          onChange={(value: number) => {
            setFilters(prev => {
              const updated = { ...prev, distance: value };
              onFilterChange(updated);
              return updated;
            });
          }}
        />
        <Switch
          label="Units"
          value={filters.units === 'km'}
          type="units"
          opt1="mi"
          opt2="km"
          onChange={(value: boolean) => {
            setFilters(prev => {
                const updated = { ...prev, units: value ? 'km' as const : 'mi' as const };
                onFilterChange(updated);
                return updated;
              });              
          }}
          disabled={false}
        />
      </div>
    </div>
  );
};

export { FilterBar };