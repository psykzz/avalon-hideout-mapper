// Type definitions for the Avalon Hideout Mapper

export type Server = 'America' | 'Europe' | 'Asia';

export interface Zone {
  Index: string;
  UniqueName: string;
}

export interface Hideout {
  id: string;
  zoneName: string;
  guildName: string;
  server: Server;
  reportedDate: string;
  notes?: string;
}

export interface HideoutData {
  hideouts: Hideout[];
}
