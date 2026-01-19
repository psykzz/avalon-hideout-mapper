'use client';

import { useState, useMemo, ChangeEvent } from 'react';

interface ZoneSearchProps {
  zones: string[];
  onZoneSelect: (zone: string) => void;
}

export default function ZoneSearch({ zones, onZoneSelect }: ZoneSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredZones = useMemo(() => {
    if (!searchTerm) return [];
    return zones.filter(zone => 
      zone.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
  }, [searchTerm, zones]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(value.length > 0);
    
    // Simulate search delay for loading state
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleSelectZone = (zone: string) => {
    setSearchTerm(zone);
    setSelectedZone(zone);
    onZoneSelect(zone);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setSelectedZone(searchTerm);
      onZoneSelect(searchTerm);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="text-base font-semibold text-gray-900 dark:text-gray-300">
        Search for Avalon Zone
      </label>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Enter zone name (e.g., AVALON-LIONEL-01)"
          className="w-full px-4 py-3 border-2 border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-gray-900 dark:border-gray-300 border-t-transparent rounded-full"></div>
          </div>
        )}
        {filteredZones.length > 0 && !isSearching && (
          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 max-h-60 overflow-y-auto">
            {filteredZones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => handleSelectZone(zone)}
                className="w-full px-4 py-3 text-left border-b border-gray-300 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              >
                {zone}
              </button>
            ))}
          </div>
        )}
      </form>
      {selectedZone && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Selected zone: <span className="font-bold text-gray-900 dark:text-gray-300">{selectedZone}</span>
        </div>
      )}
    </div>
  );
}
