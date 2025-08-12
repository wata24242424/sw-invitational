// lib/types.ts
import { z } from 'zod';

/* ===== Entries ===== */
export const EntrySchema = z.object({
  name: z.string().min(1),
  avg: z.number().nonnegative().default(0),
  hasCar: z.enum(['yes', 'no']).default('no'),
  pickup: z.string().default(''),
  note: z.string().default(''),
});
export type EntryPayload = z.infer<typeof EntrySchema>;

/* ===== Simple rows (legacy endpoints) ===== */
export type PairingRow = { hole: 'OUT' | 'IN'; group: string; name: string; hc?: number };
export type LeaderboardRow = { name: string; gross: number; net?: number; thru?: string };
export type ResultsRow = { place: number; name: string; gross: number; net: number; hc: number };

/* ===== LeaderboardGrid ===== */
export type LeaderboardGrid = {
  par: number[]; // 18個、未設定は NaN 可
  players: Array<{
    name: string;
    scores: (number | null)[]; // 18個
    out: number | null;
    in: number | null;
    gross: number | null;
  }>;
};

/* ===== Awards ===== */
export type Award = {
  category: string; // "優勝" | "準優勝" | "3位" | "ドラコン" | "ニアピン" | "ぴったり賞" | ...
  name: string;
  hole?: string;
  note?: string;
};

/* ===== Tournament meta ===== */
export type Tournament = {
  slug: string;
  title: string;
  dateLabel?: string;
  dateStartUtc?: string;
  dateEndUtc?: string;
  course?: string;
  address?: string;
  participants?: number;
  fee?: number;
  thumbnail?: string;
  website?: string;
  gmaps?: string;
  isCurrent?: boolean;
};
