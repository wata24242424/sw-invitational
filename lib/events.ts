// lib/events.ts
export type Tournament = {
  slug: string;
  title: string;
  date?: string;
  venue?: string;
  isCurrent?: boolean;
};

export const tournaments: Tournament[] = [
  { slug: '2025-spring', title: 'SW Invitational 2025 Spring', date: '2025/04/20', venue: '東雲カントリークラブ', isCurrent: true },
  { slug: '2024-winter', title: 'SW Invitational 2024 Winter', date: '2024/12/08', venue: '舞浜リンクス' },
  { slug: '2024-summer', title: 'SW Invitational 2024 Summer', date: '2024/08/03', venue: '湘南グリーン' },
];
