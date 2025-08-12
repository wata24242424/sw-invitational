'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LeaderboardSwitcher({ items }: { items: { slug: string; title: string }[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const cur = sp.get('t') || items[0]?.slug || '';

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    router.push(`/leaderboard?t=${encodeURIComponent(slug)}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-black/60">大会を選択：</label>
      <select className="border rounded-xl px-3 py-2" value={cur} onChange={onChange}>
        {items.map((it) => (
          <option key={it.slug} value={it.slug}>{it.title}</option>
        ))}
      </select>
    </div>
  );
}
