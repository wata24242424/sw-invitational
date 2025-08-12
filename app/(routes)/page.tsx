import Link from 'next/link';
import { StatCard } from '@/components/StatCard';
import type { Route } from 'next';

export default async function Page() {
  const quick = [
    { href: '/pairings', label: '組み合わせ' },
    { href: '/leaderboard', label: 'リーダーボード' },
    { href: '/results', label: '結果' },
    { href: '/gallery', label: 'ギャラリー' },
    { href: '/entry', label: 'エントリー' },
  ] satisfies ReadonlyArray<{ href: Route; label: string }>;

  return (
    <section className="grid gap-6">
      {/* …中略… */}
      <div className="card">
        <h2 className="text-lg font-semibold">クイックリンク</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="btn-primary">
              {q.label}
            </Link>
          ))}
        </div>
      </div>
      {/* …中略… */}
    </section>
  );
}
