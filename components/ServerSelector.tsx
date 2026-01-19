'use client';

import { Server } from '@/lib/types';

interface ServerSelectorProps {
  selected: Server;
  onChange: (server: Server) => void;
}

const servers: Server[] = ['America', 'Europe', 'Asia'];

export default function ServerSelector({ selected, onChange }: ServerSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-base font-semibold text-gray-900 dark:text-gray-300">
        Select Server
      </label>
      <div className="flex gap-4 flex-wrap">
        {servers.map((server) => (
          <button
            key={server}
            onClick={() => onChange(server)}
            className={`px-6 py-3 border-2 font-semibold transition-colors ${
              selected === server
                ? 'bg-gray-900 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-900 dark:border-gray-300'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-900 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {server}
          </button>
        ))}
      </div>
      {/* Visual feedback for selected server */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Currently selected: <span className="font-bold text-gray-900 dark:text-gray-300">{selected}</span>
      </div>
    </div>
  );
}
