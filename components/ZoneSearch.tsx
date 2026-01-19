'use client';

import { useState, useMemo, ChangeEvent } from 'react';

interface ZoneSearchProps {
  zones: string[];
  onZoneSelect: (zone: string) => void;
}

export default function ZoneSearch({ zones, onZoneSelect }: ZoneSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');

  const filteredZones = useMemo(() => {
    if (!searchTerm) return [];
    return zones.filter(zone => 
      zone.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
  }, [searchTerm, zones]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectZone = (zone: string) => {
    setSearchTerm(zone);
    setSelectedZone(zone);
    onZoneSelect(zone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setSelectedZone(searchTerm);
      onZoneSelect(searchTerm);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Search for Avalon Zone
      </label>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Enter zone name (e.g., AVALON-LIONEL-01)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        {filteredZones.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredZones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => handleSelectZone(zone)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {zone}
              </button>
            ))}
          </div>
        )}
      </form>
      {selectedZone && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: <span className="font-semibold">{selectedZone}</span>
        </div>
      )}
    </div>
  );
}
