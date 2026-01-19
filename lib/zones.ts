import worldData from '@/data/world.json';
import { Zone } from './types';

// Extract Avalon zones from the world data
export function getAvalonZones(): Zone[] {
  return worldData.filter((zone: Zone) => 
    zone.Index.startsWith('AVALON')
  ) as Zone[];
}

// Get unique zone names for search
export function getAvalonZoneNames(): string[] {
  const zones = getAvalonZones();
  return zones.map(zone => zone.Index).sort();
}
