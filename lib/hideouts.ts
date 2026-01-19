import { Hideout, Server, HideoutData } from './types';
import hideoutDataJson from '@/data/hideouts.json';

const hideoutData = hideoutDataJson as HideoutData;

// Get all hideouts
export function getAllHideouts(): Hideout[] {
  return hideoutData.hideouts;
}

// Filter hideouts by zone name
export function getHideoutsByZone(zoneName: string, server?: Server): Hideout[] {
  let filtered = getAllHideouts().filter(
    hideout => hideout.zoneName.toLowerCase() === zoneName.toLowerCase()
  );
  
  if (server) {
    filtered = filtered.filter(hideout => hideout.server === server);
  }
  
  return filtered;
}

// Get guilds that have hideouts in a specific zone
export function getGuildsByZone(zoneName: string, server?: Server): string[] {
  const hideouts = getHideoutsByZone(zoneName, server);
  const guilds = hideouts.map(h => h.guildName);
  return [...new Set(guilds)].sort();
}

// Filter hideouts by server
export function getHideoutsByServer(server: Server): Hideout[] {
  return getAllHideouts().filter(hideout => hideout.server === server);
}
