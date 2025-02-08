import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import type { Database } from '@/types/supabase';

// Type definitions
type Medication = Database['public']['Tables']['medications']['Row'];

interface Entry {
  dosage: string;
  form: string;
  brand: string;
  generic: boolean;
  entryDate: Date;
}

interface EntryBoxProps {
  selectedMedication: Medication;
  onFilterChange: (entry: Entry) => void;
  addStock: (submit: boolean) => void;
}

interface DropdownProps {
  title: string;
  options: string[];
  type: keyof Pick<Entry, 'dosage' | 'form' | 'brand' | 'generic'>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

interface BooleanDropdownProps {
  title: string;
  options: ['Yes', 'No'];
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const EntryBox = ({ selectedMedication, onFilterChange, addStock }: EntryBoxProps) => {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    dosage: false,
    form: false,
    generic: false,
    brand: false,
    entryDate: false
  });

  const [entry, setEntry] = useState<Entry>({
    dosage: '',
    form: '',
    brand: '',
    generic: false,
    entryDate: new Date()
  });

  // const handleOptionSelect = (filterType: keyof Pick<Entry, 'dosage' | 'form' | 'brand'>, value: string): void => {
  //   setEntry((prev: Entry) => {
  //     const updated = { ...prev, [filterType]: value };
  //     onFilterChange(updated);
  //     addStock(false);
  //     return updated;
  //   });
  //   setIsOpen(prev => ({ ...prev, [filterType]: false }));
  // };

  const handleOptionSelect = useCallback((filterType: keyof Pick<Entry, 'dosage' | 'form' | 'brand'>, value: string): void => {
    setEntry(prev => ({ ...prev, [filterType]: value }));
    setIsOpen(prev => ({ ...prev, [filterType]: false }));
  }, []);

  useEffect(() => {
    onFilterChange(entry);
    addStock(false);
  }, [entry, onFilterChange, addStock]);


  // const handleBooleanSelect = (value: boolean): void => {
  //   setEntry((prev: Entry) => {
  //     // If setting generic to true, clear the brand selection
  //     const updated = { 
  //       ...prev, 
  //       generic: value,
  //       brand: value ? '' : prev.brand // Clear brand if generic is true
  //     };
  //     onFilterChange(updated);
  //     addStock(false);
  //     return updated;
  //   });
  //   setIsOpen(prev => ({ ...prev, generic: false }));
  // };

  const handleBooleanSelect = useCallback((value: boolean): void => {
    setEntry(prev => ({ 
      ...prev, 
      generic: value,
      brand: value ? '' : prev.brand
    }));
    setIsOpen(prev => ({ ...prev, generic: false }));
  }, []);

  // const handleDateSelect = (value: Date): void => {
  //   setEntry((prev: Entry) => {
  //     const updated = { ...prev, entryDate: value };
  //     onFilterChange(updated);
  //     addStock(false);
  //     return updated;
  //   });
  //   // setIsOpen(prev => ({ ...prev, entryDate: false }));
  // };

  const handleDateSelect = useCallback((value: Date): void => {
    setEntry(prev => ({ ...prev, entryDate: value }));
  }, []);

  const Dropdown: React.FC<DropdownProps> = ({ title, options, type, value, onChange, disabled }) => (
    <div className="flex items-center w-full mb-4 space-x-4 ">
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
          placeholder={title}
          readOnly
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
        />
      </div>
    </div>
  );

  const BooleanDropdown: React.FC<BooleanDropdownProps> = ({ title, options, value, onChange, disabled }) => (
    <div className="flex items-center w-full mb-4 space-x-4">
      <div className="relative w-40">
        <button
          onClick={() => setIsOpen(prev => ({ ...prev, generic: !prev.generic }))}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between bg-[var(--popup)] border-[var(--puborder)] ${
            disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[var(--hover)]'
          }`}
        >
          <span>{title}</span>
          <ChevronDown size={16} />
        </button>

        {isOpen.generic && !disabled && (
          <div className="absolute z-20 w-full mt-1 border rounded-lg shadow-lg bg-[var(--popup)] border-[var(--puborder)]">
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2 rounded-lg hover:bg-[var(--hover)] cursor-pointer border-[var(--puborder)]"
                onClick={() => onChange(option === 'Yes')}
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
          value={value ? 'Yes' : 'No'}
          placeholder={title}
          readOnly
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
        />
      </div>
    </div>
  );


  const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(value);
  
    const handleSubmit = () => {
      onChange(tempDate);
      setIsOpen(false);
    };
  
    return (
      <div className="flex items-center w-full mb-0 space-x-4">
        <div className="relative w-40 ">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:bg-[var(--hover)] bg-[var(--popup)] border-[var(--puborder)]"
          >
            <span>Entry Date</span>
            <Calendar size={16} />
          </button>
  
          {isOpen && (
            <div className="absolute flex flex-col items-center z-20 w-48 mt-1 border rounded-lg shadow-lg text-gray-700 bg-[var(--popup)] border-[var(--puborder)] p-2">
              <input
                type="date"
                value={!isNaN(tempDate.getTime()) ? tempDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setTempDate(new Date(e.target.value + 'T12:00:00'))}
                className="w-full p-1 border rounded-lg border-[var(--puborder)]"
              />
              <button
                onClick={handleSubmit}
                className="w-full p-0 mt-1 border rounded-lg hover:bg-[var(--hover)] border-[var(--puborder)]"
              >
                Enter
              </button>
            </div>
          )}
        </div>
  
        <div className="flex-1">
          <input
            type="text"
            value={value.toLocaleDateString()}
            placeholder="Entry Date"
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-default focus:outline-none border-[var(--puborder)]"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl p-4 border rounded-lg bg-[var(--popup)] border-[var(--puborder)]">
      <Dropdown
        title="Dosage"
        options={selectedMedication.dosages}
        type="dosage"
        value={entry.dosage}
        onChange={(value) => handleOptionSelect('dosage', value)}
        disabled={!selectedMedication.dosages.length}
      />
      <Dropdown
        title="Form"
        options={selectedMedication.forms}
        type="form"
        value={entry.form}
        onChange={(value) => handleOptionSelect('form', value)}
        disabled={!selectedMedication.forms.length}
      />
      <BooleanDropdown
        title="Generic"
        options={['Yes', 'No']}
        value={entry.generic}
        onChange={handleBooleanSelect}
        disabled={!selectedMedication.has_generic}
      />
      <Dropdown
        title="Brand"
        options={selectedMedication.brand_name || []}
        type="brand"
        value={entry.brand}
        onChange={(value) => handleOptionSelect('brand', value)}
        disabled={!selectedMedication.brand_name?.length || entry.generic}
      />
      <DatePicker
        value={entry.entryDate}
        onChange={(value) => handleDateSelect(value)}
      />
      <button
        onClick={() => addStock(true)}
        className="w-24 px-4 py-2 mt-4 border justify-self-end rounded-lg flex items-center text-center justify-center hover:bg-[var(--hover)] bg-[var(--popup)] border-[var(--puborder)]"
      >
        <span>Submit</span>
      </button>
    </div>
  );
};

export { EntryBox };