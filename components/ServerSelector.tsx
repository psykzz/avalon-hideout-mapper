'use client';

import { useState, useMemo } from 'react';
import { Server } from '@/lib/types';

interface ServerSelectorProps {
  selected: Server;
  onChange: (server: Server) => void;
}

const servers: Server[] = ['America', 'Europe', 'Asia'];

export default function ServerSelector({ selected, onChange }: ServerSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Server
      </label>
      <div className="flex gap-2 flex-wrap">
        {servers.map((server) => (
          <button
            key={server}
            onClick={() => onChange(server)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selected === server
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {server}
          </button>
        ))}
      </div>
    </div>
  );
}
