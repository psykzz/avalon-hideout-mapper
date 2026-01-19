'use client';

import { useState, useMemo } from 'react';
import ServerSelector from '@/components/ServerSelector';
import ZoneSearch from '@/components/ZoneSearch';
import HideoutList from '@/components/HideoutList';
import ReportHideoutModal from '@/components/ReportHideoutModal';
import { getAvalonZoneNames } from '@/lib/zones';
import { getHideoutsByZone } from '@/lib/hideouts';
import { Server } from '@/lib/types';

export default function Home() {
  const [selectedServer, setSelectedServer] = useState<Server>('America');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all Avalon zone names
  const zoneNames = useMemo(() => getAvalonZoneNames(), []);

  // Get hideouts for selected zone and server
  const hideouts = useMemo(() => {
    if (!selectedZone) return [];
    return getHideoutsByZone(selectedZone, selectedServer);
  }, [selectedZone, selectedServer]);

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Avalon Hideout Mapper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track hideouts across the Avalon roads of Albion Online
          </p>
        </div>

        {/* Add Hideout Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 font-semibold px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ➕ Report New Hideout
          </button>
        </div>

        {/* Report Hideout Modal */}
        <ReportHideoutModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Server Selection */}
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
          <ServerSelector 
            selected={selectedServer}
            onChange={setSelectedServer}
          />
        </div>

        {/* Zone Search */}
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
          <ZoneSearch 
            zones={zoneNames}
            onZoneSelect={handleZoneSelect}
          />
        </div>

        {/* Results */}
        {selectedZone && (
          <HideoutList 
            hideouts={hideouts}
            zoneName={selectedZone}
          />
        )}

        {/* Info Section */}
        {!selectedZone && (
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4">
              How to use
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-400">
              <li>Select your server (America, Europe, or Asia)</li>
              <li>Search for an Avalon zone by name</li>
              <li>View guilds that have hideouts in that zone</li>
              <li>Report new hideouts using the button above</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
