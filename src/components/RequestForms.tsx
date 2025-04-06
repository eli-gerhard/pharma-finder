import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
// import type { Database } from '@/types/supabase';

// Type definitions
// type MedRequest = Database['public']['Tables']['medications_request']['Row'];

interface Med {
  brand: string;
  scientific: string;
  form: string;
}

interface MedRequestBoxProps {
  onFilterChange: (entry: Med) => void;
  addMed: (submit: boolean) => void;
  resetKey?: number; // Add a new resetKey prop that will trigger state reset
}

interface DropdownProps {
  title: string;
  options: string[];
  type: keyof Pick<Med, 'form'>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const MedRequestBox = ({ onFilterChange, addMed, resetKey = 0 }: MedRequestBoxProps) => {
  const [brandEntry, setBrand] = useState('');
  const [scientificEntry, setScientific] = useState('');
  
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    brand: false,
    scientific: false,
    form: false
  });

  const [entry, setMed] = useState<Med>({
    brand: '',
    scientific: '',
    form: ''
  });

  // Add an effect to reset the component state when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setMed({
        brand: '',
        scientific: '',
        form: ''
      });
      setIsOpen({
        brand: false,
        scientific: false,
        form: false
      });
    }
  }, [resetKey]);

  const handleOptionSelect = useCallback((filterType: keyof Pick<Med, 'form' >, value: string): void => {
    setMed(prev => ({ ...prev, [filterType]: value }));
    setIsOpen(prev => ({ ...prev, [filterType]: false }));
  }, []);

  useEffect(() => {
    onFilterChange(entry);
    addMed(false);
  }, [entry, onFilterChange, addMed]);

  const Dropdown: React.FC<DropdownProps> = ({ title, options, type, value, onChange, disabled }) => (
    <div className="flex items-center w-full mb-2 space-x-4 ">
      <div className="relative w-40">
        <button
          onClick={() => setIsOpen(prev => ({ ...prev, [type]: !prev[type] }))}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between bg-[var(--popup)] border-[var(--puborder)] ${
            disabled ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-[var(--hover)]'
          }`}
        >
          <span>{title}</span>
          <ChevronDown size={16} />
        </button>

        {isOpen[type] && !disabled && (
          <div className="absolute z-20 w-full mt-1 border rounded-lg shadow-lg bg-[var(--popup)] border-[var(--puborder)]">
            {options.map((option: string) => (
              <div
                key={option}
                className="px-4 py-2 rounded-lg hover:bg-[var(--hover)] cursor-pointer"
                onClick={() => onChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={value}
          placeholder="Select from dropdown"
          readOnly
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="text-left text-sm py-3 text-[var(--accent)]">
        No medications found. Double check spelling or fill out the form to get your medication added.
      </div>
      <div className="w-full max-w-2xl p-4 border rounded-lg bg-[var(--popup)] border-[var(--puborder)]">
        <div className="font-semibold -mt-1 mb-3">
          Medication Request Form
        </div>
        <input
          className="w-full px-4 py-2 mb-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
          type="text"
          title="Brand Name"
          placeholder="Brand name (if available)"
          value={brandEntry}
          onChange={(b) => setBrand(b.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
          type="text"
          title="Generic Name"
          placeholder="Generic name or active incredient"
          value={scientificEntry}
          onChange={(b) => setScientific(b.target.value)}
        />
        <Dropdown
          title="Form"
          options={['capsule','chewable','inhaler','injection','powder','solution','syrup','tablet','other']}
          type="form"
          value={entry.form}
          onChange={(value) => handleOptionSelect('form', value)}
          disabled={!true}
        />
        <button
          onClick={() => addMed(true)}
          className="w-24 px-4 py-2 mt-2 border justify-self-end rounded-lg flex items-center text-center justify-center hover:bg-[var(--hover)] bg-[var(--popup)] border-[var(--puborder)]"
        >
          <span>Request</span>
        </button>
      </div>
    </div>
  );
};

export { MedRequestBox };