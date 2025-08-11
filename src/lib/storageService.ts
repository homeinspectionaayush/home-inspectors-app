import { InspectionEntry } from '@/types';
const KEY = 'hi_entries_v1';

export const storageService = {
  async init() { return; },
  async saveEntry(entry: InspectionEntry) {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(entry);
    localStorage.setItem(KEY, JSON.stringify(arr));
  },
  async getEntries(): Promise<InspectionEntry[]> {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  },
  async getEntriesByRoom(room: string): Promise<InspectionEntry[]> {
    const entries = await this.getEntries();
    return entries.filter((e: InspectionEntry) => e.room === room);
  }
};
