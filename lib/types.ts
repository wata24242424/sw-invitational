import { z } from 'zod';

/* ===== Entry ===== */
export const EntrySchema = z.object({
  name: z.string().min(1),
  avg: z.number().nonnegative().default(0),
  hasCar: z.enum(['yes', 'no']).default('no'),
  pickup: z.string().default(''),
  note: z.string().default(''),
});
export type EntryPayload = z.infer<typeof EntrySchema>;

/* ===== Sheets rows ===== */
export type PairingRow = { hole: 'OUT' | 'IN'; group: string; name: string; hc?: number };
export type LeaderboardRow = { name: string; gross: number; net?: number; thru?: string };
export type ResultsRow = { place: number; name: string; gross: number; net: number; hc: number };

/* ===== Tournaments ===== */
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

/* ===== LeaderboardGrid（今回の新形式） ===== */
export type LeaderboardGrid = {
  par: number[]; // 長さ18、1〜18のPAR（未入力はNaN可）
  players: Array<{
    name: string;
    scores: (number | null)[]; // 長さ18、未入力はnull
    out: number | null;        // 1-9合計
    in: number | null;         // 10-18合計
    gross: number | null;      // 1-18合計
  }>;
};

/* ===== Awards（表彰） ===== */
export type Award = {
  category: '優勝' | '準優勝' | '3位' | 'ドラコン' | 'ニアピン' | 'ぴったり賞' | string;
  name: string;
  hole?: string;   // 例: "5" など
  note?: string;   // 備考
};
