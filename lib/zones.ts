import worldData from '@/data/world.json';
import { Zone } from './types';

// Extract Avalon zones and tunnel zones from the world data
// Tunnel zones (TNL) are part of the Avalon roads system
export function getAvalonZones(): Zone[] {
  return worldData.filter((zone: Zone) => 
    zone.Index.startsWith('AVALON') || zone.Index.startsWith('TNL')
  ) as Zone[];
}

// Get unique zone names for search
// For AVALON zones, use Index (e.g., "AVALON-LIONEL-01")
// For TNL zones, use UniqueName (e.g., "Quaent-Al-Viesom")
export function getAvalonZoneNames(): string[] {
  const zones = getAvalonZones();
  return zones.map(zone => 
    zone.Index.startsWith('AVALON') ? zone.Index : zone.UniqueName
  ).sort();
}
