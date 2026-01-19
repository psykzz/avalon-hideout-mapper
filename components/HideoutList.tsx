'use client';

import { useState, useEffect } from 'react';
import { Hideout } from '@/lib/types';

interface HideoutListProps {
  hideouts: Hideout[];
  zoneName: string;
}

export default function HideoutList({ hideouts, zoneName }: HideoutListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state when zone changes
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [zoneName]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin h-6 w-6 border-2 border-gray-900 dark:border-gray-300 border-t-transparent rounded-full"></div>
          <p className="text-gray-900 dark:text-gray-300">Loading hideouts...</p>
        </div>
      </div>
    );
  }

  if (hideouts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
        <p className="text-gray-600 dark:text-gray-400">
          No hideouts reported for {zoneName}
        </p>
      </div>
    );
  }

  // Group hideouts by guild
  const guildMap = new Map<string, Hideout[]>();
  hideouts.forEach(hideout => {
    if (!guildMap.has(hideout.guildName)) {
      guildMap.set(hideout.guildName, []);
    }
    guildMap.get(hideout.guildName)!.push(hideout);
  });

  const guilds = Array.from(guildMap.keys()).sort();

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 p-8">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Hideouts in {zoneName}
      </h3>
      
      <div className="space-y-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Guilds ({guilds.length})
          </h4>
          <div className="space-y-4">
            {guilds.map((guild) => {
              const guildHideouts = guildMap.get(guild)!;
              return (
                <div 
                  key={guild}
                  className="border-2 border-gray-900 dark:border-gray-300 p-4 bg-white dark:bg-gray-800"
                >
                  <div className="font-semibold text-gray-900 dark:text-white mb-2">
                    {guild}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {guildHideouts.length} hideout{guildHideouts.length !== 1 ? 's' : ''} reported
                  </div>
                  {guildHideouts.map((hideout) => (
                    <div key={hideout.id} className="text-xs text-gray-500 dark:text-gray-500 mt-2 border-t border-gray-300 dark:border-gray-700 pt-2">
                      <span>Server: {hideout.server}</span>
                      {hideout.notes && <span className="ml-2">• {hideout.notes}</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
