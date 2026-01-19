'use client';

import { useState, useMemo } from 'react';
import ServerSelector from '@/components/ServerSelector';
import ZoneSearch from '@/components/ZoneSearch';
import HideoutList from '@/components/HideoutList';
import { getAvalonZoneNames } from '@/lib/zones';
import { getHideoutsByZone } from '@/lib/hideouts';
import { Server } from '@/lib/types';

export default function Home() {
  const [selectedServer, setSelectedServer] = useState<Server>('America');
  const [selectedZone, setSelectedZone] = useState<string>('');

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

  const repoUrl = 'https://github.com/psykzz/avalon-hideout-mapper';
  const newIssueUrl = `${repoUrl}/issues/new?title=New+Hideout+Report&body=**Zone+Name:**%0A%0A**Guild+Name:**%0A%0A**Server:**%0A%0A**Additional+Notes:**%0A`;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Avalon Hideout Mapper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track hideouts across the Avalon roads of Albion Online
          </p>
        </div>

        {/* Add Hideout Button */}
        <div className="flex justify-center">
          <a
            href={newIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            ➕ Report New Hideout
          </a>
        </div>

        {/* Server Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ServerSelector 
            selected={selectedServer}
            onChange={setSelectedServer}
          />
        </div>

        {/* Zone Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              How to use
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400">
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
