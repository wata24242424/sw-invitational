import { z } from 'zod';

export const EntrySchema = z.object({
  name: z.string().min(1),
  avg: z.number().nonnegative().default(0),
  hasCar: z.enum(['yes', 'no']).default('no'),
  pickup: z.string().default(''),
  note: z.string().default(''),
});
export type EntryPayload = z.infer<typeof EntrySchema>;

export type PairingRow = { hole: 'OUT' | 'IN'; group: string; name: string; hc?: number };
export type LeaderboardRow = { name: string; gross: number; net?: number; thru?: string };
export type ResultsRow = { place: number; name: string; gross: number; net: number; hc: number };
