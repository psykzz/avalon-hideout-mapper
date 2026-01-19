'use client';

import { Hideout } from '@/lib/types';

interface HideoutListProps {
  hideouts: Hideout[];
  zoneName: string;
}

export default function HideoutList({ hideouts, zoneName }: HideoutListProps) {
  if (hideouts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Hideouts in {zoneName}
      </h3>
      
      <div className="space-y-4">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Guilds ({guilds.length})
          </h4>
          <div className="space-y-2">
            {guilds.map((guild) => {
              const guildHideouts = guildMap.get(guild)!;
              return (
                <div 
                  key={guild}
                  className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {guild}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {guildHideouts.length} hideout{guildHideouts.length !== 1 ? 's' : ''} reported
                  </div>
                  {guildHideouts.map((hideout) => (
                    <div key={hideout.id} className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
